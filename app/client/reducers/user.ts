import { ActionType, getType } from 'typesafe-actions';
import * as userActions from '../actions/userActions';
export type UserAction = ActionType<typeof userActions>;

const initialState = {
  initialized: false,
  signedIn: false,
  name: '',
  imageUrl: '',
  newUser: false
};

const user = (state = initialState, action: UserAction) => {
  switch (action.type) {
    case getType(userActions.verifySuccess):
      return {
        ...state,
        initialized: true,
        signedIn: true,
        newUser: action.payload.user.newUser,
        ...action.payload.user
      };

    case getType(userActions.verifyFailure):
      return {
        ...state,
        initialized: true
      };

    case getType(userActions.signOutSuccess):
      return {
        ...state,
        signedIn: false
      };

    default:
      return state;
  }
};

export { user };
