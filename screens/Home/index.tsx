import TodoList from "./TodoList";
import { padding } from "../../utils";
import PendingTasks from "./PendingTasks";
import { Image, StyleSheet } from "react-native";
import { MdText } from "../../components/StyledText";
import { RootTabScreenProps } from "../../types/types";
import { SafeAreaView, Text, View } from "../../components/Themed";

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <MdText style={styles.title}>Welcome back</MdText>
        <View style={styles.imageContainer} lightColor="#ddd" darkColor="#888">
          <Image
            style={{ width: "100%", height: "100%", borderRadius: 40 }}
            source={{
              uri: "https://ik.imagekit.io/alphaknight/download-modified_rgWfhs6ea.png",
            }}
          />
        </View>
      </View>

      {/*  RECENTLY ASSIGNED TASK */}
      <PendingTasks />

      {/* TodoList */}
      <TodoList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 34,
    paddingHorizontal: 20,
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
