import { ShadowlessElement } from '@blocksuite/block-std';
import { SignalWatcher, WithDisposable } from '@blocksuite/global/utils';
import { css } from 'lit';
import { property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

import type { GanttSingleView } from './gantt-view-manager.js';

const styles = css`
  .chart-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
  }
`;

export class GanttChart extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {
  static override styles = styles;

  override render() {
    return html`
      <div class="chart-container">
        <affine-gantt-header .view="${this.view}"></affine-gantt-header>
        <affine-gantt-chart-background
          .view="${this.view}"
        ></affine-gantt-chart-background>
      </div>
    `;
  }


  @property({ attribute: false })
  accessor view!: GanttSingleView;
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-gantt-chart': GanttChart;
  }
}
