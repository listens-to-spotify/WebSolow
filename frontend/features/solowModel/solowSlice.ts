import { createSlice } from "@reduxjs/toolkit";

interface ParamsState {
    params: {
        s: number,
        delta: number,
        n: number,
        g: number, 
        alpha: number,
        k0: number,
    },
}

const initialState: ParamsState = {
    params: {
        s: 0.3,
        delta: 0.05,
        n: 0.02,
        g: 0.05,
        alpha: 0.5,
        k0: 0.5
    }
}

export const paramsSlice = createSlice({
    name: "params",
    initialState,
    reducers: {
        setParams: (state, action) => {
            Object.assign(state.params, action.payload)
        }
    }
})