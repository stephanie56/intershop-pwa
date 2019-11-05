import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { ViewcontextsAction, ViewcontextsActionTypes } from './viewcontexts.actions';

export const viewcontextsAdapter = createEntityAdapter<ContentPageletEntryPoint>({
  selectId: viewcontext => viewcontext.clientId,
});

export interface ViewcontextsState extends EntityState<ContentPageletEntryPoint> {
  loading: boolean;
  error: HttpError;
}

export const initialState: ViewcontextsState = viewcontextsAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export function viewcontextsReducer(state = initialState, action: ViewcontextsAction): ViewcontextsState {
  switch (action.type) {
    case ViewcontextsActionTypes.LoadViewContextEntrypoint: {
      return {
        ...state,
        loading: true,
      };
    }

    case ViewcontextsActionTypes.LoadViewContextEntrypointFail: {
      const { error } = action.payload;
      return {
        ...state,
        loading: false,
        error,
      };
    }

    case ViewcontextsActionTypes.LoadViewContextEntrypointSuccess: {
      const { entrypoint } = action.payload;

      return {
        ...viewcontextsAdapter.upsertOne(entrypoint, state),
        loading: false,
        error: undefined,
      };
    }
  }

  return state;
}
