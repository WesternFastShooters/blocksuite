import { css } from 'lit';
import { html } from 'lit/static-html.js';

import { type DataViewInstance, renderUniLit } from '../../core/index.js';
import { DataViewBase } from '../../core/view/data-view-base.js';

const styles = css`
  .gantt-chart-layout {
    user-select: none;
    display: flex;
    width: 100%;
    min-height: 100%;
  }
`;
export class DataViewGantt extends DataViewBase {
  static override styles = styles;

  get expose(): DataViewInstance {
    return {
      clearSelection: () => {},
      focusFirstCell: () => {},
      hideIndicator: () => {},
      moveTo: () => {},

      view: this.props.view,
      eventTrace: this.props.eventTrace,
    };
  }

  override render() {
    return html`
      ${renderUniLit(this.props.headerWidget, {
        dataViewInstance: this.expose,
      })}
      <div class="gantt-chart-layout" .view="${this.props.view}">gantt</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-data-view-gantt': DataViewGantt;
  }
}
