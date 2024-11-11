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

import { ganttChartContext } from './gantt-chart.js';

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
    return getHours(startOfToday()) * 12 * this.pxPerMs[this.period];
  }

  private drawCanvas() {
    const canvas = this.canvas;
    if (!canvas) return;
    canvas.width = (this.viewPortSize.width || 0) * this.ratio;
    canvas.height = (this.viewPortSize.height || 0) * this.ratio;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(this.ratio, this.ratio);
    ctx.clearRect(
      0,
      0,
      this.viewPortSize.width || 0,
      this.viewPortSize.height || 0
    );
    ctx.strokeStyle = '#f4f4f4';
    const appTheme = this.std.get(ThemeProvider).app$.value;
    ctx.fillStyle = appTheme === 'dark' ? '#222222' : '#F7F7F7';
    this.timeAxisRange.minor.forEach(
      (time: { isWeekend: boolean; startPosition: number }) => {
        if (this.period === 'day' && time.isWeekend) {
          this.drawWeekends(
            ctx,
            time.startPosition - (this.referencePosition || 0),
            this.viewPortSize.height || 0,
            this.dayWidth
          );
        }
        this.drawLine(
          ctx,
          time.startPosition - (this.referencePosition || 0),
          this.viewPortSize.height || 0
        );
      }
    );
    ctx.strokeStyle = '#1677ff';
    this.drawLine(
      ctx,
      this.todayPos - (this.referencePosition || 0),
      this.viewPortSize.height || 0
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
    height: number,
    dayWidth: number
  ) {
    ctx.fillRect(x, 0, dayWidth, height);
  }

  override render() {
    return html`
      <div class="canvasContainer">
        <canvas
          style="width: ${this.viewPortSize.width}px; height: ${this
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
        this.referencePosition === undefined ||
        this.viewPortSize.width === 0 ||
        this.timeAxisRange.minor.length === 0
      )
        return;
      requestAnimationFrame(() => this.drawCanvas());
    }
  }

  @query('canvas')
  accessor canvas!: HTMLCanvasElement;

  @property({ type: Number })
  accessor dayWidth = 30;

  @consume({ context: ganttChartContext })
  accessor period: 'day' | 'month' | 'week' = 'day';

  @consume({ context: ganttChartContext })
  accessor pxPerMs!: { month: number; week: number; day: number };

  @consume({ context: ganttChartContext })
  accessor referencePosition = 0;

  @consume({ context: stdContext })
  accessor std!: BlockStdScope;

  @consume({ context: ganttChartContext })
  accessor timeAxisRange = { major: [], minor: [] };

  @property({ type: Object })
  accessor viewPortSize = { width: 0, height: 0 };

  @property({ type: String })
  accessor weekendBgColor = '#fafafa';
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-gantt-chart-background': GanttChartBackground;
  }
}
