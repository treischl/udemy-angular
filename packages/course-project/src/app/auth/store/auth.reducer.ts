import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export type State = {
  user: User;
};

const initialState: State = {
  user: null,
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
        user: new User(email, userId, token, expirationDate),
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}
