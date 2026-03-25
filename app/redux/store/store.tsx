import { configureStore } from '@reduxjs/toolkit';
import { systemReducer } from '../reducers';

export const store = configureStore({
    reducer: {
        systemReducer: systemReducer,
    },
});
