import { User } from "../user.model";

export type State = {
  user: User;
};

const initialState: State = {
  user: null,
};

export function authReducer(state = initialState, action) {
  return state;
}
