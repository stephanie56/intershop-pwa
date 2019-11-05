import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { mapErrorToAction, mapToPayload } from 'ish-core/utils/operators';

import * as actions from './viewcontexts.actions';

@Injectable()
export class ViewcontextsEffects {
  constructor(private actions$: Actions, private cmsService: CMSService) {}

  @Effect()
  loadViewContextEntrypoint$ = this.actions$.pipe(
    ofType<actions.LoadViewContextEntrypoint>(actions.ViewcontextsActionTypes.LoadViewContextEntrypoint),
    mapToPayload(),
    switchMap(({ viewcontextId, callParameters, clientId }) =>
      this.cmsService.getViewContextContent(viewcontextId, callParameters, clientId).pipe(
        map(entrypoint => new actions.LoadViewContextEntrypointSuccess(entrypoint)),
        mapErrorToAction(actions.LoadViewContextEntrypointFail)
      )
    )
  );
}
