import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: 0
};

export const web3Slicer = createSlice({
    name: "Web3",
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        
        decrement: (state) => {
            state.value -= 1;
        },

        increaseByAmount: (state, action) => {
            state.value += action.payload
        }
    }
});

export const { increment, decrement, increaseByAmount } = web3Slicer.actions;
export default web3Slicer.reducer;