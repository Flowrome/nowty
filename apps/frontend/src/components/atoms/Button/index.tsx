import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";
import classes from "./style.module.scss";

export interface ButtonInterface
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  _type?: "fill" | "outline" | "icon" | 'blank';
  _color?:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "success"
    | "light"
    | "dark";
}

export const Button = ({
  children,
  _type = "fill",
  _color = "primary",
  ...props
}: ButtonInterface) => {
  
  return (
    <button
      className={classNames({
        [classes["button"]]: true,
        [classes[`button--type-${_type}`]]: true,
        [classes[`button--color-${_color}`]]: true,
      })}
      {...props}
    >
      {children}
    </button>
  );
};
