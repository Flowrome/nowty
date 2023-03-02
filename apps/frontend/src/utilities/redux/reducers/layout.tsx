import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ReactNode } from "react";

export interface LayoutState {
  has: { header: ReactNode | null; footer: ReactNode | null };
  options: {
    mainHeight: "full" | "auto" | "header-fixed";
  };
}

const initialState: LayoutState = {
  has: {
    header: null,
    footer: null,
  },
  options: {
    mainHeight: "full",
  },
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setHeader(state, action: PayloadAction<ReactNode | null>) {
      state.has.header = action.payload;
    },
    setFooter(state, action: PayloadAction<ReactNode | null>) {
      state.has.footer = action.payload;
    },
    setOptionMainHeight(
      state,
      action: PayloadAction<"full" | "auto" | "header-fixed">
    ) {
      state.options.mainHeight = action.payload;
    },
  },
});

export const { setHeader, setFooter, setOptionMainHeight } =
  layoutSlice.actions;

export default layoutSlice.reducer;
