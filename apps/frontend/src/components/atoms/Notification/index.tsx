import classNames from "classnames";
import { HTMLAttributes, useEffect, useState } from "react";
import classes from "./style.module.scss";
import {
  Notification as NotificationElementInterface,
  removeNotification,
} from "@reducers/notifications";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@store";
import { useTranslation } from "react-i18next";

export interface NotificationInterface extends HTMLAttributes<HTMLElement> {}

export const Notification = ({ ...props }: NotificationInterface) => {
  const notifications = useSelector(
    ({ notifications: { list } }: RootState) => list
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [notificationArray, setNotificationArray] = useState<
    NotificationElementInterface[]
  >([]);
  const [currentNotification, setCurrentNotification] =
    useState<NotificationElementInterface | null>(null);
  const [nextToRemove, setNextToRemove] = useState<number | null>(null);
  useEffect(() => {
    notifications.forEach((elem) => {
      if (
        !notificationArray.find(({ timestamp }) => elem.timestamp === timestamp)
      ) {
        setNotificationArray((state) => [...state, elem]);
      }
    });
  }, [notifications]);

  useEffect(() => {
    if (notificationArray.length > 0) {
      setCurrentNotification(notificationArray[0]);
    }
  }, [notificationArray]);

  useEffect(() => {
    if (currentNotification) {
      setNextToRemove(currentNotification?.timestamp || null);
      setTimeout(() => {
        setCurrentNotification(null);
      }, 3000);
    }
  }, [currentNotification]);

  useEffect(() => {
    if (nextToRemove && !currentNotification) {
      setTimeout(() => {
        setNotificationArray((state) => [
          ...state.filter(({ timestamp }) => timestamp !== nextToRemove),
        ]);
        dispatch(removeNotification(nextToRemove));
      }, 500);
    }
  }, [nextToRemove, currentNotification]);

  return !!currentNotification ? (
    <div
      className={classNames({
        [classes["notification"]]: true,
        [classes[`notification--color-${currentNotification.color}`]]: true,
      })}
      {...props}
    >
      <p>{t(`errors.${currentNotification.message}`)}</p>
    </div>
  ) : (
    <></>
  );
};
