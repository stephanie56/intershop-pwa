import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { ContactState } from './contact-store';
import { ContactEffects } from './contact/contactv8.effects';
import { contactReducer } from './contact/contactv8.reducer';

export const contactReducers: ActionReducerMap<ContactState> = {
  contact: contactReducer,
};

export const contactEffects = [ContactEffects];

@NgModule({
  imports: [EffectsModule.forFeature(contactEffects), StoreModule.forFeature('contact', contactReducers)],
})
export class ContactStoreModule {}
