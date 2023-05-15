import { padding } from "../../../../utils";
import * as Icon from "phosphor-react-native";
import { View } from "../../../../components/Themed";
import { answerOptions } from "../../../../types/study";
import { MdText } from "../../../../components/StyledText";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";

type MultiChoiceProps = {
  options: answerOptions;
  isLast: boolean;
  handleOptions: (options: answerOptions[0], action?: string) => any;
};

const MultipleChoice = ({
  options,
  isLast,
  handleOptions,
}: MultiChoiceProps) => {
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";
  const invColor = isDark ? "#fff" : "#000";

  const iconColor = colorScheme === "dark" ? "#fff" : "#000";
  const borderColor = colorScheme === "dark" ? "#ccc" : "#888";

  return (
    <View
      style={[
        styles.container,
        { borderBottomWidth: isLast ? 0 : 0.8, borderColor },
      ]}
    >
      {options?.map((option, index) => {
        return (
          <View
            key={option.id}
            style={[
              styles.optionContainer,
              {
                marginBottom: index === options.length - 1 ? 0 : 6,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.67}
              style={{ flex: 1, flexDirection: "row" }}
              onPress={() => handleOptions(option)}
            >
              <View style={styles.optionIcon}>
                {option?.isCorrect ? (
                  <Icon.CheckSquare size={18} weight="fill" color={iconColor} />
                ) : (
                  <Icon.Square size={18} weight="regular" color={iconColor} />
                )}
              </View>

              <View style={styles.option}>
                <MdText
                  style={styles.optionText}
                  darkColor={option?.isCorrect ? "#fff" : "#ccc"}
                  lightColor={option?.isCorrect ? "#000" : "#444"}
                >
                  {option?.value}
                </MdText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.67}
              style={{
                marginLeft: 6,
                flexDirection: "row",
                ...padding(2, 4, 2, 10),
                justifyContent: "center",
              }}
              onPress={() => handleOptions(option, "delete")}
            >
              <Icon.Trash
                size={16}
                weight="bold"
                color={isDark ? "#ccc" : "#333"}
              />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default MultipleChoice;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "transparent",
  },

  optionContainer: {
    width: "100%",
    minHeight: 20,
    ...padding(0),
    paddingLeft: 4,
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  optionIcon: {
    marginTop: 2,
    marginRight: 12,
    backgroundColor: "transparent",
  },
  option: {
    flex: 1,
    ...padding(0, 0, 8),
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  optionText: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
  },
});
