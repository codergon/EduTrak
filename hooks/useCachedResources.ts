import { Octicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Octicons.font,
          "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
          "general-md": require("../assets/fonts/GeneralSans/GeneralSans-Medium.otf"),
          "general-rg": require("../assets/fonts/GeneralSans/GeneralSans-Regular.otf"),
          "general-bd": require("../assets/fonts/GeneralSans/GeneralSans-Semibold.otf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
