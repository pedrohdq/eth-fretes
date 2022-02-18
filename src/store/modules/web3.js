import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    contractFactory: "",
    currentAccount: ""
};

export const web3Slicer = createSlice({
    name: "Web3",
    initialState,
    reducers: {
        setCurrentAccount: (state, action) => {
            state.currentAccount = action.payload;
        }
    }
});

export const { setCurrentAccount } = web3Slicer.actions;
export default web3Slicer.reducer;