import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Default localStorage for web
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import widgetsReducer from "./widgetSlice";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

// Persist configuration
const persistConfig = {
  key: "root", // Key for storing persisted data in localStorage
  storage,     // Storage engine (localStorage in this case)
  whitelist: ["dashboard"], // Specify which slices of state to persist
};

// Combine reducers (if you add more slices, include them here)
const rootReducer = combineReducers({
  dashboard: widgetsReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
