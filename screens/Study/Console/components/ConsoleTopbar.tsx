import DateTime from "./DateTime";
import { db } from "../../../../fb";
import { useEffect, useState } from "react";
import { padding } from "../../../../utils";
import useMenu from "../../../../hooks/useMenu";
import { View } from "../../../../components/Themed";
import { MdText } from "../../../../components/StyledText";
import useColorScheme from "../../../../hooks/useColorScheme";
import BackButton from "../../../../components/common/BackButton";
import { CaretDown, CircleWavyWarning } from "phosphor-react-native";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHooks";
import {
  toggleInput,
  toggleIsEmpty,
  updateCourse,
  updateFetchStatus,
} from "../../../../store/console/consoleSlice";

interface ConsoleTopbarProps {
  date: Date;
  setDate: any;
  errorMsg: string;
  description: string;
  setDescription: (text: string) => void;
}

const ConsoleTopbar = ({
  date,
  setDate,
  errorMsg,
  description,
  setDescription,
}: ConsoleTopbarProps) => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const invColor = isDark ? "#fff" : "#000";
  const borderColor = isDark ? "#333" : "#ddd";
  const highlight = isDark ? "#333" : "#f1f1f1";
  const highlightIcon = isDark ? "#fff" : "#000";
  const inputBg = isDark ? "#2b2b2b" : "#f2f2f2";
  const placeholderColor = isDark ? "#aaa" : "#808080";

  const [courses, setCourses] = useState<any[]>([]);
  const { userData } = useAppSelector(state => state.user);
  const { isEmptyCourses } = useAppSelector(state => state.console);

  useEffect(() => {
    if (!userData?.uid || courses.length > 0) return;

    const coursesRef = collection(db, "courses");
    const q = query(coursesRef, where("creatorId", "==", userData?.uid));

    const unsub = onSnapshot(q, snapshot => {
      let courseList: any[] = [];
      snapshot.docs.forEach(doc => {
        courseList.push({ ...doc.data(), id: doc.id });
      });
      dispatch(toggleIsEmpty(courseList.length === 0));
      setCourses(courseList);
      dispatch(updateFetchStatus(false));
    });

    return () => unsub();
  }, [userData?.uid]);

  const [SelectCourse, course] = useMenu(
    null,
    [...courses],
    false,
    false,
    "name"
  );

  useEffect(() => {
    if (!course?.id) return;
    dispatch(updateCourse(course));
  }, [course]);

  return (
    <View style={[styles.topbar, { borderColor }]}>
      <View style={styles.topbarHeader}>
        <View
          style={{
            display: "flex",
            marginBottom: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BackButton />
          <MdText style={{ fontSize: 24, marginLeft: 6 }}>Console</MdText>
        </View>

        <TextInput
          value={description}
          textAlignVertical="top"
          editable={!isEmptyCourses}
          enablesReturnKeyAutomatically
          placeholder="Quiz description"
          placeholderTextColor={placeholderColor}
          onBlur={() => {
            setTimeout(() => {
              dispatch(toggleInput(true));
            }, 200);
          }}
          onFocus={() => dispatch(toggleInput(false))}
          onChange={e => setDescription(e.nativeEvent.text)}
          style={{
            width: "100%",
            fontSize: 15,
            height: 41,
            color: invColor,
            borderRadius: 8,
            ...padding(12, 14),
            fontFamily: "general-md",
            backgroundColor: inputBg,
          }}
        />
      </View>

      <View
        style={{
          marginBottom: 16,
          flexDirection: "column",
        }}
      >
        <View style={{ zIndex: 2 }}>
          <SelectCourse multiline full align="start">
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                ...styles.courseCodeSelect,
                backgroundColor: highlight,
              }}
            >
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: "transparent",
                }}
              >
                <MdText
                  style={{
                    fontSize: 15,
                    paddingTop: 1,
                    // textTransform: "uppercase",
                  }}
                  numberOfLines={1}
                >
                  {course["name"]
                    ? course["name"] + " - " + course["minLevel"]
                    : "Please select a course"}
                </MdText>
              </View>

              <View
                style={{
                  flex: 0,
                  marginLeft: 6,
                  backgroundColor: "transparent",
                }}
              >
                <CaretDown
                  size={12}
                  weight="fill"
                  color={highlightIcon}
                  style={{ marginLeft: 6 }}
                />
              </View>
            </TouchableOpacity>
          </SelectCourse>
        </View>

        {!isEmptyCourses && <DateTime date={date} setDate={setDate} />}

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
      </View>
    </View>
  );
};

export default ConsoleTopbar;

const styles = StyleSheet.create({
  topbar: {
    zIndex: 3,
    width: "100%",
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    flexDirection: "column",
  },
  topbarHeader: {
    display: "flex",
    marginBottom: 14,
    flexDirection: "column",
  },
  courseCodeSelect: {
    height: 40,
    width: "100%",
    borderRadius: 8,
    ...padding(0, 10, 0, 12),
    position: "relative",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  defaultBtn: {
    width: 30,
    height: "100%",
    marginLeft: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  errorCont: {
    marginTop: 8,
    paddingTop: 6,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    backgroundColor: "transparent",
  },
});
