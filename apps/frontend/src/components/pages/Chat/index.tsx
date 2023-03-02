import classes from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setFooter, setHeader, setOptionMainHeight } from "@reducers/layout";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchChat, removeChat } from "@reducers/chats";
import { RootState } from "@store";
import { Textarea } from "@components/atoms/Textarea";
import { Button } from "@components/atoms/Button";
import { sendNotification } from "@reducers/notifications";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { BubbleMessage } from "@components/atoms/BubbleMessage";

const ChatHeader = ({
  chatId,
  chatTitle,
}: {
  chatId: string;
  chatTitle: string;
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className={classNames("container", classes["chat-header"])}>
      <div
        className={classNames(
          classes["chat-header__button"],
          classes["chat-header__button--left"]
        )}
      >
        <Button
          onClick={() => {
            navigate(-1);
          }}
          _type="blank"
          type="submit"
        >
          {/*@ts-ignore*/}
          <ion-icon name="chevron-back-outline" size="large"></ion-icon>
        </Button>
      </div>
      <h1 className={classes["chat-header__headline"]}>{chatTitle}</h1>
      <div className={classes["chat-header__button"]}>
        <Button
          onClick={() => {
            dispatch(removeChat({ chatId }));
            navigate(-1);
          }}
          _type="blank"
          type="submit"
        >
          {/*@ts-ignore*/}
          <ion-icon name="trash-outline" size="large"></ion-icon>
        </Button>
      </div>
    </div>
  );
};

export const Chat = () => {
  let { chatId } = useParams();
  const { t } = useTranslation();
  const chatRef = useRef<HTMLDivElement>();

  const [waitingForMessage, setWaitingForMessage] = useState(false);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const chat = useSelector(({ chats: { list } }: RootState) =>
    list.length > 0 ? list.find(({ _id }) => _id === chatId) : null
  );

  const setLayout = () => {
    dispatch(setOptionMainHeight("header-fixed"));
    dispatch(
      setHeader(
        <ChatHeader
          chatTitle={chat?.title || t("chats.generic_title_list_elem")}
          chatId={chatId || ""}
        ></ChatHeader>
      )
    );
    dispatch(setFooter(null));
  };

  const scrollToBottom = () => {
    if (chatRef?.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight + 400;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages, chatRef]);

  useEffect(() => {
    setLayout();
  }, []);

  useEffect(() => {
    if (chatId) {
      dispatch(fetchChat({ chatId }));
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [waitingForMessage]);

  return (
    <div className={classNames(classes["chat"])}>
      <div
        ref={chatRef as any}
        className={classNames("container", classes["chat__bubble-container"])}
      >
        {(chat?.messages || []).map(({ bot, user }, i) => (
          <div key={i}>
            {user && <BubbleMessage _type="sending">{user}</BubbleMessage>}
            <BubbleMessage
              _image={`https://robohash.org/${chatId}?size=32x32`}
              _type="receiving"
            >
              {bot}
            </BubbleMessage>
          </div>
        ))}
        {waitingForMessage && (
          <div>
            {message && (
              <BubbleMessage _type="sending">{message}</BubbleMessage>
            )}
            <BubbleMessage _type="receiving" _isLoading={true}></BubbleMessage>
          </div>
        )}
      </div>
      <form
        className={classNames("container", classes["chat__input-row"])}
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            setWaitingForMessage(true);
            const response = await fetch(
              `${
                import.meta.env.FE_API_BASEURL
              }/message/send/${chatId}?turbo=${Number(chat?.is_turbo)}&lang=${
                window?.navigator?.language.split('-')[0].split('_')[0].toLowerCase() || import.meta.env.FE_DEFAULT_LANG
              }`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  message,
                }),
              }
            );
            if (!response.ok) {
              throw await response.json();
            }
            if (chatId) {
              dispatch(fetchChat({ chatId }));
            }
          } catch (err: any) {
            dispatch(
              sendNotification({
                color: "error",
                message: err?.error || "COMMON_ERROR",
              })
            );
          } finally {
            setMessage("");
            setWaitingForMessage(false);
          }
        }}
      >
        <div className={classes["chat__input-row__textarea"]}>
          <Textarea
            disabled={waitingForMessage}
            value={message}
            placeholder={t("chats.textarea_placeholder") || ""}
            onChange={(event) => {
              const { value } = event.target as HTMLTextAreaElement;
              setMessage(value);
            }}
          ></Textarea>
        </div>
        <div className={classes["chat__input-row__button"]}>
          <Button
            disabled={!message || waitingForMessage}
            _type="icon"
            type="submit"
          >
            {/*@ts-ignore*/}
            <ion-icon name="send-outline" size="large"></ion-icon>
          </Button>
        </div>
      </form>
    </div>
  );
};
