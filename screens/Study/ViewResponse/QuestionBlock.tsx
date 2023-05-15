import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { View } from "../../../components/Themed";
import { BdText, MdText } from "../../../components/StyledText";

import { padding } from "../../../utils";
import FileUpload from "./components/FileUpload";
import ResponseInput from "./components/InputResponse";
import MultipleChoice from "./components/MultipleChoice";
import useColorScheme from "../../../hooks/useColorScheme";
import { answerOptions, Question } from "../../../types/study";

const QuestionBlock = ({
  isLast,
  question,
  questionIndex,
}: {
  isLast: boolean;
  question: Question;
  questionIndex: number;
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [response, setResponse] = useState("");
  const [selected, setSelected] = useState<any[]>([]);

  useEffect(() => {
    question.answerOptions?.map(option => {
      if (option.selected) {
        setSelected(p => [...p, option.id]);
      }
    });
  }, []);

  return (
    <View
      style={{
        ...styles.qBlock,
        width: "100%",
        borderWidth: 1,
        ...padding(15),
        borderRadius: 8,
        borderColor: isDark ? "#444" : "#e3e3e3",
      }}
      lightColor="#fcfcfc"
      darkColor="#1a1a1a"
    >
      <View style={{ ...styles.qHeader }}>
        <MdText style={{ ...styles.qHeaderTxt }}>
          Question {questionIndex + 1}
        </MdText>
      </View>

      <MdText style={{ ...styles.qText, paddingLeft: 4 }} darkColor="#ddd">
        {question.question}
      </MdText>

      {question.responseType === "text-input" ? (
        <ResponseInput isLast={isLast} response={response} />
      ) : question.responseType === "multiple-choice" ||
        question.responseType === "options-select" ? (
        <MultipleChoice
          isLast={isLast}
          selected={selected}
          options={question.answerOptions || []}
        />
      ) : (
        <FileUpload isLast={isLast} />
      )}
    </View>
  );
};

export default QuestionBlock;

const styles = StyleSheet.create({
  qBlock: {
    width: "100%",
    borderRadius: 18,
    marginBottom: 16,
  },
  qHeader: {
    flexGrow: 0,
    borderRadius: 10,
    marginBottom: 14,
    backgroundColor: "transparent",
  },
  qHeaderTxt: {
    fontSize: 20,
  },
  qText: {
    fontSize: 15,
    marginBottom: 20,
  },
});
