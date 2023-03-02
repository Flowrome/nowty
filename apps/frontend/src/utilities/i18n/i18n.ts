import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const init = async () => {
  const {
    data: { translations },
  } = await fetch(`${import.meta.env.FE_API_BASEURL}/langs/load`, {
    method: "GET",
  }).then((response) => response.json());
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        ...translations,
      },
      fallbackLng: import.meta.env.FE_DEFAULT_LANG,
    });
  return i18n;
};
