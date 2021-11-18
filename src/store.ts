import {configureStore} from '@reduxjs/toolkit';
import gameReducer from './reducers/gameSlice';


export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      // Ignore these action types
      ignoredActions: ['game/resumeGame/fulfilled'],
    },
  })
});