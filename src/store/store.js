import { configureStore } from '@reduxjs/toolkit';

import counterSlicer from './modules/counter';
import web3Slicer from './modules/web3';
import freightsSlicer from './modules/freights';

const store = configureStore({
    reducer: {
        counter: counterSlicer,
        web3: web3Slicer,
        freights: freightsSlicer
    },
});

export default store;