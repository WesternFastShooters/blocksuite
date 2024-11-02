import { viewType } from '../../core/view/data-view.js';
import { GanttSingleView } from './gantt-view-manager.js';

export const ganttViewType = viewType('gantt');

export const ganttViewModel = ganttViewType.createModel({
  defaultName: 'Gantt View',
  dataViewManager: GanttSingleView,
  defaultData: viewManager => {
    return {
      columns: [],
      filter: {
        type: 'group',
        op: 'and',
        conditions: [],
      },
      header: {
        titleColumn: viewManager.dataSource.properties$.value.find(
          id => viewManager.dataSource.propertyTypeGet(id) === 'title'
        ),
        iconColumn: 'type',
      },
      groupProperties: [],
    };
  },
});
