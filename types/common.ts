import { Timestamp } from "firebase/firestore";
import { ViewStyle } from "react-native";
import { ViewProps } from "../components/Themed";
import { Question } from "./study";

export interface TopbarProp {
  title?: string;
  subtitle?: string;
}

export type Quiz = {
  id: string;
  courseId: string;
  creatorId: string;
  dateDue: Timestamp;
  courseName: string;
  dateCreated: string;
  description?: string;
  questions: Question[];
  departments: string[];
  lecturerName: string;
};

export interface QuizAnswer extends Quiz {
  quizId: string;
  studentId: string;
  studentName: string;
  studentMatricNo: string;
}

// ============================

export interface MenuItemProps extends ViewProps {
  value?: any;
  index?: number;
  isLast?: boolean;
  isActive?: boolean;
  itemHeight?: number;
  onSelect?: (value: any) => void;
}

export type MarginsType = {
  left?: number;
  right?: number;
};

export type MeasureType = {
  left?: number;
  right?: number;
  width?: any;
  height?: any;
  bottom?: any;
} | null;

export type AppMenuType = (
  props: ViewProps & {
    font?: number;
    full?: boolean;
    multiline?: boolean;
    capitals?: boolean;
    itemHeight?: number;
    containerStyle?: ViewStyle;
    direction?: "top" | "bottom";
    align?: "center" | "end" | "start";
  }
) => React.ReactElement;

export type useMenuType = (
  defaultOption: any,
  items: any[],
  filter?: boolean,
  useFirst?: boolean,
  itemKey?: string
) => [AppMenuType, any, () => void, any];

export type useClickOutType = (
  ref: React.RefObject<any>,
  onCallaback: () => any
) => void;
