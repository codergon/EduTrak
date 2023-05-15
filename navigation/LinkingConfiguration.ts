import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types/types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: "home",
            },
          },
          Courses: {
            screens: {
              FilesScreen: "Files",
            },
          },
          Study: {
            screens: {
              Console: "Console",
              Assigned: "Assigned",
              CreatedTasks: "CreatedTasks",
              AttemptScreen: "AttemptScreen",
              ViewResponses: "ViewResponses",
              IndividualResponses: "IndividualResponses",
            },
          },
        },
      },
      Modal: "modal",
      NotFound: "*",
    },
  },
};

export const authLinking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      SignIn: {
        screens: {
          SignIn: "signin",
        },
      },
      Register: {
        screens: {
          Register: "register",
        },
      },
    },
  },
};

export default linking;
