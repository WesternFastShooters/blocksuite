import { css } from 'lit';
import { html } from 'lit/static-html.js';

import { renderUniLit } from '../../core/index.js';
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

  expose = {
    focusFirstCell: () => {},
  };

  override render() {
    return html`
      ${renderUniLit(this.props.headerWidget, {
        view: this.props.view,
        viewMethods: this.expose,
      })}
      <div class="gantt-chart-layout">gantt</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-data-view-gantt': DataViewGantt;
  }
}
