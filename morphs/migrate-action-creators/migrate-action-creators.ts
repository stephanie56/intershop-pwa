import { Project } from 'ts-morph';

import { ActionCreatorsActionsMorpher } from './migrate-action-creators.actions';
import { ActionCreatorsReducerMorpher } from './migrate-action-creators.reducers';

const storeName = 'contact';
const project = new Project({
  tsConfigFilePath: 'E:/Projects/pwa-github/tsconfig.json',
});

// migrate actions
const actionMorph = new ActionCreatorsActionsMorpher(project.getSourceFile(`${storeName}.actions.ts`));
actionMorph.replaceActions();

// migrate reducer
const reducerMorph = new ActionCreatorsReducerMorpher(storeName, project.getSourceFile(`${storeName}.reducer.ts`));
reducerMorph.migrateReducer();
project.save();
