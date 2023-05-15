import TodoItem from "./TodoItem";
import Layout from "../../constants/Layout";
import * as Icon from "phosphor-react-native";
import { View } from "../../components/Themed";
import { mockTodo } from "../../constants/Mock";
import { FlatList, StyleSheet } from "react-native";
import { MdText } from "../../components/StyledText";
import useColorScheme from "../../hooks/useColorScheme";

const TodoList = () => {
  const colorScheme = useColorScheme();
  const subColor = colorScheme === "dark" ? "#444" : "#ccc";
  const iconColor = colorScheme === "dark" ? "#888" : "#666";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MdText style={{ fontSize: 16 }}>Your Schedule</MdText>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={[
              styles.navIcon,
              {
                borderColor: subColor,
              },
            ]}
          >
            <Icon.CaretLeft size={12} weight="bold" color={iconColor} />
          </View>
          <View
            style={[
              styles.currentList,
              {
                borderColor: subColor,
              },
            ]}
            lightColor="#f4f4f4"
          >
            <MdText style={{ fontSize: 12, color: iconColor }}>Today</MdText>
          </View>
          <View
            style={[
              styles.navIcon,
              {
                borderColor: subColor,
              },
            ]}
          >
            <Icon.CaretRight size={12} weight="bold" color={iconColor} />
          </View>
        </View>
      </View>
      <View
        style={{ flexDirection: "column", marginTop: 20, marginBottom: 10 }}
      >
        <FlatList
          data={mockTodo}
          bounces={false}
          pagingEnabled={true}
          renderItem={({ item, index }) => (
            <TodoItem item={item} index={index} />
          )}
          decelerationRate="fast"
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          snapToInterval={Layout.appWidth + 16}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        />
      </View>
    </View>
  );
};

export default TodoList;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 50,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
    justifyContent: "space-between",
  },

  currentList: {
    height: 22,
    borderWidth: 1,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    marginHorizontal: 4,
  },
  navIcon: {
    height: 22,
    borderWidth: 1,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
});
