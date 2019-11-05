import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { CMSService } from 'ish-core/services/cms/cms.service';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import * as actions from './viewcontexts.actions';
import { ViewcontextsEffects } from './viewcontexts.effects';

describe('Viewcontexts Effects', () => {
  let actions$: Observable<Action>;
  let effects: ViewcontextsEffects;
  let cmsServiceMock: CMSService;

  beforeEach(() => {
    cmsServiceMock = mock(CMSService);

    TestBed.configureTestingModule({
      imports: [ngrxTesting()],
      providers: [
        ViewcontextsEffects,
        provideMockActions(() => actions$),
        { provide: CMSService, useFactory: () => instance(cmsServiceMock) },
      ],
    });

    effects = TestBed.get(ViewcontextsEffects);
  });

  describe('loadViewContextEntrypoint$', () => {
    it('TODO: should not dispatch actions when encountering LoadViewcontexts', () => {
      when(cmsServiceMock.getViewContextContent(anything(), anything(), anything())).thenReturn(
        of({ entrypoint: { id: 'test' } as ContentPageletEntryPoint, pagelets: [] })
      );

      const action = new actions.LoadViewContextEntrypoint({
        viewcontextId: 'test',
        callParameters: {},
        clientId: 'test-id',
      });
      const completion = new actions.LoadViewContextEntrypointSuccess({
        entrypoint: { id: 'test' } as ContentPageletEntryPoint,
        pagelets: [],
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadViewContextEntrypoint$).toBeObservable(expected$);
    });
  });
});
