import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { CallParameters } from 'ish-core/models/call-parameters/call-parameters.model';
import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';

@Component({
  selector: 'ish-content-viewcontext',
  templateUrl: './content-viewcontext.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentViewcontextContainerComponent implements OnChanges {
  /**
   * The ID of the View Context whoes content is to be rendered.
   */
  @Input() viewContextId: string;

  /**
   * The call parameter object.
   */
  @Input() callParameters: CallParameters;

  viewContextEntrypoint$: Observable<ContentPageletEntryPointView>;

  constructor(private cmsFacade: CMSFacade) {}

  ngOnChanges() {
    this.cmsFacade.loadViewContext(this.viewContextId, this.callParameters, this.serializeViewContextClientId());
    this.viewContextEntrypoint$ = this.cmsFacade.viewContext$(this.serializeViewContextClientId());
  }

  private serializeViewContextClientId() {
    return (
      this.viewContextId +
      Object.keys(this.callParameters)
        .map(key => `@${key}-${this.callParameters[key]}`)
        .join('')
    );
  }
}
