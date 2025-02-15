import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/UserSlice.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const rootReducer = combineReducers({ user: userReducer });

// store the data in localstorage, key is user, it will store as user:[data]
const persistConfig = {
  key: 'user',
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
