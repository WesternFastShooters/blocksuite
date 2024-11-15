import { ThemeProvider } from '@blocksuite/affine-shared/services';
import {
  type BlockStdScope,
  ShadowlessElement,
  stdContext,
} from '@blocksuite/block-std';
import { SignalWatcher, WithDisposable } from '@blocksuite/global/utils';
import { consume } from '@lit/context';
import { getHours, startOfToday } from 'date-fns';
import { css } from 'lit';
import { property, query } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

import type { GanttSingleView } from './gantt-view-manager.js';

const styles = css`
  .canvasContainer {
    position: sticky;
    left: 0;
    top: 44px;
  }

  .canvasContainer canvas {
    position: absolute !important;
    top: 0;
    left: 0;
  }
`;

export class GanttChartBackground extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {
  static override styles = styles;

  private get ratio() {
    return window.devicePixelRatio || 1;
  }

  private get todayPos() {
    return getHours(startOfToday()) * 12 * this.view.pxPerMs[this.view.period];
  }

  private drawCanvas() {
    const canvas = this.canvas;
    if (!canvas) return;
    canvas.width = (this.view.viewPortSize.width || 0) * this.ratio;
    canvas.height = (this.view.viewPortSize.height || 0) * this.ratio;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(this.ratio, this.ratio);
    ctx.clearRect(
      0,
      0,
      this.view.viewPortSize.width || 0,
      this.view.viewPortSize.height || 0
    );
    ctx.strokeStyle = '#f4f4f4';
    const appTheme = this.std.get(ThemeProvider).app$.value;
    ctx.fillStyle = appTheme === 'dark' ? '#222222' : '#F7F7F7';
    this.view.timeAxisRange.minor.forEach(
      (time: { isWeekend: boolean; startPosition: number }) => {
        if (this.view.period === 'day' && time.isWeekend) {
          this.drawWeekends(
            ctx,
            time.startPosition - (this.referencePosition || 0),
            this.view.viewPortSize.height || 0
          );
        }
        this.drawLine(
          ctx,
          time.startPosition - (this.view.referencePosition || 0),
          this.view.viewPortSize.height || 0
        );
      }
    );
    ctx.strokeStyle = '#1677ff';
    this.drawLine(
      ctx,
      this.todayPos - (this.view.referencePosition || 0),
      this.view.viewPortSize.height || 0
    );
  }

  private drawLine(ctx: CanvasRenderingContext2D, x: number, height: number) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  private drawWeekends(
    ctx: CanvasRenderingContext2D,
    x: number,
    height: number
  ) {
    ctx.fillRect(x, 0, 30, height);
  }

  override render() {
    return html`
      <div class="canvasContainer">
        <canvas
          style="width: ${this.view.viewPortSize.width}px; height: ${this.view
            .viewPortSize.height}px;"
        ></canvas>
      </div>
    `;
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (
      changedProperties.has('referencePosition') ||
      changedProperties.has('viewPortSize') ||
      changedProperties.has('timeAxisRange')
    ) {
      if (
        this.view.referencePosition === undefined ||
        this.view.viewPortSize.width === 0 ||
        this.view.timeAxisRange.minor.length === 0
      )
        return;
      requestAnimationFrame(() => this.drawCanvas());
    }
  }

  @query('canvas')
  accessor canvas!: HTMLCanvasElement;

  @consume({ context: stdContext })
  accessor std!: BlockStdScope;

  @property({ attribute: false })
  accessor view!: GanttSingleView;
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-gantt-chart-background': GanttChartBackground;
  }
}
