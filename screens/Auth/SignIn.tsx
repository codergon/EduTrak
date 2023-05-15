import Icons from "../../components/Icons";
import { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { Pressable, View } from "../../components/Themed";
import { mainColor } from "../../constants/Colors";
import { GOOGLE_ERROR, SCHOOL_DOMAIN } from "../../constants/configs";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "../../components/Customized";
import * as Google from "expo-auth-session/providers/google";
import { validatePassword, EmailValidator } from "../../utils";
import { BdText, InputBd, MdText, RgText } from "../../components/StyledText";
import { ArrowRight, CircleWavyWarning } from "phosphor-react-native";
import { GoogleAuthProvider, OAuthCredential } from "firebase/auth";
import {
  Keyboard,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { SignInGoogle, SignInUser } from "../../store/user/userSlice";
import { useAppDispatch } from "../../hooks/storeHooks";

import { GOOGLE_CLIENT_ID } from "@env";

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<any>(false);
  const [invalidDets, setInvalidDets] = useState("");

  const placeholderColor = "#808080";
  const isDark = colorScheme === "dark";
  const textColor = isDark ? "#ddd" : "#999";
  const highlight = isDark ? "#333" : "#f1f1f1";
  const highlightIcon = isDark ? "#fff" : "#000";

  const onSubmit = async () => {
    setError("");
    Keyboard.dismiss();
    if (isLoading) return;

    // VALIDATE EMAIL
    let emailAddr = email.toLowerCase().trim();
    if (!emailAddr.trim().length) {
      setInvalidDets("School Email is required");
      return;
    } else if (!EmailValidator.validate(emailAddr)) {
      setInvalidDets("Invalid Email provided");
      return;
    }

    // VALIDATE PASSWORD
    if (password.trim().length < 8) {
      setInvalidDets("Password should contan at least 8 characters");
      return;
    } else if (!validatePassword(password)) {
      setInvalidDets("Password should contan a number and an uppercase letter");
      return;
    }

    setInvalidDets("");
    setIsLoading(true);

    try {
      await dispatch(
        SignInUser({
          password,
          email: emailAddr,
        })
      );
    } catch (error) {
      // @ts-ignore
      setError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
  });

  const googleAuth = async (credential: OAuthCredential) => {
    setInvalidDets("");
    setIsLoading("authenticating");

    try {
      await dispatch(SignInGoogle(credential));
    } catch (error) {
      // @ts-ignore
      setError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      googleAuth(credential);
    }
  }, [response]);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          zIndex: 3,
          width: "100%",
          marginBottom: 16,
          flexDirection: "column",
        }}
      >
        <View style={{ marginBottom: 24, flexDirection: "column" }}>
          <MdText style={{ fontSize: 24, marginBottom: 8 }}>Hey there!</MdText>
          <RgText style={{ fontSize: 16 }}>
            Provide your details to continue,
          </RgText>
        </View>
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "column",
        }}
      >
        <InputBd
          value={email}
          maxLength={40}
          color={highlightIcon}
          keyboardType="email-address"
          onSubmitEditing={Keyboard.dismiss}
          placeholderTextColor={placeholderColor}
          placeholder="you@student.university.edu.ng"
          onChange={e => {
            const emailAddr = e.nativeEvent.text;
            const emailTxt = emailAddr.endsWith("@")
              ? emailAddr.slice(0, -1) + SCHOOL_DOMAIN
              : emailAddr;

            setEmail(p => (p.length < emailAddr.length ? emailTxt : emailAddr));
          }}
          style={[
            styles.input,
            { backgroundColor: highlight, marginBottom: 20 },
          ]}
        />

        <InputBd
          maxLength={40}
          value={password}
          color={highlightIcon}
          secureTextEntry={true}
          placeholder="*********"
          onSubmitEditing={Keyboard.dismiss}
          placeholderTextColor={placeholderColor}
          onChange={e => setPassword(e.nativeEvent.text)}
          style={[
            styles.input,
            { marginBottom: 20, backgroundColor: highlight },
          ]}
        />

        {(!!invalidDets || (!!error && error !== GOOGLE_ERROR)) && (
          <>
            <View
              style={[
                {
                  marginLeft: 4,
                  marginBottom: 16,
                  flexDirection: "row",
                },
              ]}
            >
              <CircleWavyWarning
                size={14}
                weight="bold"
                color={invalidDets ? "#ea8f3f" : "#e84f3e"}
                style={{ marginRight: 4, marginTop: 1 }}
              />
              <MdText
                style={{
                  fontSize: 12,
                  lineHeight: 15,
                  color: invalidDets ? "#ea8f3f" : "#e84f3e",
                }}
              >
                {invalidDets ? invalidDets : error}
              </MdText>
            </View>
          </>
        )}
      </View>

      <Pressable
        style={{
          height: 48,
          width: "100%",
          marginTop: 10,
          borderRadius: 6,
          alignItems: "center",
          position: "relative",
          justifyContent: "center",
          backgroundColor:
            isLoading && isLoading !== "authenticating" ? "#577ccc" : mainColor,
        }}
        onPress={onSubmit}
        disabled={isLoading || !request}
      >
        <MdText
          style={{
            fontSize: 16,
            color:
              isLoading && isLoading !== "authenticating" ? "#ccc" : "#fff",
          }}
        >
          Sign In
        </MdText>

        {isLoading && isLoading !== "authenticating" ? (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={{ position: "absolute", right: 20 }}
          />
        ) : (
          <ArrowRight
            size={20}
            weight="bold"
            style={{ position: "absolute", right: 20 }}
            color="#fff"
          />
        )}
      </Pressable>

      <View
        style={{
          marginTop: 30,
          backgroundColor: "transparent",
        }}
      >
        <MdText
          style={{
            fontSize: 12,
            lineHeight: 18,
            color: "#888",
          }}
        >
          You agree that by accessing the App, you are over the age of 13 years
          and you have read, understood, and agreed to be bound by all of the
          associated Terms of Use.
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

      <Pressable
        style={{
          height: 50,
          width: "100%",
          marginTop: 24,
          alignItems: "center",
          position: "relative",
          justifyContent: "center",
          borderColor: "#aaa",
          borderWidth: 1,
          borderRadius: 6,
        }}
        activeOpacity={0.6}
        disabled={!request}
        onPress={() => promptAsync()}
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

        {isLoading === "authenticating" && (
          <ActivityIndicator
            size="small"
            color="#000"
            style={{ position: "absolute", right: 20 }}
          />
        )}
      </Pressable>

      {error === GOOGLE_ERROR && (
        <>
          <View
            style={[
              {
                marginTop: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <MdText
              style={{
                fontSize: 12,
                lineHeight: 15,
                color: "#e84f3e",
                textAlign: "center",
              }}
            >
              {error}
            </MdText>
          </View>
        </>
      )}

      <Pressable
        style={{
          height: 50,
          width: "100%",
          marginTop: 20,
          borderRadius: 6,
          alignItems: "center",
          position: "relative",
          justifyContent: "center",
          flexDirection: "row",
        }}
        activeOpacity={0.6}
        onPress={() => navigation.navigate("Register")}
      >
        <MdText
          style={{
            fontSize: 15.5,
            textAlign: "center",
            textTransform: "capitalize",
          }}
        >
          New here?
        </MdText>
        <BdText
          style={{
            fontSize: 16,
            textAlign: "center",
            textTransform: "capitalize",
          }}
        >
          {" Sign Up"}
        </BdText>
      </Pressable>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    fontSize: 16,
    width: "100%",
    borderRadius: 6,
    marginBottom: 16,
    paddingHorizontal: 16,
    textAlignVertical: "center",
  },
});
