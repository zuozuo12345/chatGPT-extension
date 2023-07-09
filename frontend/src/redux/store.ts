import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./user/userSlice";
import appReducer from "./app/appSlice";
import profileReducer from "./profile/profileSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    profile: profileReducer,
  },
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type REDUX_ROOT_STATE = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
