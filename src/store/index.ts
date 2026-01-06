import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth';
import mailReducer from './mails';

const store = configureStore({
    reducer : {
        user: authReducer,
        mails: mailReducer
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;