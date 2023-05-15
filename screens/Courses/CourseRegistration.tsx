import { View, Pressable } from "../../components/Themed";
import styles from "./styles";
import { useEffect, useState } from "react";
import useMenu from "../../hooks/useMenu";
import { MdText } from "../../components/StyledText";
import {
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { db } from "../../fb";
import uuid from "react-native-uuid";

import {
  collection,
  doc as docRef,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { Books, CaretDown, CircleWavyWarning } from "phosphor-react-native";
import { useAppSelector } from "../../hooks/storeHooks";

interface CourseRegistrationProps {
  registered: any[];
}

const CourseRegistration = ({ registered }: CourseRegistrationProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const invColor = isDark ? "#fff" : "#000";
  const inputBg = isDark ? "#282828" : "#f8f8f8";
  const borderColor = isDark ? "#282828" : "#f4f4f4";

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [courses, setCourses] = useState<any[]>([]);

  const { userData } = useAppSelector(state => state.user);

  useEffect(() => {
    const coursesRef = collection(db, "courses");
    const q = query(
      coursesRef,
      where("minLevel", "<=", Number(userData?.level)),
      where("departments", "array-contains", userData?.department.toUpperCase())
    );

    const unsub = onSnapshot(q, snapshot => {
      let courseList: any[] = [];
      snapshot.docs.forEach(doc => {
        courseList.push({ ...doc.data(), id: doc.id });
      });

      const filtered = courseList.filter(
        course => !!!registered.some(reg => reg.id === course.id)
      );

      setCourses(filtered);
    });

    return () => unsub();
  }, []);

  const [AppMenu, currentOption] = useMenu(
    null,
    [...courses],
    false,
    false,
    "name"
  );

  const registerCourse = async () => {
    if (!currentOption["name"]) {
      setErrorMsg("Please select a course");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      await setDoc(
        docRef(
          db,
          "registered_courses",
          `${userData?.uid}_${currentOption["id"]}`
        ),
        {
          studentId: userData?.uid,
          courseId: currentOption["id"],
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ ...styles.formContainer, zIndex: 2, marginBottom: 16 }}>
      <View style={styles.headerBar}>
        <MdText style={styles.headerBarTxt}>Register courses</MdText>
        <Books size={17} color={invColor} weight="regular" />
      </View>

      <AppMenu align="end" full>
        <Pressable
          style={{
            borderColor,
            ...styles.selectBtn,
            backgroundColor: inputBg,
            height: 40,
            width: "100%",
            marginLeft: 0,
          }}
        >
          <MdText
            style={[styles.selectBtnTxt, { color: invColor }]}
            numberOfLines={1}
          >
            {currentOption["name"]
              ? currentOption["name"] + " - " + currentOption["minLevel"]
              : "Select a course"}
          </MdText>

          {!currentOption["name"] && (
            <CaretDown
              size={12}
              color={invColor}
              weight="bold"
              style={{
                marginLeft: 6,
                marginTop: 2,
              }}
            />
          )}
        </Pressable>
      </AppMenu>

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
        onPress={registerCourse}
      >
        <MdText style={{ fontSize: 14, color: "#fff", paddingBottom: 1 }}>
          Register Course
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

export default CourseRegistration;
