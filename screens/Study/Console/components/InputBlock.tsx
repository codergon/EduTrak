import {
  TextInput,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { padding } from "../../../../utils";
import { Plus } from "phosphor-react-native";
import { View } from "../../../../components/Themed";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "../../../../hooks/storeHooks";

interface InputBlockProps {
  inputVal: string;
  setInputVal: (val: string) => void;
}

const InputBlock = ({ inputVal, setInputVal }: InputBlockProps) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const invColor = isDark ? "#fff" : "#000";
  const borderColor = isDark ? "#555" : "#ddd";
  const inputBg = isDark ? "#2b2b2b" : "#f2f2f2";
  const placeholderColor = isDark ? "#aaa" : "#808080";

  const { revealInput, activeQuestion, isEmptyCourses, isFetchingCourses } =
    useAppSelector(state => state.console);

  return (
    <>
      {revealInput && !isEmptyCourses && !isFetchingCourses && (
        <View style={[styles.inputContainer, { borderColor }]}>
          <TouchableOpacity
            style={styles.attachfilesBtnContainer}
            onPress={() => navigation.goBack()}
          >
            <View
              style={{ ...styles.attachfilesBtn, backgroundColor: inputBg }}
            >
              <Plus size={18} weight="bold" color={isDark ? "#eee" : "#333"} />
            </View>
          </TouchableOpacity>

          <TextInput
            multiline
            value={inputVal}
            numberOfLines={2}
            textAlignVertical="top"
            editable={!!activeQuestion}
            enablesReturnKeyAutomatically
            placeholderTextColor={placeholderColor}
            placeholder="Start typing your question"
            onChange={e => setInputVal(e.nativeEvent.text)}
            style={[
              styles.resInput,
              { color: invColor, backgroundColor: inputBg },
            ]}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    display: "flex",
    ...padding(12, 16),
    flexDirection: "row",
    borderTopWidth: 0.8,
    alignItems: "flex-end",
  },

  resInput: {
    flex: 1,
    fontSize: 15,
    borderRadius: 8,
    ...padding(12, 14),
    marginHorizontal: 10,
    fontFamily: "general-md",
  },

  attachfilesBtnContainer: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  attachfilesBtn: {
    width: 32,
    height: 32,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
  },
  addBtnContainer: {
    width: 32,
    height: 32,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2967c4",
  },
});

export default InputBlock;
