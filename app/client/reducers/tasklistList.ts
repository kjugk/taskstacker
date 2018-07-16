import * as constants from '../constants';
import * as types from '../types';
import { createSelector } from 'reselect';

const initialState: types.TasklistListState = {
  ids: [],
  isFetching: false,
  isInitialized: false,
  selectingId: undefined,
  tasklistsById: {}
};

const tasklistList = (state = initialState, action: any) => {
  switch (action.type) {
    case constants.TASKLISTS_FETCH:
      return {
        ...state,
        isFetching: true
      };

    case constants.TASKLISTS_FETCH_SUCCESS:
      return {
        ...state,
        ids: action.payload.ids,
        isFetching: false,
        isInitialized: true,
        selectingId: action.payload.ids[0],
        tasklistsById: action.payload.tasklistsById
      };

    case constants.TASKLIST_CREATE_SUCCESS:
      return {
        ...state,
        ids: [action.payload.id, ...state.ids],
        selectingId: action.payload.id,
        tasklistsById: {
          ...action.payload.tasklistById,
          ...state.tasklistsById
        }
      };

    case constants.TASKLIST_UPDATE_SUCCESS:
      return {
        ...state,
        tasklistsById: {
          ...state.tasklistsById,
          ...action.payload.tasklist
        }
      };

    case constants.TASKLIST_DESTROY_SUCCESS:
      return {
        ...state,
        ids: state.ids.filter((id) => id !== action.payload.id),
        tasklistsById: destroyTasklistById(action.payload.id, state.tasklistsById)
      };

    case constants.TASK_IDS_RECEIVE:
      return {
        ...state,
        tasklistsById: {
          ...state.tasklistsById,
          ...{
            [action.payload.tasklistId]: {
              ...state.tasklistsById[action.payload.tasklistId],
              taskIds: action.payload.taskIds
            }
          }
        }
      };

    case constants.TASK_ID_RECEIVE:
      return {
        ...state,
        tasklistsById: {
          ...state.tasklistsById,
          ...{
            [action.payload.tasklistId]: {
              ...state.tasklistsById[action.payload.tasklistId],
              taskIds: [
                action.payload.taskId,
                ...(state.tasklistsById[action.payload.tasklistId].taskIds || [])
              ]
            }
          }
        }
      };

    case constants.TASKLIST_SELECT:
      return {
        ...state,
        selectingId: action.payload.id
      };

    default:
      return state;
  }
};

// helper
/**
 * tasklist を格納している object から、id で指定された tasklist を削除する。
 * @param id 削除対象id
 * @param tasklistsById tasklist を格納している object
 */
const destroyTasklistById = (id: number, tasklistsById: { [index: number]: any }) => {
  delete tasklistsById[id];
  return tasklistsById;
};

// selector
// const getTaskLists = ({ ids, tasklistsById }: types.TasklistListState) => {
//   return ids.map((id) => tasklistsById[id]);
// };

// const getSelectedTaskList = ({ selectingId, tasklistsById }: types.TasklistListState) => {
//   if (typeof selectingId === 'undefined') {
//     return undefined;
//   }

//   return tasklistsById[selectingId];
// };

const getTasklistIds = (state: types.RootState) => {
  return state.tasklistList.ids;
};

const getTasklistsById = (state: types.RootState) => {
  return state.tasklistList.tasklistsById;
};

const getSelectingId = (state: types.RootState) => {
  return state.tasklistList.selectingId;
};

const getTasklists = createSelector([getTasklistIds, getTasklistsById], (ids, tasklistsById) => {
  return ids.map((id) => tasklistsById[id]);
});

const getSelectedTasklist = createSelector([getSelectingId, getTasklistsById], (selectingId, tasklistsById) => {
    if (typeof selectingId === 'undefined') return undefined;

    return tasklistsById[selectingId];
});

export { tasklistList, getTasklists, getSelectedTasklist };
