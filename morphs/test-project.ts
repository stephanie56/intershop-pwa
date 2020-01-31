import { Project, SyntaxKind, VariableDeclarationKind } from 'ts-morph';

const storeName = 'contact';
const project = new Project({
  tsConfigFilePath: 'D:/projects/pwa-github/tsconfig.json',
});
// read actions source file
const actionsFile = project.getSourceFile(`${storeName}.actions.ts`);
const actionTypes = readActionTypes();
console.log(actionTypes);

replaceActions();
project.save();

function readActionTypes() {
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

function replaceActions() {
  console.log('replacing Action Classes with creator Functions...');
  actionsFile.getClasses().forEach(actionClass => {
    // retrieve basic action information
    const className = actionClass.getName();
    console.log(`Class name: ${className}`);
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
    console.log(constructorContents);

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
