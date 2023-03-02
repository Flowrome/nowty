import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./router";
import { Provider } from "react-redux";
import store from "@store";
import { RouterProvider } from "react-router-dom";
import './styles/main.scss'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
