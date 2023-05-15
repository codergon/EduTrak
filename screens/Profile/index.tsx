import { auth } from "../../fb";
import { padding } from "../../utils";
import { signOut } from "firebase/auth";
import * as Icon from "phosphor-react-native";
import useColorScheme from "../../hooks/useColorScheme";
import { Image, Pressable, StyleSheet } from "react-native";
import { SafeAreaView, View } from "../../components/Themed";
import { BdText, MdText, RgText } from "../../components/StyledText";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserData } from "../../store/user/userSlice";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#666" : "#aaa";
  const subColor = isDark ? "#444" : "#e3e3e3";
  const otherColor = isDark ? "#444" : "#c8c8c8";

  const textColor = colorScheme === "dark" ? "#888" : "#666";

  const { userData } = useAppSelector(state => state.user);

  const OnSignOut = async () => {
    await signOut(auth)
      .then(async () => {
        await AsyncStorage.multiRemove([
          "uid",
          "email",
          "level",
          "matricNo",
          "userName",
          "department",
          "accountType",
          "photoURL",
          "displayName",
        ]);
        dispatch(setUserData(null));
        console.log("Signout successful");
      })
      .catch(error => {
        console.log("Signout error: ", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View
          style={[styles.imageContainer, { borderColor: subColor }]}
          lightColor="#ddd"
          darkColor="#888"
        >
          <Image
            style={{ width: "100%", height: "100%", borderRadius: 40 }}
            source={{
              uri:
                userData?.photoURL ||
                "https://images.unsplash.com/photo-1565378435245-4282cbde883e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=910&q=80",
            }}
          />
        </View>

        <View style={styles.userDetails}>
          <BdText style={styles.userName}>
            {userData?.userName ||
              userData?.displayName ||
              userData?.accountType ||
              "Guest User"}
          </BdText>
          <MdText
            style={[
              {
                fontSize: 15,
                marginTop: 0,
                color: textColor,
              },
            ]}
          >
            {userData?.email}
          </MdText>
        </View>
      </View>

      <View
        style={[
          styles.userStats,
          { borderBottomWidth: 1, borderBottomColor: subColor },
        ]}
      >
        {/* <View style={styles.stat}>
          <View style={styles.statItem}>
            <MdText style={styles.mainText} darkColor="#eee">
              Phone
            </MdText>
            <MdText style={styles.subText} lightColor="#999" darkColor="#888">
              +2349012894023
            </MdText>
          </View>

          <Pressable onPress={() => {}} style={styles.editButton}>
            {({ pressed }) => (
              <Icon.CaretRight size={18} weight="bold" color={iconColor} />
            )}
          </Pressable>
        </View> */}

        <View style={styles.stat}>
          <View style={styles.statItem}>
            <MdText style={styles.mainText} darkColor="#eee">
              Institution
            </MdText>
            <MdText style={styles.subText} lightColor="#999" darkColor="#888">
              United Global University
            </MdText>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.userStats,
          { borderBottomWidth: 1, borderBottomColor: subColor },
        ]}
      >
        <View style={styles.stat}>
          <View style={styles.statItem}>
            <MdText style={styles.mainText} darkColor="#eee">
              Account Type
            </MdText>
            <MdText
              style={{
                ...styles.subText,
                textTransform: userData?.accountType ? "capitalize" : "none",
              }}
              lightColor="#999"
              darkColor="#888"
            >
              {userData?.accountType || "Not provided"}
            </MdText>
          </View>
        </View>

        {userData?.accountType === "student" && (
          <View style={styles.stat}>
            <View style={styles.statItem}>
              <MdText style={styles.mainText} darkColor="#eee">
                Matric Number
              </MdText>
              <MdText
                style={{
                  ...styles.subText,
                  textTransform: userData?.matricNo ? "uppercase" : "none",
                }}
                lightColor="#999"
                darkColor="#888"
              >
                {userData?.matricNo || "Not provided"}
              </MdText>
            </View>
          </View>
        )}

        {userData?.accountType === "student" && (
          <View style={styles.stat}>
            <View style={styles.statItem}>
              <MdText style={styles.mainText} darkColor="#eee">
                Department
              </MdText>
              <MdText
                style={{
                  ...styles.subText,
                  textTransform: "uppercase",
                }}
                lightColor="#999"
                darkColor="#888"
              >
                {userData?.department || "Not provided"}
              </MdText>
            </View>
          </View>
        )}

        <View style={styles.stat}>
          <View style={styles.statItem}>
            <MdText style={styles.mainText} darkColor="#eee">
              Gender
            </MdText>
            <MdText style={styles.subText} lightColor="#999" darkColor="#888">
              Not Specified
            </MdText>
          </View>

          <Pressable onPress={() => {}} style={styles.editButton}>
            {({ pressed }) => (
              <Icon.CaretRight size={18} weight="bold" color={iconColor} />
            )}
          </Pressable>
        </View>
        <View style={styles.stat}>
          <View style={styles.statItem}>
            <MdText style={styles.mainText} darkColor="#eee">
              Nationality
            </MdText>
            <MdText style={styles.subText} lightColor="#999" darkColor="#888">
              Canadian
            </MdText>
          </View>

          <Pressable onPress={() => {}} style={styles.editButton}>
            {({ pressed }) => (
              <Icon.CaretRight size={18} weight="bold" color={iconColor} />
            )}
          </Pressable>
        </View>
      </View>

      <View style={{ ...styles.actions, display: "flex" }}>
        <Pressable
          onPress={OnSignOut}
          style={({ pressed }) => [
            {
              flexDirection: "row",
              ...styles.actionBtn,
              borderColor: otherColor,
              opacity: pressed ? 0.7 : 1,
              backgroundColor: "#2967c4",
            },
          ]}
        >
          <MdText
            style={{
              fontSize: 16,
              color: "#fff",
              textTransform: "capitalize",
            }}
          >
            Sign Out
          </MdText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
  },

  actionBtn: {
    width: "100%",
    marginTop: 4,
    borderRadius: 6,
    ...padding(13, 0),
    alignItems: "center",
    justifyContent: "center",
  },

  actions: {
    marginTop: 40,
    flexDirection: "column",
  },

  editButton: {
    borderRadius: 20,
    ...padding(4, 0, 4, 8),
  },

  signOutBtn: {
    width: "30%",
    borderRadius: 0,
    alignItems: "flex-end",
    ...padding(6, 0, 6, 18),
  },

  userStats: {
    ...padding(10, 0, 4),
    flexDirection: "column",
  },

  statItem: {
    flexDirection: "column",
  },
  stat: {
    ...padding(14, 0),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  subText: {
    fontSize: 13,
  },

  mainText: {
    fontSize: 15,
    marginBottom: 2,
  },

  topBar: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
    ...padding(15, 0),
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderRadius: 40,
    marginRight: 14,
  },
  userDetails: {
    flexDirection: "column",
  },
  userName: {
    fontSize: 20,
    textTransform: "capitalize",
  },
  userEmail: {
    fontSize: 14,
  },
});
