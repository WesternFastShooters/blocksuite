import { ShadowlessElement } from '@blocksuite/block-std';
import { SignalWatcher, WithDisposable } from '@blocksuite/global/utils';
import { createContext } from '@lit/context';
import { property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

import type { GanttSingleView } from './gantt-view-manager.js';

export const ganttChartContext = createContext('ganttChartContext');

export class GanttChart extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {



  override render() {
    return html`
      <affine-gantt-chart-background></affine-gantt-chart-background>
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
