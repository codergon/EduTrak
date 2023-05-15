import {
  Keyboard,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import {
  CaretDown,
  ArrowRight,
  CircleWavyWarning,
} from "phosphor-react-native";
import { useState } from "react";
import useMenu from "../../hooks/useMenu";
import { mainColor } from "../../constants/Colors";
import { Pressable, View } from "../../components/Themed";
import { SafeAreaAutoDismiss } from "../../components/Customized";
import BackButton from "../../components/common/BackButton";
import { InputBd, MdText, RgText } from "../../components/StyledText";
import { departments, SCHOOL_DOMAIN } from "../../constants/configs";
import { EmailValidator, padding, validatePassword } from "../../utils";
import { useAppDispatch } from "../../hooks/storeHooks";
import { RegisterUser } from "../../store/user/userSlice";

const Register = () => {
  const dispatch = useAppDispatch();

  const colorScheme = useColorScheme();
  const placeholderColor = "#808080";
  const isDark = colorScheme === "dark";
  const labelColor = isDark ? "#ddd" : "#999";
  const highlight = isDark ? "#333" : "#f1f1f1";
  const highlightIcon = isDark ? "#fff" : "#000";

  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [matNum, setMatNum] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [invalidDets, setInvalidDets] = useState("");

  const formatInput = (value: string) => {
    const fv = value.trim();
    const nums = fv.replace("-", "");

    if (isNaN(Number(nums))) return;

    const yr = Number(nums.slice(0, 2));

    const ft =
      yr > 24 && nums?.length >= 2
        ? "24"
        : yr < 14 && nums?.length >= 2
        ? "14"
        : nums?.length > 2
        ? nums.slice(0, 2) + "-" + nums.slice(2)
        : fv;

    setMatNum(ft);
  };

  const [SignInOptions, acctType, closeAcctMenu] = useMenu(
    "student",
    ["student", "lecturer"],
    true
  );
  const [AppMenu, currentOption, closeLvlMenu] = useMenu("100", [
    "100",
    "200",
    "300",
    "400",
    "500",
  ]);
  const [SelectDepartment, department, closeDeptMenu] = useMenu(
    "csc",
    departments
  );

  const onSubmit = async () => {
    setError("");
    Keyboard.dismiss();
    if (isLoading) return;

    // VALIDATE USERNAME
    if (userName.trim().length < 5) {
      setInvalidDets("Please provide a name with at least 5 characters");
      return;
    }

    // VALIDATE MATRIC NUMBER
    if (acctType === "student" && matNum.trim().length < 6) {
      setInvalidDets("Invalid Matric Number provided");
      return;
    }

    // VALIDATE EMAIL
    let emailAddr = email.toLowerCase().trim();
    if (!emailAddr.trim().length) {
      setInvalidDets("Email is required");
      return;
    }
    //  else if (!emailAddr.endsWith(SCHOOL_DOMAIN) && acctType === "student") {
    //   if (emailAddr.includes("@")) {
    //     setInvalidDets("Email does not match school domain");
    //     return;
    //   } else if (EmailValidator.validate(emailAddr + SCHOOL_DOMAIN)) {
    //     emailAddr += SCHOOL_DOMAIN;
    //   } else {
    //     setInvalidDets("Invalid School Email provided");
    //     return;
    //   }
    // }
    else if (!EmailValidator.validate(emailAddr)) {
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
        RegisterUser({
          userName,
          password,
          department,
          email: emailAddr,
          accountType: acctType,
          level: Number(currentOption),
          matricNo: `${department}-20${matNum}`,
        })
      );
    } catch (error) {
      // @ts-ignore
      setError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaAutoDismiss
      onClickIn={[closeAcctMenu, closeLvlMenu, closeDeptMenu]}
      style={styles.container}
    >
      <>
        <View
          style={{
            zIndex: 3,
            width: "100%",
            flexDirection: "column",
          }}
        >
          <View style={{ marginBottom: 30, flexDirection: "column" }}>
            <View
              style={{
                marginBottom: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <BackButton />

              <MdText style={{ fontSize: 22, marginLeft: 10 }}>Sign Up</MdText>
            </View>

            <RgText style={{ fontSize: 16 }}>
              Input details below to create acccount
            </RgText>
          </View>

          <View
            style={{
              marginBottom: 22,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <SignInOptions full capitals align="start" itemHeight={42}>
                <Pressable
                  style={{
                    height: 46,
                    width: "100%",
                    borderRadius: 6,
                    ...padding(0, 14),
                    position: "relative",
                    alignItems: "center",
                    flexDirection: "row",
                    backgroundColor: highlight,
                    justifyContent: "space-between",
                  }}
                >
                  <MdText
                    style={{
                      fontSize: 14,
                      textTransform: "uppercase",
                    }}
                  >
                    I am a {acctType}
                  </MdText>
                  <CaretDown
                    size={12}
                    weight="fill"
                    color={highlightIcon}
                    style={{ marginLeft: 6 }}
                  />
                </Pressable>
              </SignInOptions>
            </View>

            {acctType === "student" && (
              <AppMenu align="end">
                <Pressable
                  style={{ ...styles.selectBtn, backgroundColor: highlight }}
                >
                  <MdText
                    style={{
                      fontSize: 14,
                      textTransform: "uppercase",
                    }}
                  >
                    {currentOption + " Lvl"}
                  </MdText>
                </Pressable>
              </AppMenu>
            )}
          </View>
        </View>

        <View
          style={{
            width: "100%",
            flexDirection: "column",
          }}
        >
          <RgText style={[styles.label, { color: labelColor }]}>
            Full Name
          </RgText>
          <InputBd
            maxLength={40}
            value={userName}
            color={highlightIcon}
            placeholder="Elizabeth Keen"
            onSubmitEditing={Keyboard.dismiss}
            placeholderTextColor={placeholderColor}
            onChange={e => setUserName(e.nativeEvent.text)}
            style={[
              styles.input,
              { marginBottom: 20, backgroundColor: highlight },
            ]}
          />
        </View>

        {acctType === "student" && (
          <>
            <RgText style={[styles.label, { color: labelColor }]}>
              Matric number
            </RgText>

            <View
              style={{
                zIndex: 2,
                height: 46,
                width: "100%",
                marginBottom: 20,
                flexDirection: "row",
              }}
            >
              <SelectDepartment capitals align="start">
                <Pressable
                  style={{
                    width: 100,
                    height: "100%",
                    marginRight: 16,
                    borderRadius: 6,
                    position: "relative",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: highlight,
                  }}
                >
                  <MdText style={{ fontSize: 14, textTransform: "uppercase" }}>
                    {department}
                  </MdText>

                  <CaretDown
                    size={12}
                    weight="fill"
                    color={highlightIcon}
                    style={{ marginLeft: 6 }}
                  />
                </Pressable>
              </SelectDepartment>

              <View
                style={{
                  flex: 1,
                  height: "100%",
                  borderRadius: 6,
                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 16,
                  backgroundColor: highlight,
                }}
              >
                <MdText style={{ fontSize: 16 }}>20</MdText>

                <InputBd
                  maxLength={6}
                  value={matNum}
                  color={highlightIcon}
                  placeholder="24-XYZ"
                  style={styles.matricInput}
                  placeholderTextColor={placeholderColor}
                  onChange={e => formatInput(e.nativeEvent.text)}
                />
              </View>
            </View>
          </>
        )}

        <View
          style={{
            width: "100%",
            flexDirection: "column",
          }}
        >
          <RgText style={[styles.label, { color: labelColor }]}>
            School email
          </RgText>
          <InputBd
            value={email}
            maxLength={40}
            color={highlightIcon}
            keyboardType="email-address"
            onSubmitEditing={Keyboard.dismiss}
            placeholderTextColor={placeholderColor}
            placeholder={`${
              acctType === "student" ? "student" : "lecturer"
            }@university.edu`}
            onChange={e => {
              const emailAddr = e.nativeEvent.text;
              const emailTxt = emailAddr.endsWith("@")
                ? emailAddr.slice(0, -1) + SCHOOL_DOMAIN
                : emailAddr;

              setEmail(p =>
                p.length < emailAddr.length ? emailTxt : emailAddr
              );
            }}
            style={[
              styles.input,
              { backgroundColor: highlight, marginBottom: 20 },
            ]}
          />

          <RgText style={[styles.label, { color: labelColor }]}>
            Password
          </RgText>

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

          {(!!invalidDets || !!error) && (
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
          onPress={onSubmit}
          style={{
            height: 48,
            width: "100%",
            marginTop: 10,
            borderRadius: 6,
            alignItems: "center",
            position: "relative",
            justifyContent: "center",
            backgroundColor: isLoading ? "#577ccc" : mainColor,
          }}
        >
          <MdText
            style={{
              fontSize: 16,
              color: isLoading ? "#ccc" : "#fff",
            }}
          >
            Create account
          </MdText>

          {isLoading ? (
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
            marginTop: 20,
            backgroundColor: "transparent",
          }}
        >
          <MdText
            style={{
              fontSize: 12,
              lineHeight: 16,
              color: "#888",
            }}
          >
            You agree that by accessing this App, you are over the age of 13
            years and you have read, understood, and agreed to be bound by all
            of the associated Terms of Use.
          </MdText>
        </View>
      </>
    </SafeAreaAutoDismiss>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 34,
    paddingHorizontal: 20,
  },
  matricInput: {
    flex: 1,
    height: 30,
    fontSize: 16,
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
  label: {
    fontSize: 14,
    marginLeft: 6,
    marginBottom: 12,
    textTransform: "uppercase",
  },

  selectBtn: {
    height: 46,
    minWidth: 92,
    marginLeft: 12,
    borderRadius: 6,
    ...padding(0, 14),
    position: "relative",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  selectBtnTxt: {
    fontSize: 14.5,
  },
});
