import dayjs from "dayjs";
import { auth } from "./fb";
import { store } from "./store";
import { LogBox } from "react-native";
import Navigation from "./navigation";
import { Provider } from "react-redux";
import AuthScreen from "./screens/Auth";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import duration from "dayjs/plugin/duration";
import Loader from "./components/common/Loader";
import useColorScheme from "./hooks/useColorScheme";
import { useAppDispatch, useAppSelector } from "./hooks/storeHooks";
import { setUserData } from "./store/user/userSlice";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import useCachedResources from "./hooks/useCachedResources";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllAsync } from "./utils/helpers";

dayjs.extend(duration);

const Compo = () => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isLoadingComplete = useCachedResources();
  const [initializing, setInitializing] = useState(true);

  const { userData } = useAppSelector(state => state.user);

  useEffect(() => {
    LogBox.ignoreAllLogs();
    const subscriber = onAuthStateChanged(auth, async userDetails => {
      if (userDetails) {
        const storedUser = await getAllAsync([
          "uid",
          "email",
          "level",
          "userName",
          "photoURL",
          "matricNo",
          "department",
          "accountType",
          "displayName",
        ]);

        if (storedUser?.uid) {
          dispatch(setUserData(storedUser));
        }
      }
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, []);

  if (!isLoadingComplete || initializing) {
    return <Loader />;
  } else {
    return (
      <SafeAreaProvider>
        <StatusBar />
        {!userData?.uid ? (
          <AuthScreen />
        ) : (
          <Navigation colorScheme={colorScheme} />
        )}
      </SafeAreaProvider>
    );
  }
};

export default function App() {
  return (
    <Provider store={store}>
      <Compo />
    </Provider>
  );
}
