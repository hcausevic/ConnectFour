import {configureStore} from '@reduxjs/toolkit';
import counterReducer from './reducers/counterSlice';
import gameReducer from './reducers/gameSlice';


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    game: gameReducer,
  },
});