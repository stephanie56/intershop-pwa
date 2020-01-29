import { createFeatureSelector } from '@ngrx/store';

import { ContactState as ContactReducerState } from './contact/contactv8.reducer';

export interface ContactState {
  contact: ContactReducerState;
}

export const getContactState = createFeatureSelector<ContactState>('contact');
