import { all, call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import * as constants from '../constants';
import * as tasklistActions from '../actions/tasklistActions';
import * as taskActions from '../actions/taskActions';
import * as taskCreateFormActions from '../actions/taskCreateFormActions';
import * as messageActions from '../actions/messageActions';
import * as api from '../Api';
import { normalize, schema } from 'normalizr';

export default function* taskSaga() {
  /**
   * task のリストを取得する。
   */
  function* fetchTasks(action: any) {
    const tasks = new schema.Entity('tasks');
    const res = yield call(api.fetchTasks, action.payload.tasklistId);
    const normalized = normalize(res.data, { tasks: [tasks] });

    yield put(taskActions.receiveTasks(normalized.entities.tasks || {}));
  }

  function* createTask(action: any) {
    const task = new schema.Entity('task');
    const res = yield call(api.createTask, action.payload.tasklistId, action.payload.params);
    const normalized = normalize(res.data, { task });

    yield put(taskActions.receiveNewTask(normalized.entities.task || {}));
    yield put(tasklistActions.receiveTaskIds(action.payload.tasklistId, res.data.taskIds));
    yield put(tasklistActions.receiveTaskCount(action.payload.tasklistId, res.data.taskCount));
    yield put(taskCreateFormActions.clear());
  }

  function* updateTask(action: any) {
    const res = yield call(api.updateTask, action.payload.id, action.payload.params);

    yield put(taskActions.receiveUpdatedTask(res.data.task));
    yield put(tasklistActions.receiveTaskCount(res.data.task.tasklistId, res.data.taskCount));
  }

  function* destroyTask(action: any) {
    const res = yield call(api.destroyTask, action.payload.id);

    yield put(taskActions.receiveDestroyedTaskId(action.payload.id));
    yield put(tasklistActions.receiveTaskIds(res.data.task.tasklistId, res.data.taskIds));
    yield put(tasklistActions.receiveTaskCount(res.data.task.tasklistId, res.data.taskCount));
    yield put(messageActions.setMessage('削除しました'));
  }

  function* updateSort(action: any) {
    api.updateTasklist(action.payload.tasklistId, { task_id_list: action.payload.taskIds });

    yield put(tasklistActions.receiveTaskIds(action.payload.tasklistId, action.payload.taskIds));
  }

  yield all([
    takeLatest(constants.TASKS_FETCH, fetchTasks),
    takeLatest(constants.TASK_CREATE_FORM_SUBMIT, createTask),
    takeLatest(constants.TASK_UPDATE, updateTask),
    takeLatest(constants.TASK_DESTROY, destroyTask),
    takeLatest(constants.TASK_SORT_UPDATE, updateSort)
  ]);
}
