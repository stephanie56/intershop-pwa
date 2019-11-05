import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { ContentPageletContainerComponent } from 'ish-shared/cms/containers/content-pagelet/content-pagelet.container';

import { ContentViewcontextContainerComponent } from './content-viewcontext.container';

describe('Content Viewcontext Container', () => {
  let component: ContentViewcontextContainerComponent;
  let fixture: ComponentFixture<ContentViewcontextContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ngrxTesting()],
      declarations: [ContentViewcontextContainerComponent, MockComponent(ContentPageletContainerComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentViewcontextContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
