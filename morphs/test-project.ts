import { Project, SyntaxKind } from 'ts-morph';

const storeName = 'contact';
const project = new Project({
  tsConfigFilePath: 'D:/projects/pwa-github/tsconfig.json',
});
const test = project.getSourceFile('contactv8.actions.ts');
console.log(test.getVariableStatements()[0].getStructure());

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
    // TODO

    /* const createActionStructure = {
      isExported: true,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [
        {
          name: kebabCase(className),
          initializer: "createAction('[Contact Internal] Load Contact Subjects')",
        },
      ],
    };
    actionsFile.addVariableStatement(createActionStructure); */
  });
}
