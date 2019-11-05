import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { IncludesAction, IncludesActionTypes } from 'ish-core/store/content/includes/includes.actions';
import { PageAction, PagesActionTypes } from 'ish-core/store/content/pages/pages.actions';
import { ViewcontextsAction, ViewcontextsActionTypes } from 'ish-core/store/content/viewcontexts/viewcontexts.actions';

export interface PageletsState extends EntityState<ContentPagelet> {}

export const pageletsAdapter = createEntityAdapter<ContentPagelet>();

export const initialState = pageletsAdapter.getInitialState();

export function pageletsReducer(state = initialState, action: IncludesAction | PageAction | ViewcontextsAction) {
  switch (action.type) {
    case IncludesActionTypes.LoadContentIncludeSuccess: {
      return pageletsAdapter.upsertMany(action.payload.pagelets, state);
    }
    case PagesActionTypes.LoadContentPageSuccess: {
      return pageletsAdapter.upsertMany(action.payload.pagelets, state);
    }
    case ViewcontextsActionTypes.LoadViewContextEntrypointSuccess: {
      return pageletsAdapter.upsertMany(action.payload.pagelets, state);
    }
  }

  return state;
}
