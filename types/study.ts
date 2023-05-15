import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { Timestamp } from "firebase/firestore";
import {
  RootStackParamList,
  RootTabParamList,
  StudyStackParamList,
} from "./types";

export type AssignedProps = NativeStackScreenProps<
  StudyStackParamList,
  "Assigned"
>;
export type QnAProps = NativeStackScreenProps<
  StudyStackParamList,
  "AttemptScreen"
>;

export type ResponsesProps = NativeStackScreenProps<
  StudyStackParamList,
  "ViewResponses"
>;

export type IndividualResponsesProps = NativeStackScreenProps<
  StudyStackParamList,
  "IndividualResponses"
>;

export type ModalScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Modal"
>;

export type StudyTaskProp = {
  index: number;
  lastIndex: number;
  item: {
    id: string;
    dateDue: Timestamp;
    courseId: string;
    creatorId: string;
    courseName: string;
    dateCreated: string;
    description?: string;
    questions: Question[];
    departments: string[];
    lecturerName: string;
  };
  navigation?: NativeStackNavigationProp<
    StudyStackParamList,
    "Assigned",
    undefined
  >;
};

export type QuizAttempt = StudyTaskProp["item"] | null;

export type numStr = number | string;
export type responseType =
  | "text-input"
  | "options-select"
  | "file-upload"
  | "multiple-choice";
export type answerOptions = {
  id: string;
  value: string;
  isCorrect: boolean;
  selected?: boolean;
}[];
export type answerOptionsType = "single" | "multiple";

export interface Question {
  active?: boolean;

  id?: numStr;
  question: string;
  completed?: boolean;

  answer?: string;

  response?: string;

  responseType?: responseType;
  answerOptions?: answerOptions | null;
  answerOptionsType?: answerOptionsType;
}
