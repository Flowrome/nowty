import classNames from "classnames";
import { HTMLAttributes, useRef, useState } from "react";
import classes from "./style.module.scss";

export interface ChatListElemInterface extends HTMLAttributes<HTMLDivElement> {
  _image: string;
  _title: string;
  _type: string;
}

export const ChatListElem = ({
  _title,
  _image,
  _type,
  ...props
}: ChatListElemInterface) => {
  return (
    <div
      role="button"
      className={classNames({
        [classes["chat-list-elem"]]: true,
      })}
      {...props}
    >
      <img
        className={classNames({
          [classes["chat-list-elem__image"]]: true,
        })}
        src={_image}
      ></img>
      <p
        className={classNames({
          [classes["chat-list-elem__title"]]: true,
        })}
      >
        {_title}
      </p>
      <p className={classes["chat-list-elem__type"]}>{_type}</p>
    </div>
  );
};
