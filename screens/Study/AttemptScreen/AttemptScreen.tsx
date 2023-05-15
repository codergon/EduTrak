import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { padding } from "../../../utils";
import Constants from "expo-constants";
import QuestionBlock from "./QuestionBlock";
import { QnAProps } from "../../../types/study";
import * as Icon from "phosphor-react-native";
import { MdText } from "../../../components/StyledText";
import { ActivityIndicator, StyleSheet, useColorScheme } from "react-native";
import { Pressable, ScrollView, View } from "../../../components/Themed";

import { actionsConfig } from "../../../constants/Colors";
import { StackActions, useNavigation } from "@react-navigation/native";

import { db } from "../../../fb";
import uuid from "react-native-uuid";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { QuizAttempt } from "../../../types/study";
import { useAppSelector } from "../../../hooks/storeHooks";

const AttemptScreen = ({ route }: QnAProps) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const statusBarHeight = Constants.statusBarHeight;
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#eee" : "#000";
  const arrowColor = !isDark ? "#000" : "#fff";
  const borderColor = isDark ? "#2d2d2d" : "#eee";

  const { taskInfo } = route.params;
  const { userData } = useAppSelector(state => state.user);

  const [errorMsg, setErrorMsg] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizAttempt>(null);

  const fetchUserAnswers = async () => {
    const q = query(
      collection(db, `answers`),
      where("studentId", "==", userData?.uid),
      where("courseId", "==", taskInfo?.courseId),
      where("quizId", "==", taskInfo?.id)
    );

    const snapShot = await getDocs(q);

    const answerList: QuizAttempt[] = [];
    snapShot.forEach(doc => {
      // @ts-ignore
      answerList.push({ ...doc.data() });
    });

    if (answerList.length > 0) {
      setQuiz(answerList[0]);
      setIsUpdate(true);
    } else {
      setQuiz(taskInfo);
    }
  };

  useEffect(() => {
    if (!userData?.uid || (quiz?.questions.length || 0) > 0) return;

    fetchUserAnswers();
  }, [userData?.uid]);

  const onSelect = (questionIndex: number, optId: string) => {
    // @ts-ignore
    setQuiz(p => {
      const newQ = p?.questions.map((q, index) => {
        if (index === questionIndex) {
          return {
            ...q,
            answerOptions: q.answerOptions?.map(opts => {
              return {
                ...opts,
                selected: opts.id === optId ? !opts.selected : !!opts.selected,
              };
            }),
          };
        }

        return q;
      });

      return {
        ...p,
        questions: newQ,
      };
    });
  };

  const onTextUpdate = (text: string, questionIndex: number) => {
    // @ts-ignore
    setQuiz(p => {
      const newQ = p?.questions.map((q, index) => {
        if (index === questionIndex) {
          return {
            ...q,
            response: text,
          };
        }

        return q;
      });

      return {
        ...p,
        questions: newQ,
      };
    });
  };

  const checkAnswered = () => {
    for (let ind = 0; ind < (quiz?.questions?.length || 0); ind++) {
      if (
        quiz?.questions[ind].responseType === "text-input" &&
        !quiz.questions[ind].response
      ) {
        return true;
      }

      const seletedOpts =
        quiz?.questions[ind].answerOptions?.filter(opt => !!opt.selected) || [];

      if (
        (quiz?.questions[ind].responseType === "options-select" ||
          quiz?.questions[ind].responseType === "multiple-choice") &&
        seletedOpts.length === 0
      ) {
        return true;
      }
    }

    return false;
  };

  const submitAnswers = async () => {
    if (isLoading) return;

    let notAnswered = false;

    notAnswered = checkAnswered();

    if (notAnswered) {
      setErrorMsg("Please answer all questions");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      // await setDoc(doc(db, "answers", uuid.v4().toString()), {
      await setDoc(doc(db, "answers", `${quiz?.id}_${userData?.uid}`), {
        ...quiz,
        quizId: quiz?.id,
        studentId: userData?.uid,
        studentName: userData?.userName,
        studentMatricNo: userData?.matricNo,
      });

      navigation.dispatch(StackActions.pop(1));
    } catch (err) {
      // @ts-ignore
      setErrorMsg(err.message || "An error occured");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View style={[styles.container, { paddingTop: statusBarHeight + 18 }]}>
        <View
          style={[
            {
              paddingBottom: 12,
              flexDirection: "column",
            },
            { borderBottomWidth: 1.1, borderColor },
          ]}
        >
          <Pressable
            style={{
              paddingTop: 4,
              marginBottom: 4,
              paddingBottom: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => navigation.goBack()}
          >
            <View style={{ marginRight: 8 }}>
              <Icon.CaretLeft size={17} weight="bold" color={arrowColor} />
            </View>

            <MdText style={{ fontSize: 16.5, paddingBottom: 1 }}>Back</MdText>
          </Pressable>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
              // justifyContent: "space-between",
            }}
          >
            <MdText style={{ fontSize: 15, textTransform: "capitalize" }}>
              Course:{" "}
            </MdText>
            <MdText
              lightColor="#777"
              darkColor="#aaa"
              style={{
                fontSize: 15,
                marginLeft: 6,
                textTransform: "capitalize",
              }}
            >
              {quiz?.courseName || ""}
            </MdText>
          </View>

          {quiz?.lecturerName && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 5,
                // justifyContent: "space-between",
              }}
            >
              <MdText style={{ fontSize: 15, textTransform: "capitalize" }}>
                Lecturer:{" "}
              </MdText>
              <MdText
                lightColor="#777"
                darkColor="#aaa"
                style={{
                  fontSize: 15,
                  marginLeft: 6,
                  textTransform: "capitalize",
                }}
              >
                {quiz?.lecturerName || "Untitled Task"}
              </MdText>
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
              // justifyContent: "space-between",
            }}
          >
            <MdText
              style={{
                fontSize: 15,
                textTransform: "capitalize",
              }}
            >
              Due On:{" "}
            </MdText>
            <View
              style={{
                ...padding(4, 8),
                borderRadius: 4,
                marginLeft: 6,
                backgroundColor:
                  actionsConfig[
                    dayjs(quiz?.dateDue.toDate()).diff() > 0 ? 2 : 1
                  ]?.bg,
              }}
            >
              <MdText
                style={{
                  fontSize: 13,
                  textTransform: "uppercase",
                  color:
                    actionsConfig[
                      dayjs(quiz?.dateDue.toDate()).diff() > 0 ? 2 : 1
                    ]?.col,
                }}
              >
                {dayjs(quiz?.dateDue.toDate()).format("MMM DD, HH:mm")}
              </MdText>
            </View>
          </View>

          {isUpdate && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 5,
                marginTop: 10,
              }}
            >
              <View
                style={{
                  ...padding(4, 8),
                  borderRadius: 4,
                  marginLeft: 6,
                  backgroundColor: actionsConfig[3]?.bg,
                }}
              >
                <MdText
                  style={{
                    fontSize: 13,
                    textTransform: "uppercase",
                    color: actionsConfig[3]?.col,
                  }}
                >
                  You have attempted this quiz
                </MdText>
              </View>
            </View>
          )}
        </View>

        {/*  */}

        <ScrollView
          bounces={false}
          style={{ marginTop: 10 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 1,
            paddingBottom: 30,
          }}
        >
          {quiz?.questions.map((question, index, arr) => {
            return (
              <QuestionBlock
                key={index}
                onSelect={onSelect}
                question={question}
                questionIndex={index}
                onTextUpdate={onTextUpdate}
                isLast={index === arr.length - 1}
              />
            );
          })}

          {errorMsg && (
            <View
              style={{
                marginBottom: 14,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "transparent",
              }}
            >
              <Icon.CircleWavyWarning
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

          <Pressable
            style={[
              styles.submitBtn,
              {
                backgroundColor:
                  isLoading || dayjs(quiz?.dateDue.toDate()).diff() <= 0
                    ? "#577ccc"
                    : "#2560ba",
              },
            ]}
            onPress={
              dayjs(quiz?.dateDue.toDate()).diff() > 0
                ? submitAnswers
                : // : submitAnswers
                  () => setErrorMsg("Submission for this quiz has ended")
            }
          >
            <MdText
              style={[
                styles.submitBtnText,
                {
                  color: "#fff",
                },
              ]}
            >
              {isUpdate ? "UPDATE" : "SUBMIT"} ANSWERS
            </MdText>

            {isLoading && (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ position: "absolute", right: 20 }}
              />
            )}
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
};

export default AttemptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    paddingBottom: 0,
    paddingHorizontal: 20,
    flexDirection: "column",
  },

  submitBtn: {
    borderRadius: 8,
    ...padding(15, 20),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  submitBtnText: {
    fontSize: 14,
    marginHorizontal: 7,
  },
  submitBtnIcon: {
    marginTop: 1,
  },
});
