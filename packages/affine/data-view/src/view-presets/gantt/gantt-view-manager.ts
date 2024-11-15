import type { GanttViewData } from './define.js';

import { PropertyBase } from '../../core/view-manager/property.js';
import { SingleViewBase } from '../../core/view-manager/single-view.js';

export const DAY_IN_MS = 1000 * 60 * 60 * 24;

export class GanttSingleView extends SingleViewBase<GanttViewData> {
  jumpToTime = (
    targetTime?: number,
    position?: 'left' | 'right' | 'middle'
  ) => {
    const targetPosition = targetTime ?? Date.now();

    if (position === 'left') {
      this.positionRange = {
        start: targetPosition * this.pxPerMs[this.period],
        end:
          targetPosition * this.pxPerMs[this.period] + this.viewPortSize.width,
      };
      return;
    }
    if (position === 'right') {
      this.positionRange = {
        start:
          targetPosition * this.pxPerMs[this.period] - this.viewPortSize.width,
        end: targetPosition * this.pxPerMs[this.period],
      };
      return;
    }
    if (position === 'middle') {
      this.positionRange = {
        start:
          targetPosition * this.pxPerMs[this.period] -
          this.viewPortSize.width / 2,
        end:
          targetPosition * this.pxPerMs[this.period] +
          this.viewPortSize.width / 2,
      };
    }
  };

  period: 'day' | 'month' | 'week' = 'day';

  pxPerMs: { month: number; week: number; day: number } = {
    month: 6 / DAY_IN_MS,
    week: 20 / DAY_IN_MS,
    day: 30 / DAY_IN_MS,
  };

  positionRange = {
    start: Date.now() * this.pxPerMs[this.period],
    end: Date.now() * this.pxPerMs[this.period],
  };

  referencePosition = 0;

  timeAxisRange = { major: [], minor: [] };

  viewPortSize = { width: 0, height: 0 };

  get type(): string {
    return this.view?.mode ?? 'gantt';
  }

  get view() {
    return this.data$.value;
  }
}

export class GanttColumn extends PropertyBase {
  constructor(dataViewManager: GanttSingleView, columnId: string) {
    super(dataViewManager, columnId);
  }
}
