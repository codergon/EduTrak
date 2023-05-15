import Constants from "expo-constants";
import { StyleSheet, useColorScheme } from "react-native";
import * as Icon from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "../../../components/Themed";
import { useAppSelector } from "../../../hooks/storeHooks";

import { Quiz, QuizAnswer } from "../../../types/common";
import { db } from "../../../fb";
import { IndividualResponsesProps, QnAProps } from "../../../types/study";
import { MdText } from "../../../components/StyledText";
import { useNavigation } from "@react-navigation/native";
import { actionsConfig } from "../../../constants/Colors";
import { padding } from "../../../utils";
import dayjs from "dayjs";
import StudentCard from "./StudentCard";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import QuestionBlock from "./QuestionBlock";

const IndividualResponses = ({ route }: IndividualResponsesProps) => {
  const navigation = useNavigation();
  const statusBarHeight = Constants.statusBarHeight;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const arrowColor = !isDark ? "#000" : "#fff";
  const borderColor = isDark ? "#2d2d2d" : "#eee";

  const { taskInfo, quizAnswer } = route.params;

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

        {/* ================== */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5,
            marginTop: 8,
            // justifyContent: "space-between",
          }}
        >
          <MdText style={{ fontSize: 15, textTransform: "capitalize" }}>
            Responses by:{" "}
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
            {quizAnswer?.studentName || ""}
          </MdText>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <MdText style={{ fontSize: 15, textTransform: "capitalize" }}>
            Matric No:{" "}
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
            {quizAnswer?.studentMatricNo || ""}
          </MdText>
        </View>
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
        {quizAnswer.questions.length > 0 ? (
          quizAnswer.questions.map((question, index, arr) => {
            return (
              <QuestionBlock
                key={index}
                question={question}
                questionIndex={index}
                isLast={index === arr.length - 1}
              />
            );
          })
        ) : (
          <Loader pb={40} spinner={true} />
        )}
      </ScrollView>
    </View>
  );
};

export default IndividualResponses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    paddingBottom: 0,
    paddingHorizontal: 20,
    flexDirection: "column",
  },
});
