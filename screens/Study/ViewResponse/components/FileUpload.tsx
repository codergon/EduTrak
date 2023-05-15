import { padding } from "../../../../utils";
import * as Icon from "phosphor-react-native";
import { StyleSheet, useColorScheme } from "react-native";
import { MdText } from "../../../../components/StyledText";
import { Pressable, View } from "../../../../components/Themed";

const FileUpload = ({ isLast }: { isLast: boolean }) => {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#eee" : "#000";
  const borderColor = colorScheme === "dark" ? "#ccc" : "#888";

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomWidth: isLast ? 0 : 0.8,
          borderColor,
        },
      ]}
    >
      <Pressable
        style={[
          styles.attachFileCont,
          {
            borderColor,
            borderWidth: 0,
            backgroundColor: "#f2f2f2",
          },
        ]}
      >
        <MdText style={styles.attachFileText}>Attach File(s)</MdText>
        <Icon.Files
          size={16}
          weight="fill"
          color={iconColor}
          style={styles.attachFileIcon}
        />
      </Pressable>
    </View>
  );
};

export default FileUpload;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "transparent",
  },

  optionContainer: {
    width: "100%",
    minHeight: 40,
    ...padding(0, 4),
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  optionIcon: {
    paddingTop: 2,
    marginRight: 16,
    backgroundColor: "transparent",
  },
  option: {
    flex: 1,
    ...padding(0, 0, 10),
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  optionText: {
    fontSize: 15.5,
  },
  attachFileCont: {
    borderRadius: 8,
    ...padding(12, 20, 14),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  attachFileText: {
    fontSize: 13,
    marginRight: 7,
  },
  attachFileIcon: {
    marginTop: 1,
  },
});
