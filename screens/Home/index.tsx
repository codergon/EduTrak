import dayjs from "dayjs";
import TodoList from "./TodoList";
import { padding } from "../../utils";
import Constants from "expo-constants";
import PendingTasks from "./PendingTasks";
import { StyleSheet } from "react-native";
import Topbar from "../../components/layouts/Topbar";
import { RootTabScreenProps } from "../../types/types";
import { SafeAreaView, View } from "../../components/Themed";

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  const statusBarHeight = Constants.statusBarHeight;

  return (
    <View style={[styles.container, { paddingTop: statusBarHeight + 18 }]}>
      <Topbar title="Today" subtitle={dayjs().format("dddd DD MMMM")} />

      {/*  RECENTLY ASSIGNED TASK */}
      <PendingTasks />

      {/* TodoList */}
      <TodoList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    flexDirection: "column",
  },

  topBar: {
    ...padding(20, 0, 20),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    marginTop: 10,
  },

  imageContainer: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 40,
    borderColor: "#888",
  },
});
