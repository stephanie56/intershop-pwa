import { Project } from 'ts-morph';

import { readActionTypes, replaceActions } from './migrate-action-creators.actions';
import { replaceReducer } from './migrate-action-creators.reducers';

const storeName = 'contact';
const project = new Project({
  tsConfigFilePath: 'E:/Projects/pwa-github/tsconfig.json',
});

// migrate actions
const actionsFile = project.getSourceFile(`${storeName}.actions.ts`);
const actionTypes = readActionTypes(actionsFile);
replaceActions(actionsFile, actionTypes);

// migrate reducer
const reducerFile = project.getSourceFile(`${storeName}.reducer.ts`);
replaceReducer(storeName, reducerFile);
project.save();
