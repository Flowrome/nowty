import { configureStore } from "@reduxjs/toolkit";
import middlewares from "./middlewares";
import reducers from "./reducers";
const store = configureStore({
  devTools: import.meta.env.FE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["layout/setHeader", "layout/setFooter"],
        ignoredPaths: ["layout"],
      },
    }).prepend([...middlewares.map(({ middleware }) => middleware)]),
  reducer: {
    ...reducers,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
