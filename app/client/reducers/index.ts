import { combineReducers } from 'redux';
import { user } from './user';
import { tasklists } from './tasklists';
import { tasklistCreateForm } from './tasklist/createForm';
import { tasklistEditForm } from './tasklist/editForm';
import { tasks } from './tasks';
import { taskCreateForm } from './task/createForm';
import { message } from './message';
import { sidebar } from './sidebar';

const rootReducer = combineReducers({
  user,
  tasklists,
  tasklistCreateForm,
  tasklistEditForm,
  tasks,
  taskCreateForm,
  message,
  sidebar
});

export default rootReducer;
