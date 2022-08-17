import { padding } from "../../utils";
import { Image, StyleSheet } from "react-native";
import { MdText, RgText } from "../../components/StyledText";
import { RootTabScreenProps } from "../../types/types";
import { SafeAreaView, Text, View } from "../../components/Themed";
import { ArrowRight, CaretDown } from "phosphor-react-native";
import Icons from "../../components/Icons";

const index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MdText style={{ fontSize: 19, marginBottom: 18 }}>
        Enter your matric number
      </MdText>

      <View style={{ flexDirection: "row", height: 46, width: "100%" }}>
        <View
          style={{
            width: 100,
            height: "100%",
            marginRight: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
          }}
          lightColor="#eee"
        >
          <MdText style={{ fontSize: 15 }}>EEG</MdText>

          <CaretDown size={12} weight="fill" style={{ marginLeft: 6 }} />
        </View>
        <View
          style={{
            flex: 1,
            height: "100%",
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 16,
            borderRadius: 6,
          }}
          lightColor="#eee"
        >
          <RgText
            style={{
              fontSize: 16,
              //   color: "#717171",
            }}
          >
            20-&nbsp;&nbsp;&nbsp;
          </RgText>
          <RgText
            style={{
              fontSize: 16,
              color: "#717171",
            }}
          >
            Matric number
          </RgText>
        </View>
      </View>

      <View
        style={{
          height: 52,
          width: "100%",
          marginTop: 18,
          alignItems: "center",
          position: "relative",
          justifyContent: "center",
          borderRadius: 6,
        }}
        lightColor="#2B59C3"
      >
        <MdText
          style={{
            fontSize: 16,
            color: "#fff",
          }}
        >
          Next
        </MdText>

        <ArrowRight
          size={20}
          weight="bold"
          style={{ position: "absolute", right: 20 }}
          color="#fff"
        />
      </View>

      <View
        style={{
          marginTop: 30,
          backgroundColor: "transparent",
        }}
      >
        <MdText
          style={{
            fontSize: 12,
            lineHeight: 22,
            color: "#888",
          }}
        >
          You agree that by accessing the Site, you are over the age of 13 years
          and you have read, understood, and agreed to be bound by all of these
          Terms of Use.
        </MdText>
      </View>

      <View
        style={{
          marginTop: 16,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            height: 1,
            marginTop: 2,
            backgroundColor: "#ccc",
          }}
        />
        <MdText
          style={{
            color: "#aaa",
            paddingHorizontal: 10,
          }}
        >
          or
        </MdText>
        <View
          style={{
            flex: 1,
            height: 1,
            marginTop: 2,
            backgroundColor: "#ccc",
          }}
        />
      </View>

      <View
        style={{
          height: 52,
          width: "100%",
          marginTop: 24,
          alignItems: "center",
          position: "relative",
          justifyContent: "center",
          borderColor: "#aaa",
          borderWidth: 1,
          borderRadius: 6,
        }}
      >
        <Icons.Google
          style={{ position: "absolute", left: 20, width: 18, height: 19 }}
        />

        <MdText
          style={{
            fontSize: 16,
          }}
        >
          Continue with Google
        </MdText>

        <ArrowRight
          size={20}
          weight="bold"
          style={{ position: "absolute", right: 20 }}
          color="#fff"
        />
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
    paddingHorizontal: 20,
  },
});
