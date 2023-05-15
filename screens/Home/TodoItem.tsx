import * as Icon from "phosphor-react-native";
import { TodoItemProp } from "../../types/home";
import { MdText } from "../../components/StyledText";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { View } from "../../components/Themed";
import useColorScheme from "../../hooks/useColorScheme";

const TodoItem = ({ item, index }: TodoItemProp) => {
  const colorScheme = useColorScheme();
  const [done, setDone] = useState(false);
  const subColor = colorScheme === "dark" ? "#444" : "#ccc";
  const iconColor = colorScheme === "dark" ? "#888" : "#666";

  return (
    <View style={[styles.taskItem, { borderColor: subColor }]}>
      <View style={{ flexDirection: "column" }}>
        <MdText style={{ fontSize: 14, marginBottom: 4 }} darkColor="#eee">
          {item?.todo}
        </MdText>
        <MdText style={{ fontSize: 12 }} lightColor="#888" darkColor="#888">
          {item?.due}
        </MdText>
      </View>

      <Pressable
        onPress={() => {
          setDone(p => !p);
        }}
        style={{ padding: 4 }}
      >
        {({ pressed }) => (
          <Icon.CheckCircle
            size={23}
            weight={done ? "fill" : "regular"}
            color={done ? "#1FA647" : iconColor}
          />
        )}
      </Pressable>
    </View>
  );
};

export default TodoItem;

const styles = StyleSheet.create({
  taskItem: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
});
