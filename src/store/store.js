import { configureStore } from '@reduxjs/toolkit';
import web3Reducer from './modules/web3';

const store = configureStore({
    reducer: {
        web3: web3Reducer
    },
});

export default store;