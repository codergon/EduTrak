import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { View } from "../../../components/Themed";
import { BdText, MdText } from "../../../components/StyledText";
import MultipleChoice from "../AssignedTasks/components/MultipleChoice";
import { padding } from "../../../utils";
import FileUpload from "../AssignedTasks/components/FileUpload";
import ResponseInput from "../AssignedTasks/components/InputResponse";
import useColorScheme from "../../../hooks/useColorScheme";
import { answerOptions, Question } from "../../../types/study";

const QuestionBlock = ({
  isLast,
  question,
  onSelect,
  onTextUpdate,
  questionIndex,
}: {
  onSelect: any;
  isLast: boolean;
  onTextUpdate: any;
  question: Question;
  questionIndex: number;
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [response, setResponse] = useState("");
  const [selected, setSelected] = useState<any[]>([]);

  const handleOptions = (option: answerOptions[0]) => {
    if (selected.includes(option.id)) {
      setSelected(p => p.filter(c => c !== option.id));
    } else {
      setSelected(p =>
        question.responseType === "multiple-choice"
          ? [...p, option.id]
          : [option.id]
      );
    }

    onSelect(questionIndex, option.id);
  };

  useEffect(() => {
    question.answerOptions?.map(option => {
      if (option.selected) {
        setSelected(p => [...p, option.id]);
      }
    });
  }, []);

  useEffect(() => {
    onTextUpdate(response, questionIndex);
  }, [response]);

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
        <ResponseInput
          isLast={isLast}
          response={response}
          setResponse={setResponse}
          onTextUpdate={onTextUpdate}
        />
      ) : question.responseType === "multiple-choice" ||
        question.responseType === "options-select" ? (
        <MultipleChoice
          selected={selected}
          isLast={isLast}
          handleOptions={handleOptions}
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
