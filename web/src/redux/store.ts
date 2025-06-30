import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./rootSagas";
import authReducer from "./auth/authReducer";
import systemReducer from "./system/systemSlice";
import homeReducer from "./home/homeReducer";
import chatReducer from "./chat/chatReducer";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        auth: authReducer as any,
        system: systemReducer,
        home: homeReducer as any,  
        chat: chatReducer as any,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        })
        .concat(sagaMiddleware)
        .concat(apiSlice.middleware)
});

sagaMiddleware.run(rootSaga);
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
