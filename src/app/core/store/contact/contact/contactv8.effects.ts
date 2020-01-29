import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, map, mapTo } from 'rxjs/operators';

import { ContactService } from 'ish-core/services/contact/contact.service';
import { mapErrorToActionV8, mapToProperty } from 'ish-core/utils/operators';

import * as contactActions from './contactv8.actions';

@Injectable()
export class ContactEffects {
  constructor(private actions$: Actions, private store: Store<{}>, private contactService: ContactService) {}

  /**
   * Load the contact subjects, which the customer can select for his request
   */
  loadSubjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(contactActions.loadContact),
      concatMap(() =>
        this.contactService.getContactSubjects().pipe(
          map(subjects => contactActions.loadContactSuccess({ subjects })),
          mapErrorToActionV8(contactActions.loadContactFail)
        )
      )
    )
  );

  /**
   * Send the contact request, when a customer want to get in contact with the shop
   */
  createContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(contactActions.createContact),
      mapToProperty('contact'),
      concatMap(contact =>
        this.contactService.createContactRequest(contact).pipe(
          mapTo(contactActions.createContactSuccess()),
          mapErrorToActionV8(contactActions.createContactFail)
        )
      )
    )
  );
}
