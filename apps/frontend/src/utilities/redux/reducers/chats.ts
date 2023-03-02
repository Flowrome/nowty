import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Chat {
  title: string;
  created_at: string;
  _id: string;
  is_turbo?: boolean,
  messages?: {
    bot: string;
    user?: string;
    bot_datetime: string;
    user_datetime?: string;
    to_exclude?: boolean;
    is_context?: boolean;
  }[];
  usages?: {
    total_tokens: number;
    total_tokens_prompt: number;
    total_tokens_completion: number;
  };
}

export interface ChatsState {
  list: Chat[];
}

const initialState: ChatsState = {
  list: [],
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    fetchChats: () => {},
    loadChats: (state, action: PayloadAction<Chat[]>) => {
      state.list = action.payload;
    },
    fetchChat: (state, action: PayloadAction<{ chatId: string }>) => {},
    loadChat: (state, action: PayloadAction<Chat>) => {
      state.list =
        state.list.length > 0
          ? state.list.map((elem) =>
              action.payload._id === elem._id ? action.payload : elem
            )
          : [action.payload];
    },
    newChat: () => {},
    newTurboChat: () => {},
    removeChat: (state, action: PayloadAction<{ chatId: string }>) => {},
  },
});

export const {
  fetchChats,
  loadChats,
  fetchChat,
  loadChat,
  newChat,
  removeChat,
  newTurboChat
} = chatsSlice.actions;

export default chatsSlice.reducer;
