import { createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

const initialState = {
    address: [],
    freights: []
};

export const freightsSlicer = createSlice({
    name: "Freights",
    initialState,
    reducers: {
        setAddress: (state, action) => {
            state.address = action.payload;
        },

        setFreights: (state, action) => {
            state.freights = action.payload;
        },

        appendFreight: (state, action) => {
            state.freights.push(action.payload);
        },
    }
});

export const { setAddress, setFreights, appendFreight } = freightsSlicer.actions;
export default freightsSlicer.reducer;