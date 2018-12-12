import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { AccountOrderPageComponent } from './account-order-page.component';

describe('Account Order Page Component', () => {
  let component: AccountOrderPageComponent;
  let fixture: ComponentFixture<AccountOrderPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountOrderPageComponent,
        MockComponent({
          selector: 'ish-address',
          template: 'Address Component',
          inputs: ['address', 'displayEmail'],
        }),
        MockComponent({
          selector: 'ish-basket-cost-summary',
          template: 'Basket Cost Summary Component',
          inputs: ['totals'],
        }),
        MockComponent({
          selector: 'ish-info-box',
          template: 'Checkout Infobox Component',
          inputs: ['heading', 'editRouterLink'],
        }),
        MockComponent({
          selector: 'ish-line-item-list',
          template: 'Line Item List Component',
          inputs: ['lineItems', 'editable'],
        }),
      ],
      imports: [IconModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.order = BasketMockData.getOrder();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered without errors if no order is available', () => {
    component.order = undefined;
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render order details for the given order', () => {
    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=order-summary-info]')).toBeTruthy();
    expect(element.querySelectorAll('ish-info-box')).toHaveLength(4);
    expect(element.querySelector('ish-line-item-list')).toBeTruthy();
    expect(element.querySelector('ish-basket-cost-summary')).toBeTruthy();
  });

  it('should display the home link after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('a[data-testing-id="home-link"]')).toBeTruthy();
  });

  it('should display the order list link after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('a[data-testing-id="orders-link"]')).toBeTruthy();
  });
});