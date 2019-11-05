import { Action } from '@ngrx/store';

import { CallParameters } from 'ish-core/models/call-parameters/call-parameters.model';
import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

export enum ViewcontextsActionTypes {
  LoadViewContextEntrypoint = '[Content View Context] Load Entrypoint',
  LoadViewContextEntrypointFail = '[Content View Context API] Load Entrypoint Fail',
  LoadViewContextEntrypointSuccess = '[Content View Context API] Load Entrypoint Success',
}

export class LoadViewContextEntrypoint implements Action {
  readonly type = ViewcontextsActionTypes.LoadViewContextEntrypoint;
  constructor(public payload: { viewcontextId: string; callParameters: CallParameters; clientId: string }) {}
}

export class LoadViewContextEntrypointFail implements Action {
  readonly type = ViewcontextsActionTypes.LoadViewContextEntrypointFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadViewContextEntrypointSuccess implements Action {
  readonly type = ViewcontextsActionTypes.LoadViewContextEntrypointSuccess;
  constructor(public payload: { entrypoint: ContentPageletEntryPoint; pagelets: ContentPagelet[] }) {}
}

export type ViewcontextsAction =
  | LoadViewContextEntrypoint
  | LoadViewContextEntrypointFail
  | LoadViewContextEntrypointSuccess;
