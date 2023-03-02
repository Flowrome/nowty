import { Chats } from "@pages/Chats";
import { Chat } from "@pages/Chat";
import { RegisterApiKey } from "@pages/RegisterApiKey";
import { Root } from "@templates/router/Root";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <Navigate to="/chats" replace></Navigate>,
    children: [
      { path: "", element: <Navigate to="/chats" replace></Navigate> },
      {
        path: "register",
        loader: async () => {
          const response = await fetch(
            `${import.meta.env.FE_API_BASEURL}/openai/check`,
            {
              method: "GET",
            }
          );
          if (response.ok) {
            throw await response.json();
          }
          return true;
        },
        element: <RegisterApiKey></RegisterApiKey>,
        errorElement: <Navigate to="/chats" replace></Navigate>,
      },
      {
        path: "chats",
        loader: async () => {
          const response = await fetch(
            `${import.meta.env.FE_API_BASEURL}/openai/check`,
            {
              method: "GET",
            }
          );
          if (!response.ok) {
            throw await response.json();
          }
          return true;
        },
        element: <Chats></Chats>,
        errorElement: <Navigate to="/register" replace></Navigate>,
      },
      {
        path: "chat/:chatId",
        loader: async () => {
          const response = await fetch(
            `${import.meta.env.FE_API_BASEURL}/openai/check`,
            {
              method: "GET",
            }
          );
          if (!response.ok) {
            throw await response.json();
          }
          return true;
        },
        errorElement: <Navigate to="/register" replace></Navigate>,
        element: <Chat></Chat>,
      },
    ],
  },
]);
