import {
  fetchChats,
  loadChats,
  fetchChat,
  loadChat,
  newChat,
  removeChat,
  newTurboChat,
} from "@reducers/chats";
import { sendNotification } from "@reducers/notifications";
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: fetchChats,
  effect: async (action, listenerApi) => {
    const {
      data: { chats },
    } = await fetch(`${import.meta.env.FE_API_BASEURL}/chat/load`, {
      method: "GET",
    }).then((response) => response.json());
    listenerApi.dispatch(loadChats(chats));
  },
});

listenerMiddleware.startListening({
  actionCreator: fetchChat,
  effect: async (action, listenerApi) => {
    const {
      data: { chat },
    } = await fetch(
      `${import.meta.env.FE_API_BASEURL}/chat/load/${action.payload.chatId}`,
      {
        method: "GET",
      }
    ).then((response) => response.json());
    listenerApi.dispatch(loadChat(chat));
  },
});

listenerMiddleware.startListening({
  actionCreator: removeChat,
  effect: async (action) => {
    await fetch(
      `${import.meta.env.FE_API_BASEURL}/chat/delete/${action.payload.chatId}`,
      {
        method: "DELETE",
      }
    );
  },
});

listenerMiddleware.startListening({
  matcher: isAnyOf(newChat, newTurboChat),
  effect: async (action, listenerApi) => {
    const response = await fetch(
      `${import.meta.env.FE_API_BASEURL}/chat/new?turbo=${
        action.type === "chats/newChat" ? 0 : 1
      }&lang=${window?.navigator?.language.split('-')[0].split('_')[0].toLowerCase() || import.meta.env.FE_DEFAULT_LANG}`,
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      listenerApi.dispatch(
        sendNotification({
          color: "error",
          message: (await response.json())?.error || "COMMON_ERROR",
        })
      );
    } else {
      const {
        data: { chats },
      } = await response.json();
      listenerApi.dispatch(loadChats(chats));
    }
  },
});

export default listenerMiddleware;
