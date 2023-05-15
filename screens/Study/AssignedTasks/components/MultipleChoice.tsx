import { padding } from "../../../../utils";
import * as Icon from "phosphor-react-native";
import { View } from "../../../../components/Themed";
import { answerOptions } from "../../../../types/study";
import { MdText } from "../../../../components/StyledText";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";

type MultiChoiceProps = {
  options: answerOptions;
  isLast: boolean;
  selected: string[];
  handleOptions: (options: answerOptions[0], action?: string) => any;
};

const MultipleChoice = ({
  options,
  isLast,
  selected,
  handleOptions,
}: MultiChoiceProps) => {
  const colorScheme = useColorScheme();
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
                {selected.includes(option.id) ? (
                  <Icon.CheckSquare size={20} weight="fill" color={iconColor} />
                ) : (
                  <Icon.Square size={20} weight="regular" color={iconColor} />
                )}
              </View>

              <View style={styles.option}>
                <MdText
                  style={styles.optionText}
                  darkColor={selected.includes(option.id) ? "#fff" : "#bbb"}
                  lightColor={selected.includes(option.id) ? "#000" : "#444"}
                >
                  {option?.value}
                </MdText>
              </View>
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
    fontSize: 16,
    lineHeight: 16 * 1.4,
  },
});
