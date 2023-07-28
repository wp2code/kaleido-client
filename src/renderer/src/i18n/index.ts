import { createI18n } from "vue-i18n";
import { useAppStoreHook } from "@/store/modules/app";

const appStore = useAppStoreHook();
// 本地语言包
import enLocale from "./language/en";
import zhCnLocale from "./language/zh-cn";

const messages = {
  "zh-cn": {
    ...zhCnLocale,
  },
  en: {
    ...enLocale,
  },
};

const i18n = createI18n({
  legacy: false,
  locale: appStore.language,
  messages: messages,
  globalInjection: true,
});

export default i18n;
