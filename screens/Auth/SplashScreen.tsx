import { StyleSheet } from "react-native";
import { SafeAreaView } from "../../components/Themed";
import { BdText, MdText } from "../../components/StyledText";

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MdText style={{ fontSize: 24, letterSpacing: 0.5 }}>Optick</MdText>
      <MdText
        style={{
          fontSize: 12,
          color: "#aaa",
          marginTop: 10,
          letterSpacing: 0.5,
        }}
      >
        Safe haven to improve
      </MdText>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
