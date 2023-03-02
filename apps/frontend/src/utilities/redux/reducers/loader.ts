import { createSlice } from "@reduxjs/toolkit";

export interface LoaderState {
  loaderCount: number
}

const initialState: LoaderState = {
  loaderCount: 0
};

export const loaderSlice = createSlice({
  name: "loaders",
  initialState,
  reducers: {
    addLoader: (state) => {
      state.loaderCount = state.loaderCount + 1
    },
    removeLoader: (state) => {
      state.loaderCount = state.loaderCount - 1
    },
    resetLoader: (state) => {
      state.loaderCount = 0
    },
  },
});

export const { addLoader, removeLoader, resetLoader } =
  loaderSlice.actions;

export default loaderSlice.reducer;
