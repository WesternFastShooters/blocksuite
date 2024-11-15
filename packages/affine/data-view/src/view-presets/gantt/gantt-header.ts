import {
  menu,
  popMenu,
  popupTargetFromElement,
} from '@blocksuite/affine-components/context-menu';
import { ShadowlessElement } from '@blocksuite/block-std';
import { SignalWatcher, WithDisposable } from '@blocksuite/global/utils';
import { css } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { html } from 'lit/static-html.js';

import type { GanttSingleView } from './gantt-view-manager.js';

const styles = css`
  .chart-header-right-container {
    height: 44px;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    overflow-x: hidden;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12);
  }

  .header-section {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .major-time-axis-item {
    position: absolute;
    top: 0px;
    overflow: hidden;
    min-height: 20px;
    padding-left: 3px;
    font-size: 10px;
    font-weight: 400;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.65);
  }

  .minor-time-axis-item {
    position: absolute;
    min-height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.25);
  }

  .today-time-axis-item {
    position: absolute;
    height: 22px;
    width: 22px;
    border-radius: 4px;
    background-color: #1677ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
  }

  .gantt-toolbar-container {
    position: relative;
  }

  .gantt-toolbar-content {
    position: absolute;
    top: -5px;
    right: 24px;
    z-index: 10;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
  }

  .button {
    user-select: none;
    transition: background 20ms ease-in;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    white-space: nowrap;
    height: 24px;
    border-radius: 6px;
    font-size: 14px;
    line-height: 1.2;
    min-width: 0px;
    padding-left: 6px;
    padding-right: 6px;
  }

  .today-button {
    @extend .button;
    color: rgba(255, 255, 255, 0.81);
  }

  .today-button:hover {
    background: rgba(255, 255, 255, 0.055);
  }

  .select-period-button {
    @extend .button;
    color: rgba(255, 255, 255, 0.443);
    background: rgba(255, 255, 255, 0.055);
  }

  .select-period-button:hover {
    background: rgba(255, 255, 255, 0.055);
  }
`;

export class GanttChartHeader extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {
  static override styles = styles;

  clickSwitchPeriod = (e: MouseEvent) => {
    e.stopPropagation();
    popMenu(popupTargetFromElement(e.currentTarget as HTMLElement), {
      options: {
        items: ['day', 'week', 'month'].map(period =>
          menu.action({
            name: period,
            select: () => {
              this.view.period = period as 'day' | 'week' | 'month';
            },
          })
        ),
      },
    });
  };

  private get todayItemPosition() {
    return 12 * this.view.pxPerMs[this.view.period] - 11;
  }

  override render() {
    return html`
      <header class="chart-header-right-container">
        <div
          class="header-section"
          style="transform: translate3d(-${this.view.referencePosition}px,0,0)"
        >
          ${repeat(
            this.view.timeAxisRange?.major,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (item: any) => item.startPosition,
            item =>
              html`<div
                class="major-time-axis-item"
                style="width: ${item.endPosition -
                item.startPosition}px; left: ${item.startPosition}px"
              ></div>`
          )}
          ${repeat(
            this.view.timeAxisRange?.minor,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (item: any) => item.startPosition,
            item =>
              html`<div
                class="minor-time-axis-item"
                style="width:${item.endPosition -
                item.startPosition}px; left:${item.startPosition}px; top: 20px"
              ></div>`
          )}
          <div
            class="today-time-axis-item "
            style="left=${this.todayItemPosition}px; top: 22px"
          >
            today
          </div>
        </div>

        <div class="gantt-toolbar-container">
          <div class="gantt-toolbar-content">
            <div
              class="today-button"
              role="button"
              tabindex="0"
              @click=${() => {
                this.view.jumpToTime?.();
              }}
            >
              Today
            </div>
            <div
              role="button"
              tabindex="0"
              class="select-period-button"
              @click=${this.clickSwitchPeriod}
            >
              ${{
                day: 'day',
                week: 'week',
                month: 'month',
              }[this.view.period]}
              <svg
                role="graphics-symbol"
                viewBox="0 0 30 30"
                class="chevronDown"
                style="width: 10px; height: 100%; display: block; fill: rgba(255, 255, 255, 0.443); flex-shrink: 0; margin-left: 4px;"
              >
                <polygon
                  points="15,17.4 4.8,7 2,9.8 15,23 28,9.8 25.2,7 "
                ></polygon>
              </svg>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  @property({ attribute: false })
  accessor view!: GanttSingleView;
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-gantt-header': GanttChartHeader;
  }
}
