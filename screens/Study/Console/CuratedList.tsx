import { View, TextInput, ScrollView } from "../../../components/Themed";
import {
  Trash,
  Checks,
  CaretDown,
  CaretRight,
  PencilSimple,
  CircleWavyWarning,
} from "phosphor-react-native";
import {
  toggleInput,
  updateActive,
  updateQuestions,
} from "../../../store/console/consoleSlice";
import { useState } from "react";
import uuid from "react-native-uuid";
import { padding } from "../../../utils";
import useMenu from "../../../hooks/useMenu";
import { MdText } from "../../../components/StyledText";
import MultipleChoice from "./components/MultipleChoice";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Question, answerOptions } from "../../../types/study";
import EmptyState from "../../../components/common/EmptyState";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { StackActions, useNavigation } from "@react-navigation/native";
import Loader from "../../../components/common/Loader";

interface CuratedListProps {
  uploadTask: () => void;
  inputVal: string;
  uploading: boolean;
  setInputVal: (val: string) => void;
}

const CuratedList = ({
  uploadTask,
  inputVal,
  uploading,
  setInputVal,
}: CuratedListProps) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const invColor = isDark ? "#fff" : "#000";
  const borderColor = isDark ? "#666" : "#ddd";
  const borderColor2 = isDark ? "#444" : "#e3e3e3";

  const { questions, activeQuestion, isEmptyCourses, isFetchingCourses } =
    useAppSelector(state => state.console);

  const [editing, setEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [optionsInput, setOptionsInput] = useState("");
  const [optionsArr, setOptionsArr] = useState<answerOptions>([]);
  const [AnsweOptions, responseType, _, updateMenuOption] = useMenu(
    "",
    ["text-input", "options-select", "file-upload", "multiple-choice"],
    false,
    false
  );

  const addQuestion = (action?: string) => {
    if (action === "newQuetion") {
      const newQuestions = questions?.map(que => {
        return { ...que, active: false };
      });

      dispatch(updateQuestions(newQuestions));

      setInputVal("");
      setOptionsArr([]);
      setErrorMsg("");
      setEditing(false);

      dispatch(
        updateActive({
          responseType,
          answer: "",
          active: true,
          question: "",
          id: uuid.v4().toString(),
        })
      );

      setEditing(false);
      return;
    }

    const selectType =
      responseType === "options-select" || responseType === "multiple-choice";

    if (!responseType) {
      setErrorMsg("No Response type selected");
      return;
    }

    if (!inputVal) {
      setErrorMsg("No question entered");
      return;
    }

    if (selectType && optionsArr.length < 2) {
      setErrorMsg("At least two options are required");
      return;
    }

    if (selectType && !optionsArr?.find(opt => opt.isCorrect)) {
      setErrorMsg("No correct answer selected");
      return;
    }

    const newQuestions = editing
      ? questions?.map(que => {
          if (que.id === activeQuestion?.id) {
            return {
              ...que,
              responseType,
              active: false,
              question: inputVal,
              answerOptions: optionsArr,
            };
          }
          return { ...que, active: false };
        })
      : [
          ...questions,
          {
            id: activeQuestion?.id || uuid.v4().toString(),
            responseType,
            question: inputVal,
            answerOptions: optionsArr,
            active: true,
          },
        ];

    dispatch(updateQuestions(newQuestions));

    setInputVal("");
    setOptionsArr([]);
    setErrorMsg("");
    setEditing(false);

    dispatch(
      updateActive({
        responseType,
        answer: "",
        active: true,
        question: "",
        id: uuid.v4().toString(),
      })
    );
  };

  const handleQuestions = (question: Question, action = "edit") => {
    if (action === "delete") {
      const newQuestions = questions?.filter(q => {
        return q.id !== question.id;
      });
      dispatch(updateQuestions(newQuestions));
    } else if (action === "edit") {
      setEditing(true);
      dispatch(updateActive({ ...question, active: true }));
      setInputVal(question.question);
      setOptionsArr(question.answerOptions || []);
      updateMenuOption(question.responseType);
    }
  };

  const addOption = () => {
    if (!optionsInput) return;
    setOptionsArr(prev => [
      ...prev,
      { id: uuid.v4().toString(), value: optionsInput, isCorrect: false },
    ]);
    setOptionsInput("");
  };

  const handleOptions = (options: answerOptions[0], action?: string) => {
    if (action === "delete") {
      setOptionsArr(prev =>
        prev?.filter(opt => {
          return opt.id !== options.id;
        })
      );
    } else {
      setOptionsArr(prev =>
        prev?.map(opt => {
          return {
            ...opt,
            isCorrect:
              responseType === "options-select"
                ? opt.id === options.id
                : opt.id === options.id
                ? !opt.isCorrect
                : opt.isCorrect,
          };
        })
      );
    }
  };

  return (
    <ScrollView
      bounces={false}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, {}]}
    >
      {isFetchingCourses ? (
        <Loader pb={80} spinner={true} />
      ) : activeQuestion ? (
        <>
          <View
            style={{
              zIndex: 2,
              padding: 14,
              width: "100%",
              borderWidth: 1,
              borderRadius: 8,
              flexDirection: "column",
              borderColor: isDark ? "#444" : "#e3e3e3",
            }}
            lightColor="#fcfcfc"
            darkColor="#1a1a1a"
          >
            <View style={{ marginBottom: 10, backgroundColor: "transparent" }}>
              <MdText
                style={{
                  fontSize: 19,
                  color: isDark ? "#f1f1f1" : "#555",
                }}
              >
                Description
              </MdText>
            </View>

            <ScrollView
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              contentContainerStyle={[
                { display: "flex", flexDirection: "column" },
              ]}
              style={{
                minHeight: 1.4 * 14 * 1.5,
                maxHeight: 1.4 * 14 * 5,
                backgroundColor: "transparent",
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: "100%",
                  flexDirection: "column",
                  backgroundColor: "transparent",
                }}
              >
                <MdText
                  style={{
                    fontSize: 14,
                    color: !(inputVal || activeQuestion?.question)
                      ? "#888"
                      : isDark
                      ? "#ccc"
                      : "#333",
                    paddingHorizontal: 2,
                    lineHeight: 1.4 * 15,
                    backgroundColor: "transparent",
                  }}
                >
                  {inputVal ||
                    activeQuestion?.question ||
                    "Your question will appear here as you type..."}
                </MdText>
              </View>
            </ScrollView>

            {(responseType === "options-select" ||
              responseType === "multiple-choice") && (
              <View
                style={{
                  marginTop: 2,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  flexDirection: "column",
                  borderColor: "#e3e3e3",
                  backgroundColor: "transparent",
                }}
              >
                <View
                  style={{
                    marginBottom: 14,
                    flexDirection: "row",
                    backgroundColor: "transparent",
                  }}
                >
                  <View
                    style={[
                      {
                        flex: 1,
                        borderRadius: 8,
                        overflow: "hidden",
                        alignItems: "center",
                        flexDirection: "row",
                        ...padding(2, 10, 0),
                        backgroundColor: isDark ? "#2b2b2b" : "#f2f2f2",
                      },
                    ]}
                  >
                    <TextInput
                      multiline
                      value={optionsInput}
                      textAlignVertical="top"
                      enablesReturnKeyAutomatically
                      placeholder="Add options here"
                      placeholderTextColor={"#808080"}
                      onBlur={() => dispatch(toggleInput(true))}
                      onFocus={() => dispatch(toggleInput(false))}
                      onChange={e => setOptionsInput(e.nativeEvent.text)}
                      style={[
                        {
                          flex: 1,
                          fontSize: 15,
                          color: invColor,
                          ...padding(8, 0),
                          fontFamily: "general-md",
                        },
                      ]}
                    />
                  </View>

                  <TouchableOpacity
                    style={{
                      height: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "transparent",
                    }}
                    onPress={() => addOption()}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        marginLeft: 10,
                        borderRadius: 20,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#2967c4",
                      }}
                    >
                      <Checks
                        size={17}
                        weight="bold"
                        color={isDark ? "#000" : "#fff"}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                {optionsArr?.length > 0 && (
                  <>
                    <MdText
                      style={{
                        fontSize: 16,
                        color: isDark ? "#aaa" : "#444",
                        paddingLeft: 5,
                        marginBottom: 16,
                      }}
                    >
                      Select the correct answer(s)
                    </MdText>

                    <MultipleChoice
                      isLast={true}
                      options={optionsArr}
                      handleOptions={handleOptions}
                    />
                  </>
                )}
              </View>
            )}

            <View
              style={{
                zIndex: 2,
                marginTop: 8,
                paddingTop: 14,
                borderTopWidth: 1,
                flexDirection: "row",
                alignItems: "center",
                borderColor: borderColor2,
                backgroundColor: "transparent",
                justifyContent: "space-between",
              }}
            >
              <AnsweOptions align="start" direction="bottom">
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={[
                    styles.actionBtn,
                    {
                      minWidth: 130,
                      position: "relative",
                      justifyContent: "center",
                      backgroundColor: "transparent",
                      borderColor: isDark ? "#3477db" : "#2967c4",
                    },
                  ]}
                >
                  <MdText
                    style={{
                      fontSize: 12,
                      paddingBottom: 1,
                      textTransform: "capitalize",
                      backgroundColor: "transparent",
                      color: isDark ? "#3477db" : "#2967c4",
                    }}
                  >
                    {responseType.replace("-", " ") || "Response type"}
                  </MdText>

                  <View
                    style={{
                      paddingTop: 1,
                      marginLeft: 6,
                      backgroundColor: "transparent",
                    }}
                  >
                    <CaretDown
                      size={11}
                      weight="bold"
                      color={isDark ? "#3477db" : "#2967c4"}
                    />
                  </View>
                </TouchableOpacity>
              </AnsweOptions>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
              >
                {[
                  {
                    text: (editing ? "Update" : "Create") + " Question",
                    check: true,
                    onPress: null,
                    bg: "#E5EBF7",
                    col: "#245AB0",
                  },
                  {
                    text: "Clear",
                    onPress: null,
                    bg: "#F8ECE7",
                    col: "#C66633",
                  },
                ].map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.5}
                      style={[
                        styles.actionBtn,
                        {
                          marginLeft: 10,
                          marginRight: 0,
                          borderColor: "#ddd",
                          backgroundColor: item.bg,
                        },
                      ]}
                      onPress={() => {
                        addQuestion(item?.text === "Clear" ? "newQuetion" : "");
                      }}
                    >
                      <MdText
                        style={{
                          fontSize: 12,
                          color: item.col,
                          paddingBottom: 1,
                        }}
                      >
                        {item.text}
                      </MdText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {errorMsg && (
              <View
                style={{
                  marginTop: 8,
                  paddingTop: 6,
                  paddingLeft: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
              >
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
          {questions?.length > 0 && (
            <View
              style={{
                marginTop: 20,
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  marginBottom: 10,
                  ...padding(8, 0),
                  borderBottomWidth: 1,
                  flexDirection: "row",
                  borderColor: borderColor,
                }}
              >
                <MdText
                  style={{
                    fontSize: 17,
                  }}
                >
                  Curated Questions
                </MdText>
              </View>

              {questions?.map((question, index) => {
                return (
                  !(editing && activeQuestion?.id === question?.id) && (
                    <View
                      key={index}
                      style={{
                        borderWidth: 1,
                        borderRadius: 8,
                        marginBottom: 16,
                        ...padding(12, 16, 14),
                        flexDirection: "column",
                        borderColor: isDark ? "#444" : "#e3e3e3",
                        backgroundColor: isDark ? "#1a1a1a" : "#fafafa",
                      }}
                    >
                      <View
                        style={{
                          marginBottom: 12,
                          flexDirection: "column",
                          backgroundColor: "transparent",
                        }}
                      >
                        <MdText
                          style={{
                            fontSize: 13,
                            paddingTop: 2,
                            marginBottom: 4,
                            lineHeight: 13 * 1.3,
                            textTransform: "uppercase",
                          }}
                        >
                          Question
                        </MdText>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            backgroundColor: "transparent",
                          }}
                        >
                          <MdText style={{ color: "#777" }}>
                            {question?.question}
                          </MdText>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          backgroundColor: "transparent",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "column",
                            backgroundColor: "transparent",
                          }}
                        >
                          <MdText
                            style={{
                              fontSize: 13,
                              paddingTop: 2,
                              marginBottom: 3,
                              lineHeight: 13 * 1.3,
                              textTransform: "uppercase",
                            }}
                          >
                            Response Type
                          </MdText>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              backgroundColor: "transparent",
                            }}
                          >
                            <MdText
                              style={{
                                color: "#777",
                                textTransform: "capitalize",
                              }}
                            >
                              {question?.responseType?.replace("-", " ")}
                            </MdText>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            backgroundColor: "transparent",
                          }}
                        >
                          {[{ type: "edit" }, { type: "delete" }]?.map(
                            (item, index) => {
                              return (
                                <TouchableOpacity
                                  key={index}
                                  activeOpacity={0.5}
                                  style={[
                                    {
                                      width: 32,
                                      height: 32,
                                      marginLeft: 10,
                                      borderWidth: 0.8,
                                      borderRadius: 30,
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderColor: isDark ? "#555" : "#d1d1d1",
                                      backgroundColor: isDark
                                        ? "#222"
                                        : "#eeee",
                                    },
                                  ]}
                                  onPress={() =>
                                    handleQuestions(question, item.type)
                                  }
                                >
                                  {item?.type === "delete" ? (
                                    <Trash
                                      size={16}
                                      weight="bold"
                                      color={isDark ? "#aaa" : "#666"}
                                    />
                                  ) : (
                                    <PencilSimple
                                      size={16}
                                      weight="bold"
                                      color={isDark ? "#aaa" : "#666"}
                                    />
                                  )}
                                </TouchableOpacity>
                              );
                            }
                          )}
                        </View>
                      </View>
                    </View>
                  )
                );
              })}

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.submitBtn,
                  {
                    backgroundColor: uploading ? "#577ccc" : "#2b6cce",
                  },
                ]}
                onPress={() => uploadTask()}
              >
                <MdText style={styles.submitBtnText}>Create Assessment</MdText>
                {uploading && (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ position: "absolute", right: 20 }}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : !isEmptyCourses ? (
        <EmptyState
          isDark={isDark}
          message="Start by clicking the button below"
          illustration="EmptyList"
        >
          <TouchableOpacity
            style={{ ...styles.createBtn, borderColor }}
            onPress={() => addQuestion("newQuetion")}
          >
            <MdText
              style={{ fontSize: 14, color: "#2967C4", paddingBottom: 1 }}
            >
              Create New Task
            </MdText>
            <View style={{ marginLeft: 7, backgroundColor: "transparent" }}>
              <CaretRight size={17} weight="bold" color={"#2967C4"} />
            </View>
          </TouchableOpacity>
        </EmptyState>
      ) : (
        <EmptyState
          message="You haven't created any course yet"
          nextline="Create a course to continue"
          illustration="EmptyCourse"
        >
          <TouchableOpacity
            style={{
              ...styles.createBtn,
              borderWidth: 0,
              ...padding(10, 20),
              backgroundColor: "#2b6cce",
            }}
            onPress={() => {
              navigation.dispatch(
                StackActions.replace("Root", {
                  screen: "Config",
                })
              );
            }}
          >
            <MdText
              style={{
                fontSize: 14,
                color: "#fff",
                paddingBottom: 1,
                textTransform: "uppercase",
              }}
            >
              Create a course
            </MdText>

            <View style={{ marginLeft: 7, backgroundColor: "transparent" }}>
              <CaretRight size={16} weight="bold" color="#fff" />
            </View>
          </TouchableOpacity>
        </EmptyState>
      )}
    </ScrollView>
  );
};

export default CuratedList;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    ...padding(16, 20, 20),
    flexDirection: "column",
  },

  scrollContainer: {
    flexGrow: 1,
  },

  actionBtn: {
    flex: 0,
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 120,
    ...padding(6, 12),
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#2967C4",
  },

  createBtn: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 120,
    ...padding(10, 16, 10, 20),
    borderWidth: 1,
  },

  submitBtn: {
    marginTop: 10,
    borderRadius: 12,
    ...padding(13, 20),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#2b6cce",
  },
  submitBtnText: {
    fontSize: 17,
    color: "#fff",
    marginHorizontal: 7,
    textTransform: "capitalize",
  },
});
