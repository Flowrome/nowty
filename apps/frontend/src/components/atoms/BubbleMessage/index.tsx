import classNames from "classnames";
import { HTMLAttributes } from "react";
import classes from "./style.module.scss";

export interface BubbleMessageInterface extends HTMLAttributes<HTMLElement> {
  _type: "sending" | "receiving";
  _isLoading?: boolean;
  _image?: string;
  children?: string;
}

export const BubbleMessage = ({
  children,
  _type,
  _isLoading,
  _image,
  ...props
}: BubbleMessageInterface) => {
  return (
    <div
      className={classNames({
        container: true,
        [classes["bubble-message"]]: true,
        [classes[`bubble-message--type-${_type}`]]: true,
      })}
      {...props}
    >
      {_type === 'receiving' && _image && <img className={classes["bubble-message__image"]} src={_image}></img>}
      <div
        className={classes["bubble-message__content"]}
        {...(_isLoading
          ? {}
          : { dangerouslySetInnerHTML: { __html: `<pre>${children}</pre>` } })}
      >
        {_isLoading && (
          <div className={classes["bubble-message__content__loading"]}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>
    </div>
  );
};
