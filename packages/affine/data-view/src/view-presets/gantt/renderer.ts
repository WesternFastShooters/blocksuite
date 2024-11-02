import { createUniComponentFromWebComponent } from '../../core/index.js';
import { createIcon } from '../../core/utils/uni-icon.js';
import { ganttViewModel } from './define.js';
import { DataViewGantt } from './gantt-view.js';

export const ganttViewMeta = ganttViewModel.createMeta({
  icon: createIcon('DatabaseGanttViewIcon'),
  view: createUniComponentFromWebComponent(DataViewGantt),
});
