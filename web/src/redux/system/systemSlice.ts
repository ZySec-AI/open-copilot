import systemServices from "@/services/system.services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface System {
    appData: AppStoreInfo[],
    status: "idle" | "succeeded" | "failed" | "loading",
    error: any,
}

interface AppStoreInfo {
    name: string,
    description: string,
    label: string[],
    status: string,
    rating: Number,
    configuration: Configuration[],
    logo_url: string,
    website: string,
}

interface Configuration {
    name: string,
    description: string,
    value: {
        required: boolean,
        type: string,
    }
}

export type SystemState = System;

const initialState: SystemState = { appData: [], status: 'idle', error: null };

export const fetchSystem = createAsyncThunk('system/fetch', systemServices.getAppstore);

const systemSlice = createSlice({
    name: "system",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchSystem.pending, (state, _action) => {
                state.status = 'loading';
            })
            .addCase(fetchSystem.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.appData = action.payload;
            })
            .addCase(fetchSystem.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message;
            })
    }
});

export default systemSlice.reducer;
