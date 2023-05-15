import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { QuizAnswer } from "./common";
import { StudyTaskProp } from "./study";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// APP SCREENS
export type RootStackParamList = {
  Modal: {
    data: StudyTaskProp["item"]["questions"];
  };
  NotFound: undefined;
  // AUTH SCREENS
  SignIn: undefined;
  Register: undefined;

  // APP SCREENS
  Console: undefined;
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Home: undefined;
  Study: NavigatorScreenParams<StudyStackParamList> | undefined;
  Courses: undefined;
  Profile: undefined;
};

export type StudyStackParamList = {
  Assigned: undefined;
  AttemptScreen: {
    taskId: string;
    taskInfo: StudyTaskProp["item"];
  };
  ViewResponses: {
    taskId: string;
    taskInfo: StudyTaskProp["item"];
  };
  IndividualResponses: {
    taskInfo: StudyTaskProp["item"];
    quizAnswer: QuizAnswer;
  };
  CreatedTasks: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
