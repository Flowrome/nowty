import classes from "./style.module.scss";
import { useDispatch } from "react-redux";
import { setFooter, setHeader, setOptionMainHeight } from "@reducers/layout";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { Button } from "@components/atoms/Button";
import { Input } from "@components/atoms/Input";
import { sendNotification } from "@reducers/notifications";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const RegisterApiKey = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState("");
  const { t } = useTranslation();

  const setLayout = () => {
    dispatch(setOptionMainHeight("full"));
    dispatch(setHeader(null));
    dispatch(setFooter(null));
  };

  useEffect(() => {
    setLayout();
  }, []);

  return (
    <div className={classNames("container", classes["register-api-key"])}>
      <form
        className={classes["register-api-key__row"]}
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            const response = await fetch(
              `${import.meta.env.FE_API_BASEURL}/openai/init`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  api_key: apiKey,
                }),
              }
            );
            if (!response.ok) {
              throw await response.json();
            }
            navigate("/chats");
          } catch (err: any) {
            dispatch(
              sendNotification({
                color: "error",
                message: err?.error || "COMMON_ERROR",
              })
            );
          }
        }}
      >
        <div className={classes["register-api-key__row__input"]}>
          <Input
            placeholder={t("submit_key.input_placeholder") || ""}
            onChange={(event) => {
              const { value } = event.target as HTMLInputElement;
              setApiKey(value);
            }}
          ></Input>
        </div>
        <div className={classes["register-api-key__row__button"]}>
          <Button disabled={!apiKey} _type="icon" type="submit">
            {/*@ts-ignore*/}
            <ion-icon name="arrow-forward-outline" size="large"></ion-icon>
          </Button>
        </div>
      </form>
    </div>
  );
};
