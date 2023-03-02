import classes from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setFooter, setHeader, setOptionMainHeight } from "@reducers/layout";
import { useEffect, useState } from "react";
import { fetchChats, newChat, newTurboChat } from "@reducers/chats";
import { RootState } from "@store";
import classNames from "classnames";
import { Button } from "@components/atoms/Button";
import { ChatListElem } from "@components/atoms/ChatListElem";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { sendNotification } from "@reducers/notifications";

const ChatsHeader = () => {
  const { t } = useTranslation();
  return (
    <div className={classNames("container", classes["chats-header"])}>
      <h1 className={classes["chats-header__headline"]}>
        {t("app_name").toUpperCase()}
      </h1>
      <div className={classes["chats-header__button"]}></div>
    </div>
  );
};

export const Chats = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chats = useSelector(({ chats: { list } }: RootState) => list);

  const setLayout = () => {
    dispatch(setOptionMainHeight("header-fixed"));
    dispatch(setHeader(<ChatsHeader></ChatsHeader>));
    dispatch(setFooter(null));
  };

  useEffect(() => {
    setLayout();
    dispatch(fetchChats());
  }, []);

  return (
    <div
      className={classNames(
        "container",
        "container--no-padding",
        classes["chats"]
      )}
    >
      <div className={classNames(classes["chats__action-container"])}>
        <Button
          onClick={() => {
            dispatch(newChat());
          }}
          _type="blank"
        >
          <p>{t("chats.add_davinci_chat")}</p>
          {/*@ts-ignore*/}
          <ion-icon name="add-outline" size="large"></ion-icon>
        </Button>
        <Button
          onClick={() => {
            dispatch(newTurboChat());
          }}
          _type="blank"
        >
          <p>{t("chats.add_turbo_chat")}</p>
          {/*@ts-ignore*/}
          <ion-icon name="add-outline" size="large"></ion-icon>
        </Button>
        <Button
          onClick={async () => {
            try {
              const response = await fetch(
                `${import.meta.env.FE_API_BASEURL}/openai/reset`,
                {
                  method: "DELETE",
                }
              );
              if (!response.ok) {
                throw await response.json();
              }
              navigate("/register", { replace: true });
            } catch (err: any) {
              dispatch(
                sendNotification({
                  color: "error",
                  message: err?.error || "COMMON_ERROR",
                })
              );
            }
          }}
          _type="blank"
        >
          <p>{t("chats.reset_api_key")}</p>
          {/*@ts-ignore*/}
          <ion-icon name="refresh-outline" size="large"></ion-icon>
        </Button>
      </div>
      {chats?.length > 0 ? (
        [...chats]
          .reverse()
          .map(({ title, _id, is_turbo }) => (
            <ChatListElem
              _type={
                is_turbo ? t("chats.types.turbo") : t("chats.types.davinci")
              }
              onClick={() => navigate(`/chat/${_id}`)}
              key={_id}
              _title={title || t("chats.generic_title_list_elem")}
              _image={`https://robohash.org/${_id}?size=96x96`}
            ></ChatListElem>
          ))
      ) : (
        <></>
      )}
    </div>
  );
};
