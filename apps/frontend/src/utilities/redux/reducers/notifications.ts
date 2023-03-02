import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  message: string;
  color:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "success"
    | "light"
    | "dark";
  timestamp?: number;
}

export interface NotificationState {
  list: Notification[];
}

const initialState: NotificationState = {
  list: [],
};

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    sendNotification: (state, action: PayloadAction<Notification>) => {
      state.list = [
        ...state.list,
        { ...action.payload, timestamp: new Date().valueOf() },
      ];
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.list = [
        ...state.list.filter(({ timestamp }) => timestamp !== action.payload),
      ];
    },
  },
});

export const { sendNotification, removeNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
