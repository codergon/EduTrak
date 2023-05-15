import { padding } from "../../../../utils";
import { View } from "../../../../components/Themed";
import { InputBd } from "../../../../components/StyledText";
import { StyleSheet, useColorScheme } from "react-native";

const InputResponse = ({
  isLast,
  response,
  setResponse,
  onTextUpdate,
}: {
  isLast: boolean;
  response: string;
  onTextUpdate: any;
  setResponse: (e: string) => void;
}) => {
  const colorScheme = useColorScheme();

  const placeholderColor = "#808080";
  const isDark = colorScheme === "dark";
  const highlightIcon = isDark ? "#fff" : "#000";
  const borderColor = colorScheme === "dark" ? "#ccc" : "#888";

  return (
    <View
      style={[
        styles.container,
        { borderBottomWidth: isLast ? 0 : 0.8, borderColor },
      ]}
    >
      <InputBd
        multiline
        value={response}
        color={highlightIcon}
        placeholder="Type reponse here..."
        placeholderTextColor={placeholderColor}
        onChange={e => setResponse(e.nativeEvent.text)}
        // onBlur={e => onTextUpdate(e.nativeEvent.text)}
        style={[styles.resInput, { backgroundColor: "#f2f2f2" }]}
      />
    </View>
  );
};

export default InputResponse;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingBottom: 4,
    backgroundColor: "transparent",
  },

  resInput: {
    width: "100%",
    fontSize: 15,
    borderRadius: 8,
    ...padding(12, 14),
  },
});
