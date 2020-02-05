import { SourceFile, SyntaxKind, VariableDeclarationKind } from 'ts-morph';

export function replaceReducer(storeName: string, reducerFile: SourceFile) {
  console.log('replacing reducers...');
  addImports(storeName, reducerFile);
  // retrieve reducer logic from old reducer
  const switchStatements = [];
  reducerFile
    .getFunction(`${storeName}Reducer`)
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
  const reducer = reducerFile.addVariableStatement({
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
    const arrowFunction = statement.hasLogic ? `(state, action) => ${statement.block}` : `state => ${statement.block}`;
    createReducerFunction.addArgument(`on(${storeName}Actions.${type}, ${arrowFunction})`);
  });

  updateFeatureReducer(storeName, reducerFile);
  reducerFile.fixMissingImports();
  reducerFile.fixUnusedIdentifiers();
}

function addImports(storeName: string, reducerFile: SourceFile) {
  reducerFile.addImportDeclaration({
    kind: 14,
    defaultImport: undefined,
    moduleSpecifier: '@ngrx/store',
    namedImports: ['on'],
  });
  reducerFile.addImportDeclaration({
    kind: 14,
    defaultImport: undefined,
    moduleSpecifier: `./${storeName}.actions`,
    namedImports: [],
    namespaceImport: `${storeName}Actions`,
  });
}

function updateFeatureReducer(storeName: string, reducerFile: SourceFile) {
  reducerFile
    .getFunction(`${storeName}Reducer`)
    .getParameter('action')
    .remove();
  reducerFile.getFunction(`${storeName}Reducer`).addParameter({ name: 'action', type: 'Action' });
  reducerFile
    .getFunction(`${storeName}Reducer`)
    .getFirstChildByKindOrThrow(SyntaxKind.Block)
    .getStatements()
    .forEach(statement => statement.remove());
  reducerFile
    .getFunction(`${storeName}Reducer`)
    .getFirstChildByKindOrThrow(SyntaxKind.Block)
    .addStatements([`return reducer(state,action)`]);
}
