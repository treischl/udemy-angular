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

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions,
) {
  switch (action.type) {
    case AuthActions.LOGIN:
      const { email, userId, token, expirationDate } = action.payload;
      return {
        ...state,
        authError: null,
        user: new User(email, userId, token, expirationDate),
        loading: false,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    case AuthActions.LOGIN_START:
      return {
        ...state,
        authError: null,
        loading: true,
      };
    case AuthActions.LOGIN_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
