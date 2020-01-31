import { SourceFile, SyntaxKind, VariableDeclarationKind } from 'ts-morph';

export function replaceReducer(storeName: string, reducerFile: SourceFile) {
  console.log('replacing reducers...');
  addStarImport(storeName, reducerFile);
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
      // if payload is used, retrieve the object binding
      const objectBinding = hasLogic
        ? clause
            .getFirstChildByKindOrThrow(SyntaxKind.Block)
            .getFirstDescendantByKind(SyntaxKind.ObjectBindingPattern)
            .getText()
        : undefined;
      // push information about switch statement to array
      switchStatements.push({
        identifier: clause.getFirstChildByKindOrThrow(SyntaxKind.PropertyAccessExpression).getName(),
        hasLogic,
        objectBinding,
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
    const arrowFunction = statement.hasLogic
      ? `(state, ${statement.objectBinding}) => ${statement.block}` // TODO: Use RegExp to remove first line
      : `state => ${statement.block}`;
    createReducerFunction.addArgument(`on(${type}, ${arrowFunction})`);
  });
}

function addStarImport(storeName: string, reducerFile: SourceFile) {
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
    .getFirstChildByKindOrThrow(SyntaxKind.Block)
    .getStatements()
    .forEach(statement => statement.remove());
  // TODO: add return statement referencing the new reducer
  reducerFile
    .getFunction(`${storeName}Reducer`)
    .getFirstChildByKindOrThrow(SyntaxKind.Block)
    .addStatements([]);
}
