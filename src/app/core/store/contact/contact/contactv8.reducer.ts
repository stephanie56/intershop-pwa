import { Action, createReducer, on } from '@ngrx/store';

import * as actions from './contactv8.actions';
export interface ContactState {
  subjects: string[];
  loading: boolean;
  success: boolean;
}

export const initialState: ContactState = {
  subjects: [],
  loading: false,
  success: undefined,
};
const contactReducerV8 = createReducer(
  initialState,
  on(actions.loadContact, state => ({
    ...state,
    loading: true,
    success: undefined,
  })),
  on(actions.loadContactFail, state => ({
    ...state,
    loading: false,
    success: undefined,
  })),
  on(actions.loadContactSuccess, (state, { subjects }) => ({
    ...state,
    subjects,
    loading: false,
    success: undefined,
  })),
  on(actions.createContact, state => ({
    ...state,
    loading: true,
    success: undefined,
  })),
  on(actions.createContactFail, state => ({
    ...state,
    loading: false,
    success: false,
  })),
  on(actions.createContactSuccess, state => ({
    ...state,
    loading: false,
    success: true,
  }))
);
export function contactReducer(state = initialState, action: Action): ContactState {
  return contactReducerV8(state, action);
}
