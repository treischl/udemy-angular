import { createReducer, on, Action } from "@ngrx/store";

import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export type State = {
  user: User;
  authError: string;
  loading: boolean;
};

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

const _authReducer = createReducer(
  initialState,
  on(AuthActions.loginStart, AuthActions.signupStart, (state) => ({
    ...state,
    authError: null,
    loading: true,
  })),
  on(AuthActions.authenticateSuccess, (state, action) => ({
    ...state,
    authError: null,
    user: new User(
      action.email,
      action.userId,
      action.token,
      action.expirationDate,
    ),
    loading: false,
  })),
  on(AuthActions.logout, (state) => ({ ...state, user: null })),
  on(AuthActions.authenticateFail, (state, action) => ({
    ...state,
    authError: action.errorMessage,
  })),
  on(AuthActions.clearError, (state) => ({ ...state, authError: null })),
);

export function authReducer(state: State, action: Action) {
  return _authReducer(state, action);
}
