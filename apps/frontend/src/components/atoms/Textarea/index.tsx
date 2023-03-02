import classNames from "classnames";
import { ChangeEvent, TextareaHTMLAttributes, useRef, useState } from "react";
import classes from "./style.module.scss";

export interface TextareaInterface
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  _color?:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "success"
    | "light"
    | "dark";
}

export const Textarea = ({
  _color = "primary",
  ...props
}: TextareaInterface) => {
  const [height, setHeight] = useState(56);
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (ref.current) {
      const element = ref.current;
      setHeight(Math.max(Math.min(element.scrollHeight, 200), 56));
      if (!props.value || props?.value === "") {
        setHeight(56);
      }
      if (props?.onChange) {
        props.onChange(event);
      }
    }
  };

  return (
    <textarea
      className={classNames({
        [classes["textarea"]]: true,
        [classes[`textarea--color-${_color}`]]: true,
      })}
      {...props}
      ref={ref}
      onChange={handleChange}
      style={{ height: `${height}px` }}
    />
  );
};
