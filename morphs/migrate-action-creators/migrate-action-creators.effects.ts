import { CallExpression, SourceFile, SyntaxKind } from 'ts-morph';

export class ActionCreatorsEffectMorpher {
  constructor(public storeName: string, public effectsFile: SourceFile) {}

  private addImportStatements() {
    this.effectsFile.addImportDeclaration({
      moduleSpecifier: '@ngrx/store',
      namedImports: ['createEffect'],
    });
    this.effectsFile.addImportDeclaration({
      moduleSpecifier: `./${this.storeName}.actions`,
      namespaceImport: `${this.storeName}Actions`,
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
        let logic = effect.getFirstChildByKindOrThrow(SyntaxKind.CallExpression);
        // update effect logic
        logic = this.updateOfType(logic);
        // add new updated property declaration
        const newEffect = this.effectsFile.getClasses()[0].addProperty({
          name,
          initializer: `createEffect(() => ${logic.getText()})`,
        });
        effect.remove();
      });
  }

  private updateOfType(pipe: CallExpression): CallExpression {
    pipe
      // get piped functions
      .getChildrenOfKind(SyntaxKind.CallExpression)
      .filter(exp => exp.getFirstChildByKind(SyntaxKind.Identifier).getText() === 'ofType')
      .forEach(exp => {
        if (exp) {
          // remove Type Argument and update actionType
          const argument = exp.getFirstChildByKind(SyntaxKind.PropertyAccessExpression);
          exp.removeTypeArgument(exp.getFirstChildByKind(SyntaxKind.TypeReference));
          exp.addArgument(
            `${this.storeName}Actions.${argument
              .getLastChildByKind(SyntaxKind.Identifier)
              .getText()
              .replace(/^\w/, c => c.toLowerCase())}`
          );
          exp.removeArgument(argument);
        }
      });
    return pipe;
  }
}
