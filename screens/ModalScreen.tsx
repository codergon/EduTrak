import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme } from "react-native";

import { Pressable, Text, View } from "../components/Themed";
import { useAppSelector } from "../hooks/storeHooks";
import { ModalScreenProps } from "../types/study";
import { padding } from "../utils";
import { MdText } from "../components/StyledText";
import { CaretRight, X } from "phosphor-react-native";

export default function ModalScreen({ route }: ModalScreenProps) {
  const navigation = useNavigation();
  const statusBarHeight = Constants.statusBarHeight;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const invColor = isDark ? "#fff" : "#000";
  const borderColor = isDark ? "#666" : "#ddd";
  const borderColor2 = isDark ? "#444" : "#e3e3e3";

  const { data } = route.params;
  const { userData } = useAppSelector(state => state.user);

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 20,
          flexDirection: "column",
        }}
      >
        <View
          style={{
            marginBottom: 20,
            ...padding(0, 4, 16),
            borderBottomWidth: 1,
            flexDirection: "row",
            alignItems: "center",
            borderColor: borderColor,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <MdText
              style={{
                fontSize: 22,
              }}
            >
              Questions{" "}
            </MdText>
            <MdText
              style={{
                fontSize: 22,
                letterSpacing: 2,
              }}
            >
              ({data?.length})
            </MdText>
          </View>

          <Pressable
            style={{
              width: 30,
              height: 30,
              marginLeft: 12,
              borderRadius: 40,
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: isDark ? "#383838" : "#e5e5e5",
            }}
            onPress={() => navigation.goBack()}
          >
            <X size={17} weight={"bold"} color={isDark ? "#ccc" : "#777"} />
          </Pressable>
        </View>

        {data?.map((question, index) => {
          return (
            <View
              key={index}
              style={{
                borderWidth: 1,
                borderRadius: 8,
                marginBottom: 16,
                ...padding(12, 16, 14),
                flexDirection: "column",
                borderColor: isDark ? "#444" : "#e3e3e3",
                backgroundColor: isDark ? "#1a1a1a" : "#fafafa",
              }}
            >
              <View
                style={{
                  marginBottom: 12,
                  flexDirection: "column",
                  backgroundColor: "transparent",
                }}
              >
                <MdText
                  style={{
                    fontSize: 13,
                    paddingTop: 2,
                    marginBottom: 4,
                    lineHeight: 13 * 1.3,
                    textTransform: "uppercase",
                  }}
                >
                  Question
                </MdText>
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "transparent",
                  }}
                >
                  <MdText style={{ color: isDark ? "#aaa" : "#666" }}>
                    {question?.question}
                  </MdText>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "transparent",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    backgroundColor: "transparent",
                  }}
                >
                  <MdText
                    style={{
                      fontSize: 13,
                      paddingTop: 2,
                      marginBottom: 3,
                      lineHeight: 13 * 1.3,
                      textTransform: "uppercase",
                    }}
                  >
                    Response Type
                  </MdText>
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "transparent",
                    }}
                  >
                    <MdText
                      style={{
                        color: isDark ? "#aaa" : "#666",
                        textTransform: "capitalize",
                      }}
                    >
                      {question?.responseType?.replace("-", " ")}
                    </MdText>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  container: {
    flexGrow: 1,
    ...padding(16, 20, 20),
    flexDirection: "column",
  },

  scrollContainer: {
    flexGrow: 1,
  },

  actionBtn: {
    flex: 0,
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 120,
    ...padding(6, 12),
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#2967C4",
  },

  createBtn: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 120,
    ...padding(10, 16, 10, 20),
    borderWidth: 1,
  },

  submitBtn: {
    marginTop: 10,
    borderRadius: 12,
    ...padding(13, 20),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#2b6cce",
  },
  submitBtnText: {
    fontSize: 17,
    color: "#fff",
    marginHorizontal: 7,
    textTransform: "capitalize",
  },
});
