import { SourceFile, SyntaxKind, VariableDeclarationKind } from 'ts-morph';

export class ActionCreatorsReducerMorpher {
  constructor(public storeName: string, public reducerFile: SourceFile) {}

  migrateReducer() {
    this.addImports();
    this.updateReducer();
    this.updateFeatureReducer();
    this.reducerFile.fixMissingImports();
    this.reducerFile.fixUnusedIdentifiers();
  }

  private updateReducer() {
    console.log('replacing reducers...');
    // retrieve reducer logic from old reducer
    const switchStatements = [];
    this.reducerFile
      .getFunction(`${this.storeName}Reducer`)
      .getFirstDescendantByKind(SyntaxKind.CaseBlock)
      .getClauses()
      .forEach(clause => {
        // is it a static return or is the payload used?
        const hasLogic =
          clause
            .getFirstChildByKindOrThrow(SyntaxKind.Block)
            .getStatements()[0]
            .getKind() !== SyntaxKind.ReturnStatement;
        // push information about switch statement to array
        switchStatements.push({
          identifier: clause.getFirstChildByKindOrThrow(SyntaxKind.PropertyAccessExpression).getName(),
          hasLogic,
          block: clause.getFirstChildByKindOrThrow(SyntaxKind.Block).getText(),
        });
      });

    // create new reducer function
    const reducer = this.reducerFile.addVariableStatement({
      isExported: false,
      isDefaultExport: false,
      hasDeclareKeyword: false,
      docs: [],
      kind: 39,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [
        {
          name: 'reducer',
          initializer: 'createReducer()',
          type: undefined,
          hasExclamationToken: false,
          kind: 38,
        },
      ],
    });
    const createReducerFunction = reducer.getFirstDescendantByKindOrThrow(SyntaxKind.CallExpression);
    // add first reducer argument
    createReducerFunction.addArgument('initialState');
    // for each switch case, add a new on()-function
    switchStatements.forEach(statement => {
      // name of the actionCreator function
      const type = statement.identifier.charAt(0).toLowerCase() + statement.identifier.substr(1);
      const arrowFunction = statement.hasLogic
        ? `(state, action) => ${statement.block}`
        : `state => ${statement.block}`;
      createReducerFunction.addArgument(`on(${this.storeName}Actions.${type}, ${arrowFunction})`);
    });
  }

  private addImports() {
    this.reducerFile.addImportDeclaration({
      kind: 14,
      defaultImport: undefined,
      moduleSpecifier: '@ngrx/store',
      namedImports: ['on'],
    });
    this.reducerFile.addImportDeclaration({
      kind: 14,
      defaultImport: undefined,
      moduleSpecifier: `./${this.storeName}.actions`,
      namedImports: [],
      namespaceImport: `${this.storeName}Actions`,
    });
  }

  private updateFeatureReducer() {
    this.reducerFile
      .getFunction(`${this.storeName}Reducer`)
      .getParameter('action')
      .remove();
    this.reducerFile.getFunction(`${this.storeName}Reducer`).addParameter({ name: 'action', type: 'Action' });
    this.reducerFile
      .getFunction(`${this.storeName}Reducer`)
      .getFirstChildByKindOrThrow(SyntaxKind.Block)
      .getStatements()
      .forEach(statement => statement.remove());
    this.reducerFile
      .getFunction(`${this.storeName}Reducer`)
      .getFirstChildByKindOrThrow(SyntaxKind.Block)
      .addStatements([`return reducer(state,action)`]);
  }
}
