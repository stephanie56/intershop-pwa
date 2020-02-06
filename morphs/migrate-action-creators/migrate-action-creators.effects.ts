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
        logic = this.updateMap(logic);
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
          const argument = exp.getArguments()[0];
          exp.removeTypeArgument(exp.getFirstChildByKind(SyntaxKind.TypeReference));
          const t = argument.getLastChildByKind(SyntaxKind.Identifier) || argument;
          exp.addArgument(`${this.storeName}Actions.${t.getText().replace(/^\w/, c => c.toLowerCase())}`);
          exp.removeArgument(argument);
        }
      });
    return pipe;
  }

  private updateMap(pipe: CallExpression): CallExpression {
    const lastCall = pipe.getLastChildByKind(SyntaxKind.CallExpression);
    if (this.isMap(lastCall.getFirstChildByKind(SyntaxKind.Identifier).getText())) {
      console.log(lastCall.getFirstChildByKind(SyntaxKind.Identifier).getText());
      return pipe;
    }
    return pipe;
  }

  private isMap(identifier: string) {
    return identifier === 'map' || 'concatMap' || 'mergeMap' || 'switchMap' || 'mapTo';
  }
}
