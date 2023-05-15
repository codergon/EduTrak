import dayjs from "dayjs";
import { db } from "../../../fb";
import Constants from "expo-constants";
import StudentCard from "./StudentCard";
import { padding } from "../../../utils";
import * as Icon from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { QuizAnswer } from "../../../types/common";
import { ResponsesProps } from "../../../types/study";
import { MdText } from "../../../components/StyledText";
import { useNavigation } from "@react-navigation/native";
import { actionsConfig } from "../../../constants/Colors";
import { StyleSheet, useColorScheme } from "react-native";
import { useAppSelector } from "../../../hooks/storeHooks";
import EmptyState from "../../../components/common/EmptyState";
import { Pressable, ScrollView, View } from "../../../components/Themed";
import { query, where, collection, onSnapshot } from "firebase/firestore";

const ViewResponse = ({ route }: ResponsesProps) => {
  const navigation = useNavigation();
  const statusBarHeight = Constants.statusBarHeight;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const arrowColor = !isDark ? "#000" : "#fff";
  const borderColor = isDark ? "#2d2d2d" : "#eee";

  const { taskInfo } = route.params;
  const { userData } = useAppSelector(state => state.user);

  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);

  useEffect(() => {
    if (!userData?.uid || quizAnswers.length > 0) return;

    const q = query(
      collection(db, `answers`),
      where("quizId", "==", taskInfo?.id)
    );

    const unsub = onSnapshot(q, snapshot => {
      let ansList: QuizAnswer[] = [];
      snapshot.docs.forEach(doc => {
        // @ts-ignore
        ansList.push({ ...doc.data() });
      });

      setQuizAnswers(ansList);
    });

    return () => unsub();
  }, [userData?.uid]);

  const openResponse = (answerIndex: number) => {
    const answer = quizAnswers[answerIndex];

    navigation.navigate("Root", {
      screen: "Study",
      params: {
        screen: "IndividualResponses",
        params: {
          quizAnswer: answer,
          taskInfo,
        },
      },
    });
  };

  return (
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
            Description:{" "}
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
            {taskInfo?.courseName || ""}
          </MdText>
        </View>

        {taskInfo?.description && (
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
              {taskInfo?.description || "Untitled Task"}
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
                  dayjs(taskInfo?.dateDue.toDate()).diff() > 0 ? 2 : 1
                ]?.bg,
            }}
          >
            <MdText
              style={{
                fontSize: 13,
                textTransform: "uppercase",
                color:
                  actionsConfig[
                    dayjs(taskInfo?.dateDue.toDate()).diff() > 0 ? 2 : 1
                  ]?.col,
              }}
            >
              {dayjs(taskInfo?.dateDue.toDate()).format("MMM DD, HH:mm")}
            </MdText>
          </View>
        </View>

        <Pressable
          style={{
            width: "100%",
            ...padding(8, 12),
            marginBottom: 4,
            paddingBottom: 10,
            borderWidth: 1,
            marginTop: 10,
            borderRadius: 8,
            borderColor: isDark ? "#666" : "#eee",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.navigate("Modal", {
              data: taskInfo.questions,
            });
          }}
        >
          <MdText style={{ fontSize: 16.5, paddingBottom: 1 }}>
            View Questions
          </MdText>
        </Pressable>
      </View>

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
        {quizAnswers.length > 0 ? (
          quizAnswers?.map((answer, index) => {
            return (
              <>
                <StudentCard
                  key={index}
                  answerIndex={index}
                  studentName={answer.studentName}
                  studentMatricNo={answer.studentMatricNo}
                  openResponse={openResponse}
                />
              </>
            );
          })
        ) : (
          <EmptyState
            justifyContent="center"
            message={"No response recorded yet"}
            illustration="EmptyCourse"
          />
        )}
      </ScrollView>
    </View>
  );
};

export default ViewResponse;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    paddingBottom: 0,
    paddingHorizontal: 20,
    flexDirection: "column",
  },
});
