import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

// import counterReducer from './pages/counter/counterSlice';
import authenticationReducer from './pages/authentication/authenticationSlice';
import homeReducer from './pages/home/homeSlice';

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  reducer: {
    // counter: counterReducer,
    authentication: authenticationReducer,
    home: homeReducer
  }
});
