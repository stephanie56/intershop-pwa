import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { contentReducers } from 'ish-core/store/content/content-store.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import * as actions from './viewcontexts.actions';
import {
  getNumberOfViewcontexts,
  getViewcontextEntities,
  getViewcontexts,
  getViewcontextsError,
  getViewcontextsLoading,
} from './viewcontexts.selectors';

describe('Viewcontexts Selectors', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        reducers: {
          ...coreReducers,
          content: combineReducers(contentReducers),
        },
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getViewcontextsLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getViewcontextsError(store$.state)).toBeUndefined();
    });

    it('should not have entites when in initial state', () => {
      expect(getViewcontextEntities(store$.state)).toBeEmpty();
      expect(getViewcontexts(store$.state)).toBeEmpty();
      expect(getNumberOfViewcontexts(store$.state)).toBe(0);
    });
  });

  describe('LoadViewContextEntrypoint', () => {
    const action = new actions.LoadViewContextEntrypoint({
      viewcontextId: 'test',
      callParameters: {},
      clientId: 'test-id',
    });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getViewcontextsLoading(store$.state)).toBeTrue();
    });

    describe('LoadViewContextEntrypointSuccess', () => {
      const successAction = new actions.LoadViewContextEntrypointSuccess({
        entrypoint: { id: 'test' } as ContentPageletEntryPoint,
        pagelets: [],
      });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getViewcontextsLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getViewcontextsError(store$.state)).toBeUndefined();
      });

      it('should have entites when successfully loading', () => {
        expect(getViewcontextEntities(store$.state)).not.toBeEmpty();
        expect(getViewcontexts(store$.state)).not.toBeEmpty();
        expect(getNumberOfViewcontexts(store$.state)).toBe(1);
      });
    });

    describe('LoadViewContextEntrypointFail', () => {
      const error = { error: 'ERROR' } as HttpError;
      const failAction = new actions.LoadViewContextEntrypointFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getViewcontextsLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getViewcontextsError(store$.state)).toBeTruthy();
      });

      it('should not have entites when reducing error', () => {
        expect(getViewcontextEntities(store$.state)).toBeEmpty();
        expect(getViewcontexts(store$.state)).toBeEmpty();
        expect(getNumberOfViewcontexts(store$.state)).toBe(0);
      });
    });
  });
});
