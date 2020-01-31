import { SourceFile, SyntaxKind, VariableDeclarationKind } from 'ts-morph';

export function readActionTypes(actionsFile: SourceFile) {
  console.log('reading action types...');
  return actionsFile
    .getEnums()[0]
    .getMembers()
    .reduce(
      (acc, current) => ({
        ...acc,
        [current.getName()]: current.getInitializer().getText(),
      }),
      {}
    );
}

export function replaceActions(actionsFile: SourceFile, actionTypes: { [typeName: string]: string }) {
  console.log('replacing action classes with creator functions...');
  actionsFile.getClasses().forEach(actionClass => {
    // retrieve basic action information
    const className = actionClass.getName();
    const typeString = actionTypes[className];
    // get constructor information
    const hasConstructor = actionClass.getConstructors().length > 0;
    const constructorContents = hasConstructor
      ? actionClass
          .getConstructors()[0]
          .getParameter('payload')
          .getFirstChildByKind(SyntaxKind.TypeLiteral)
          .getText()
      : '';

    // assemble structure object
    const createActionStructure = {
      isExported: true,
      isDefaultExport: false,
      hasDeclareKeyword: false,
      docs: [],
      kind: 39,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [
        {
          name: className.charAt(0).toLowerCase() + className.substr(1),
          initializer: hasConstructor
            ? `createAction(${typeString}, props<${constructorContents}>())`
            : `createAction(${typeString})`,
          type: undefined,
          hasExclamationToken: false,
          kind: 38,
        },
      ],
    };
    // add variable statement to file
    actionsFile.addVariableStatement(createActionStructure);
    // remove class from file
    actionClass.remove();
  });
  // clean up old code
  actionsFile.getEnums()[0].remove();
  actionsFile.getTypeAliases()[0].remove();
  actionsFile.fixMissingImports();
  actionsFile.fixUnusedIdentifiers();
}
