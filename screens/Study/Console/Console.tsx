import { useState } from "react";
import uuid from "react-native-uuid";
import CuratedList from "./CuratedList";
import { StyleSheet } from "react-native";
import InputBlock from "./components/InputBlock";
import { doc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import ConsoleTopbar from "./components/ConsoleTopbar";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { SafeAreaView, KeyboardAvoidingView } from "../../../components/Themed";
import { db } from "../../../fb";
import { roundMinutes } from "../../../utils";
import {
  updateActive,
  updateQuestions,
} from "../../../store/console/consoleSlice";

const AssignmentConsole = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [date, setDate] = useState(roundMinutes());
  const [errorMsg, setErrorMsg] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");

  const { userData } = useAppSelector(state => state.user);
  const { course, questions } = useAppSelector(state => state.console);

  const uploadTask = async () => {
    if (!course?.id) {
      setErrorMsg("Please select a course for the assignment");
      return;
    }

    if (description.trim().length < 3) {
      setErrorMsg("Please enter a course name with at least 3 characters");
      return;
    }

    setErrorMsg("");
    setUploading(true);

    const processedQues = questions.map((que: any) => {
      const { active, ...rest } = que;
      return rest;
    });

    const data = {
      description,
      courseId: course?.id,
      questions: processedQues,
      creatorId: userData?.uid,
      id: uuid.v4().toString(),
      courseName: course?.name,
      dateCreated: serverTimestamp(),
      lecturerName: userData?.userName,
      dateDue: Timestamp.fromDate(date),
      departments: course?.departments,
    };

    try {
      await setDoc(doc(db, "quizzes", `${userData?.uid}_${data?.id}`), data);
      dispatch(
        updateActive({
          answer: "",
          active: true,
          question: "",
          id: uuid.v4().toString(),
          responseType: processedQues[processedQues.length - 1].responseType,
        })
      );
      dispatch(updateQuestions([]));
      navigation.goBack();
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <KeyboardAvoidingView style={styles.flex}>
        <ConsoleTopbar
          date={date}
          setDate={setDate}
          errorMsg={errorMsg}
          description={description}
          setDescription={setDescription}
        />

        <CuratedList
          uploading={uploading}
          inputVal={inputVal}
          uploadTask={uploadTask}
          setInputVal={setInputVal}
        />

        <InputBlock inputVal={inputVal} setInputVal={setInputVal} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingTop: 26,
    display: "flex",
    position: "relative",
    flexDirection: "column",
  },
});

export default AssignmentConsole;
