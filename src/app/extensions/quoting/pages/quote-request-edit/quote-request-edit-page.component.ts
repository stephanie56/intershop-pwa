import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { User } from 'ish-core/models/user/user.model';

import { QuotingFacade } from '../../facades/quoting.facade';
import { QuoteRequest } from '../../models/quote-request/quote-request.model';

@Component({
  selector: 'ish-quote-request-edit-page',
  templateUrl: './quote-request-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteRequestEditPageComponent implements OnInit, OnDestroy {
  quote$: Observable<QuoteRequest>;
  quoteRequestLoading$: Observable<boolean>;
  quoteRequestError$: Observable<HttpError>;
  user$: Observable<User>;
  submitted$: Observable<boolean>;

  private destroy$ = new Subject();

  constructor(
    private quotingFacade: QuotingFacade,
    private accountFacade: AccountFacade,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.quote$ = this.quotingFacade.quoteRequest$;
    this.quoteRequestLoading$ = this.quotingFacade.quoteRequestLoading$;
    this.quoteRequestError$ = this.quotingFacade.quoteRequestError$;
    this.user$ = this.accountFacade.user$;
    this.submitted$ = this.route.queryParamMap.pipe(map(params => !!params.get('submitted')));
  }

  updateQuoteRequestItem(payload: LineItemUpdate) {
    this.quotingFacade.updateQuoteRequestItem(payload);
  }

  deleteQuoteRequestItem(payload: string) {
    this.quotingFacade.deleteQuoteRequestItem(payload);
  }

  deleteQuoteRequest(payload: string) {
    this.quotingFacade.deleteQuoteRequest(payload);
  }

  updateQuoteRequest(payload: { displayName?: string; description?: string }) {
    this.quotingFacade.updateQuoteRequest(payload);
  }

  submitQuoteRequest() {
    this.quotingFacade.submitQuoteRequest();
    this.router.navigate([], { queryParams: { submitted: true } });
  }

  updateSubmitQuoteRequest(payload: { displayName?: string; description?: string }) {
    this.quotingFacade.updateSubmitQuoteRequest(payload);
    this.router.navigate([], { queryParams: { submitted: true } });
  }

  copyQuote() {
    this.quotingFacade.copyQuoteRequest();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
