import { atom, selector, AtomEffect } from "recoil";
import { Question } from "../types/study";

export const activeEdit = atom({
  key: "activeEdit",
  default: null as Question | null,
});

export const questionsList = atom({
  key: "questionsList",
  default: [] as Question[],
});

export const consoleInput = atom({
  key: "consoleInput",
  default: "",
});

export const showMainInputState = atom({
  key: "showMainInputState",
  default: true,
});
