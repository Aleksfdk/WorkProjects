import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { testApiReducers } from './testApi.api';

const rootReducer = combineReducers({
  ...testApiReducers,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(
        ...testApiReducers
      );
    }
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
