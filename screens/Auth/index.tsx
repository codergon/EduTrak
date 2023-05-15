import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { RootStackParamList } from "../../types/types";
import { authLinking } from "../../navigation/LinkingConfiguration";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "./SignIn";
import Register from "./Register";

const index = () => {
  const colorScheme = useColorScheme();
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer
      linking={authLinking}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack.Navigator
        initialRouteName="SignIn"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default index;
