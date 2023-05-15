import { View, TextInput, Pressable } from "../../components/Themed";
import styles from "./styles";
import { useState } from "react";
import useMenu from "../../hooks/useMenu";
import { MdText } from "../../components/StyledText";
import {
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import {
  Books,
  CaretDown,
  CircleWavyWarning,
  ListPlus,
} from "phosphor-react-native";
import { useAppSelector } from "../../hooks/storeHooks";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../fb";
import uuid from "react-native-uuid";

type courseData = {
  name: string;
  dept: string;
  desc: string;
  minLevel: string;
  onSuccess: () => void;
};

const CourseForm = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const invColor = isDark ? "#fff" : "#000";
  const inputBg = isDark ? "#282828" : "#f8f8f8";
  const placeholderColor = isDark ? "#ccc" : "#888";
  const borderColor = isDark ? "#282828" : "#f4f4f4";

  const { userData } = useAppSelector(state => state.user);

  const [name, setName] = useState("");
  const [dept, setDept] = useState("");
  const [desc, setDesc] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [AppMenu, currentOption] = useMenu(
    "",
    ["100", "200", "300", "400", "500"],
    false,
    false
  );

  const ResetInputs = () => {
    setName("");
    setDept("");
    setDesc("");
  };

  const createCourse = async ({
    name,
    dept,
    desc,
    minLevel,
    onSuccess,
  }: courseData) => {
    if (name.trim().length < 3) {
      setErrorMsg("Please enter a course name with at least 3 characters");
      return;
    }

    if (minLevel === "") {
      setErrorMsg("Please select a minimum level");
      return;
    }

    if (dept === "") {
      setErrorMsg("Please enter a department");
      return;
    }

    // Check if all departments are of length 3
    const depts = dept.split(",").map((item: string) => item.trim());
    const invalidDept = depts.find(item => item.length !== 3);
    if (invalidDept) {
      setErrorMsg("All departments must be 3 characters long");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    const id = uuid.v4().toString();
    const data = {
      id,
      name,
      description: desc,
      departments: depts,
      creatorId: userData?.uid,
      minLevel: Number(minLevel),
      dateCreated: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, "courses", id), data);
      onSuccess();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ ...styles.formContainer, zIndex: 2 }}>
      <View style={styles.headerBar}>
        <MdText style={styles.headerBarTxt}>Design a course</MdText>
        {/* <MdText style={styles.headerBarTxt}>Design a course</MdText> */}

        <ListPlus size={17} color={invColor} weight="regular" />
      </View>

      {[
        {
          value: name,
          setValue: setName,
          placeholder: "Course Name *",
        },
        {
          value: desc,
          setValue: setDesc,
          placeholder: "Course Description",
        },
      ].map((item, index) => {
        return (
          <View
            key={index}
            style={[
              styles.inputContainer,
              {
                borderColor,
                backgroundColor: inputBg,
              },
            ]}
          >
            <TextInput
              value={item.value}
              textAlignVertical="top"
              style={[{ ...styles.input, color: invColor }]}
              placeholder={item.placeholder}
              placeholderTextColor={placeholderColor}
              onChange={e => item.setValue(e.nativeEvent.text)}
            />
          </View>
        );
      })}

      <View style={styles.formRow}>
        <View
          style={[
            styles.inputContainer,
            {
              flex: 1,
              borderColor,
              marginBottom: 0,
              backgroundColor: inputBg,
            },
          ]}
        >
          <TextInput
            value={dept}
            textAlignVertical="top"
            placeholderTextColor={placeholderColor}
            onChange={e => {
              const text = e.nativeEvent.text;

              const tx = text.split(",");
              const lStr = tx[tx.length - 1].trim();
              if (lStr.length <= 3) {
                setDept(text.toUpperCase());
              } else {
                //
                const lst = tx.pop();
                const newTx = tx.join(",");
                let words = (lst?.trim()?.match(/.{1,3}/g) || []).join(", ");
                setDept(((newTx ? newTx + ", " : "") + words).toUpperCase());
              }
            }}
            placeholder="Departments eg 'EEG, CEE' *"
            style={[
              {
                ...styles.input,
                color: invColor,
                textTransform: "uppercase",
              },
            ]}
          />
        </View>

        <AppMenu align="end">
          <Pressable
            style={{
              borderColor,
              ...styles.selectBtn,
              backgroundColor: inputBg,
            }}
          >
            <MdText style={[styles.selectBtnTxt, { color: invColor }]}>
              {currentOption ? currentOption + " Lvl" : "Min Level"}
            </MdText>
            {!currentOption && (
              <CaretDown
                size={12}
                color={invColor}
                weight="bold"
                style={{
                  marginLeft: 4,
                }}
              />
            )}
          </Pressable>
        </AppMenu>
      </View>

      {errorMsg && (
        <View style={styles.errorCont}>
          <CircleWavyWarning
            size={14.4}
            weight="bold"
            color="#e84f3e"
            style={{ marginRight: 4, marginTop: 1 }}
          />
          <MdText
            style={{
              fontSize: 12.8,
              color: "#e54837",
            }}
          >
            {errorMsg}
          </MdText>
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.createBtn,
          {
            backgroundColor: isLoading ? "#577ccc" : "#2560ba",
          },
        ]}
        onPress={() =>
          createCourse({
            name,
            dept,
            desc,
            minLevel: currentOption,
            onSuccess: ResetInputs,
          })
        }
      >
        <MdText style={{ fontSize: 14, color: "#fff", paddingBottom: 1 }}>
          Create New Course
        </MdText>
        {isLoading && (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={{ position: "absolute", right: 20 }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CourseForm;
