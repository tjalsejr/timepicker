import "server-only";
import type { Locale } from "./config";

const dictionaries = {
  ko: () => import("./dictionaries/ko").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["ko"]>>;

export const getDictionary = (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
