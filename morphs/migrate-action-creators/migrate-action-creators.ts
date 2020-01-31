import { Project, SyntaxKind, VariableDeclarationKind } from 'ts-morph';

import { readActionTypes, replaceActions } from './migrate-action-creators.actions';

const storeName = 'contact';
const project = new Project({
  tsConfigFilePath: 'D:/projects/pwa-github/tsconfig.json',
});

// read actions source file
const actionsFile = project.getSourceFile(`${storeName}.actions.ts`);
const actionTypes = readActionTypes(actionsFile);
console.log(actionTypes);

replaceActions(actionsFile, actionTypes);
project.save();
