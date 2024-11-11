import { type BasicViewDataType, viewType } from '../../core/view/data-view.js';
import { GanttSingleView } from './gantt-view-manager.js';

export const GanttViewType = viewType('gantt');

export type GanttViewColumn = {};

type DataType = {
  columns: GanttViewColumn[];
};

export type GanttViewData = BasicViewDataType<
  typeof GanttViewType.type,
  DataType
>;

export const ganttViewModel = GanttViewType.createModel({
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
