import { CallExpression, SourceFile, SyntaxKind } from 'ts-morph';

export class ActionCreatorsEffectMorpher {
  constructor(public effectsFile: SourceFile) {}

  private addImportStatements() {
    this.effectsFile.addImportDeclaration({
      moduleSpecifier: '@ngrx/store',
      namedImports: ['createEffect'],
    });
  }

  migrateEffects() {
    this.addImportStatements();
    console.log('replacing effects...');
    this.effectsFile
      .getClasses()[0]
      .getChildrenOfKind(SyntaxKind.PropertyDeclaration)
      .forEach(effect => {
        // retrieve information from effect
        const name = effect.getFirstChildByKindOrThrow(SyntaxKind.Identifier).getText();
        const logic = effect.getFirstChildByKindOrThrow(SyntaxKind.CallExpression);
        // add new updated property declaration
        const newEffect = this.effectsFile.getClasses()[0].addProperty({
          name,
          initializer: `createEffect(() => ${logic.getText()})`,
        });
        newEffect
          .getFirstDescendantByKindOrThrow(SyntaxKind.ArrowFunction)
          .getFirstChildByKind(SyntaxKind.CallExpression)
          // get pipe functions
          .getChildrenOfKind(SyntaxKind.CallExpression)
          .filter(exp => exp.getFirstChildByKind(SyntaxKind.Identifier).getText() === 'ofType')
          .forEach(exp => {
            if (exp) {
              console.log(exp.getFirstChildByKind(SyntaxKind.TypeReference).getText());
            }
          });
        effect.remove();
      });
  }
}
