import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types/types";
import * as React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import Icons from "../components/Icons";
import Colors from "../constants/Colors";
import HomeScreen from "../screens/Home";
import { ColorSchemeName } from "react-native";
import ModalScreen from "../screens/ModalScreen";
import { FontAwesome } from "@expo/vector-icons";
import TabTwoScreen from "../screens/TabTwoScreen";
import useColorScheme from "../hooks/useColorScheme";
import NotFoundScreen from "../screens/NotFoundScreen";
import LinkingConfiguration from "./LinkingConfiguration";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
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
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: Colors[colorScheme].tabBackground },
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<"Home">) => ({
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Icons.Home color={color} focused={focused} />
          ),
        })}
      />

      <BottomTab.Screen
        name="Study"
        component={TabTwoScreen}
        options={({ navigation }: RootTabScreenProps<"Study">) => ({
          title: "Study",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              size={24}
              name="tasks"
              color={color}
              style={{ marginTop: 4 }}
            />
          ),
        })}
      />

      <BottomTab.Screen
        name="Files"
        component={TabTwoScreen}
        options={({ navigation }: RootTabScreenProps<"Files">) => ({
          title: "Files",
          tabBarIcon: ({ color, focused }) => (
            <Icons.Folder color={color} focused={focused} />
          ),
        })}
      />

      <BottomTab.Screen
        name="Profile"
        component={TabTwoScreen}
        options={({ navigation }: RootTabScreenProps<"Profile">) => ({
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Icons.Profile color={color} focused={focused} />
          ),
        })}
      />
    </BottomTab.Navigator>
  );
}
