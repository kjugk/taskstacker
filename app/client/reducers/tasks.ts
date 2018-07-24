import * as constants from '../constants';
import * as types from '../types';
import { createSelector } from 'reselect';
import { getSelectedTasklist } from '../reducers/tasklistList';

const initialState: types.TasksState = {
  isFetching: false,
  selectingId: undefined,
  tasksById: {}
};

const tasks = (state = initialState, action: any) => {
  switch (action.type) {
    case constants.TASKS_FETCH:
      return {
        ...state,
        isFetching: true
      };

    case constants.TASKS_FETCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        tasksById: action.payload.tasksById
      };

    case constants.TASK_CREATE_SUCCESS:
      return {
        ...state,
        tasksById: {
          ...state.tasksById,
          ...action.payload.task
        }
      };

    case constants.TASK_UPDATE_SUCCESS:
      return {
        ...state,
        tasksById: {
          ...state.tasksById,
          ...action.payload.task
        }
      };

    case constants.TASK_SELECT:
      return {
        ...state,
        selectingId: action.payload.id
      };

    default:
      return state;
  }
};

// selector
const getTasksById = (state: types.RootState) => {
  return state.tasks.tasksById;
};

const getSelectingId = (state: types.RootState) => {
  return state.tasks.selectingId;
};

const getTasks = createSelector([getSelectedTasklist, getTasksById], (tasklist, tasksById) => {
  if (tasklist === undefined) return [];

  let tasks: types.TaskState[] = [];
  (tasklist.taskIds || []).forEach((id: any) => {
    if (tasksById[id]) {
      tasks.push(tasksById[id]);
    }
  });

  return tasks;
});

const getActiveTasks = createSelector([getTasks], (tasks) => {
  return tasks.filter((task) => !task.completed);
});

const getCompletedTasks = createSelector([getTasks], (tasks) => {
  return tasks.filter((task) => task.completed);
});

const getSelectingTask = createSelector([getTasksById, getSelectingId], (tasks, id) => {
  if (typeof id === "undefined") return undefined;

  // TODO コピーしたオブジェクトを渡す
  return tasks[id];
})

export { tasks, getActiveTasks, getCompletedTasks, getSelectingTask };
