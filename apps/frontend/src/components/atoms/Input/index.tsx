import classNames from "classnames";
import { InputHTMLAttributes } from "react";
import classes from "./style.module.scss";

export interface InputInterface extends InputHTMLAttributes<HTMLInputElement> {
  _color?:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "success"
    | "light"
    | "dark";
}

export const Input = ({
  children,
  _color = "primary",
  ...props
}: InputInterface) => {
  return (
    <input
      className={classNames({
        [classes["input"]]: true,
        [classes[`input--color-${_color}`]]: true,
      })}
      {...props}
    />
  );
};
