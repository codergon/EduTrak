import {
  RootTabParamList,
  RootTabScreenProps,
  RootStackParamList,
} from "../types/types";
import * as React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import Icons from "../components/Icons";
import Colors from "../constants/Colors";
import { ColorSchemeName } from "react-native";
import ModalScreen from "../screens/ModalScreen";
import useColorScheme from "../hooks/useColorScheme";
import NotFoundScreen from "../screens/NotFoundScreen";
import LinkingConfiguration from "./LinkingConfiguration";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import StudyScreen from "../screens/Study";
import ProfileScreen from "../screens/Profile";
import Courses from "../screens/Courses";
import Console from "../screens/Study/Console/Console";
import HomeScreen from "../screens/Home";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

//  ROOT NAVIGATOR
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Root"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Console"
        component={Console}
        options={{ gestureEnabled: false, animation: "simple_push" }}
      />

      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

//  BOTTOM TAB NAVIGATOR
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Study"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: Colors[colorScheme].tabBackground },
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      {/* <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<"Home">) => ({
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Icons.Home color={color} focused={focused} />
            // <Icons.Folder color={color} focused={focused} />
          ),
        })}
      /> */}

      <BottomTab.Screen
        name="Study"
        component={StudyScreen}
        options={({ navigation }: RootTabScreenProps<"Study">) => ({
          tabBarIcon: ({ color, focused }) => (
            // <Icons.Tasks color={color} focused={focused} />
            <Icons.Home color={color} focused={focused} />
          ),
        })}
      />

      <BottomTab.Screen
        name="Courses"
        component={Courses}
        options={({ navigation }: RootTabScreenProps<"Courses">) => ({
          tabBarIcon: ({ color, focused }) => (
            // <Icons.Folder color={color} focused={focused} />
            <Icons.Tasks color={color} focused={focused} />
          ),
        })}
      />

      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }: RootTabScreenProps<"Profile">) => ({
          tabBarIcon: ({ color, focused }) => (
            <Icons.Profile color={color} focused={focused} />
          ),
        })}
      />
    </BottomTab.Navigator>
  );
}
