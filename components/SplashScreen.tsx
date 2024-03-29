import { StyleSheet } from "react-native";
import { SafeAreaView } from "./Themed";
import { BdText } from "./StyledText";

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <BdText style={{ fontSize: 24, letterSpacing: 0.5 }}>EduTrak</BdText>
      <BdText
        style={{
          fontSize: 12,
          color: "#aaa",
          marginTop: 10,
          letterSpacing: 0.5,
        }}
      >
        Streamline Assessments, Maximize Results
      </BdText>
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
