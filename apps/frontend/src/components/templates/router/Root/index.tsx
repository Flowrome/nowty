import { Notification } from "@components/atoms/Notification";
import { RootState } from "@store";
import classNames from "classnames";
import { ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { init } from "@i18n";
import classes from "./style.module.scss";
import { i18n } from "i18next";

const Main = ({
  children,
  header,
  mainHeight,
}: {
  children: ReactNode;
  header: boolean;
  mainHeight: "full" | "auto" | "header-fixed";
}) => {
  return (
    <main
      className={classNames({
        [classes["main"]]: true,
        [classes[`main--height-${mainHeight}`]]: true,
        [classes["main--no-header"]]: !header,
      })}
    >
      {children}
    </main>
  );
};

const Header = ({ children }: { children: ReactNode }) => {
  return <header className={classes["header"]}>{children}</header>;
};

const Footer = ({ children }: { children: ReactNode }) => {
  return <footer className={classes["footer"]}>{children}</footer>;
};

export const Root = () => {
  const [i18n, setI18n] = useState<i18n | null>(null);

  useEffect(() => {
    (async () => {
      setI18n(await init());
    })();
  }, []);

  const { header, footer, mainHeight } = useSelector(
    ({ layout: { has, options } }: RootState) => ({ ...has, ...options })
  );

  return !!i18n ? (
    <I18nextProvider i18n={i18n}>
      <Notification></Notification>
      {header && <Header>{header}</Header>}
      <Main header={!!header} mainHeight={mainHeight}>
        <Outlet></Outlet>
      </Main>
      {footer && <Footer>{footer}</Footer>}
    </I18nextProvider>
  ) : (
    <></>
  );
};
