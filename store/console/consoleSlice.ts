import { createSlice } from "@reduxjs/toolkit";
import { Question } from "../../types/study";

interface ConsoleState {
  course: any;
  inputValue: string;
  revealInput: boolean;
  questions: Question[];
  activeQuestion: Question | null;

  isEmptyCourses: boolean;
  isFetchingCourses: boolean;
}

const initialState = {
  course: null,
  questions: [],
  inputValue: "",
  revealInput: true,
  activeQuestion: null,

  isEmptyCourses: false,
  isFetchingCourses: true,
} as ConsoleState;

export const consoleSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    toggleInput: (state, action) => {
      state.revealInput = action.payload;
    },
    updateInput: (state, action) => {
      state.inputValue = action.payload;
    },
    updateCourse: (state, action) => {
      state.course = action.payload;
    },
    updateActive: (state, action) => {
      state.activeQuestion = action.payload;
    },
    updateQuestions: (state, action) => {
      state.questions = action.payload;
    },

    updateFetchStatus: (state, action) => {
      state.isFetchingCourses = action.payload;
    },
    toggleIsEmpty: (state, action) => {
      state.isEmptyCourses = action.payload;
    },
  },
});

export const {
  toggleInput,
  updateInput,
  updateCourse,
  updateActive,
  toggleIsEmpty,
  updateQuestions,
  updateFetchStatus,
} = consoleSlice.actions;
export default consoleSlice.reducer;
