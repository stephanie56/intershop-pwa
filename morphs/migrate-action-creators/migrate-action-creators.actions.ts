import { ClassDeclaration, SourceFile, SyntaxKind, VariableDeclarationKind } from 'ts-morph';

export class ActionCreatorsActionsMorpher {
  actionTypes: { [typeName: string]: string };

  constructor(public actionsFile: SourceFile) {}

  migrateActions(updateGlobalReferences: boolean = true) {
    this.readActionTypes();
    this.replaceActions(updateGlobalReferences);
    // clean up old code
    this.actionsFile.getEnums()[0].remove();
    this.actionsFile.getTypeAliases()[0].remove();
    this.actionsFile.fixMissingImports();
    this.actionsFile.fixUnusedIdentifiers();
  }
  private readActionTypes() {
    console.log('reading action types...');
    this.actionTypes = this.actionsFile
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

  private replaceActions(updateGlobalReferences: boolean) {
    console.log('replacing action classes with creator functions...');
    this.actionsFile.getClasses().forEach(actionClass => {
      // retrieve basic action information
      const className = actionClass.getName();
      const typeString = this.actionTypes[className];
      // get constructor information
      const hasConstructor = actionClass.getConstructors().length > 0;
      const constructorContents = hasConstructor
        ? actionClass
            .getConstructors()[0]
            .getParameter('payload')
            .getText()
            .replace('public ', '')
        : '';

      // assemble structure object
      const createActionStructure = {
        isExported: true,
        isDefaultExport: false,
        hasDeclareKeyword: false,
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: className.replace(/^\w/, c => c.toLowerCase()),
            initializer: hasConstructor
              ? `createAction(${typeString}, props<{${constructorContents}}>())`
              : `createAction(${typeString})`,
            type: undefined,
            hasExclamationToken: false,
            kind: 38,
          },
        ],
      };
      // add variable statement to file
      this.actionsFile.addVariableStatement(createActionStructure);
      // update references in other files
      if (updateGlobalReferences) {
        this.updateGlobalReferences(actionClass);
      }
      // remove class from file
      actionClass.remove();
    });
  }

  private updateGlobalReferences(actionClass: ClassDeclaration) {
    console.log(`updating references for ${actionClass.getName()}...`);
    actionClass.findReferencesAsNodes().forEach(reference => {
      // exclude tests and the actions file itself
      if (
        !reference
          .getSourceFile()
          .getBaseName()
          .includes('spec.ts') &&
        reference.getSourceFile() !== this.actionsFile
      ) {
        const newExpression = reference.getFirstAncestor(ancestor => ancestor.getKind() === SyntaxKind.NewExpression);
        // update new Expressions
        if (newExpression) {
          // swap new class instantiation to actionCreator call
          const hasArgument = newExpression.forEachChildAsArray().length > 1;
          const argument = hasArgument ? newExpression.forEachChildAsArray()[1].getText() : '';
          // update dispatch calls
          if (
            newExpression.getParent().getKind() === SyntaxKind.CallExpression &&
            newExpression.getParent().getFirstChildByKind(SyntaxKind.PropertyAccessExpression) &&
            newExpression
              .getParent()
              .getFirstChildByKind(SyntaxKind.PropertyAccessExpression)
              .getFirstChildByKind(SyntaxKind.Identifier)
              .getText() === 'dispatch'
          ) {
            console.log(`    ${newExpression.getSourceFile().getBaseName()}`);
            newExpression
              .getParentIfKind(SyntaxKind.CallExpression)
              .addArgument(`${actionClass.getName().replace(/^\w/, c => c.toLowerCase())}(${argument})`);
            newExpression.getParentIfKind(SyntaxKind.CallExpression).removeArgument(newExpression);
          }
        }
      }
    });
  }
}
