import Task from "./Task";
import useMenu from "../../../hooks/useMenu";
import Icons from "../../../components/Icons";
import Layout from "../../../constants/Layout";
import * as Icon from "phosphor-react-native";
import { AssignedProps } from "../../../types/study";
import { mockAssigned } from "../../../constants/Mock";
import { MdText } from "../../../components/StyledText";
import Topbar from "../../../components/layouts/Topbar";
import { actionsConfig } from "../../../constants/Colors";
import Searchbar from "../../../components/common/Searchbar";
import { SafeAreaView, View } from "../../../components/Themed";
import { FlatList, Pressable, StyleSheet, useColorScheme } from "react-native";

export default function AssignedTasks({ navigation }: AssignedProps) {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#eee" : "#444";
  const subColor = colorScheme === "dark" ? "#444" : "#e3e3e3";

  const [AppMenu, currentOption] = useMenu("all", [
    "all",
    "date",
    "category",
    "status",
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <Topbar title="Study" />

      <View style={styles.toolbar}>
        <Searchbar />

        <AppMenu align="end">
          <Pressable style={styles.defaultBtn}>
            {({ pressed }) => (
              <Icon.Calendar size={24} weight="regular" color={iconColor} />
              // <Icon.SortAscending size={24} weight="fill" color={iconColor} />
            )}
          </Pressable>
        </AppMenu>
      </View>

      <View style={styles.actions}>
        {[1, 2].map((item, index) => {
          return (
            <Pressable
              key={index}
              onPress={() => {}}
              style={[
                styles.studyAction,
                {
                  borderColor: subColor,
                  marginLeft: index % 2 === 0 ? 0 : 5,
                  marginRight: index % 2 === 0 ? 5 : 0,
                },
              ]}
            >
              <View
                style={[
                  styles.actionIcon__cover,
                  { backgroundColor: actionsConfig[index]?.bg },
                ]}
              >
                <Icons.SoftStar
                  style={styles.actionIcon}
                  color={actionsConfig[index]?.col}
                />
              </View>
              <MdText style={styles.actionText} lightColor="#888">
                {index === 0 ? "All" : "Active"}
              </MdText>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={mockAssigned}
        bounces={false}
        pagingEnabled={true}
        renderItem={({ item, index }) => (
          <Task
            item={item}
            index={index}
            navigation={navigation}
            lastIndex={mockAssigned?.length - 1}
          />
        )}
        decelerationRate="fast"
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        snapToInterval={Layout.appWidth + 16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 6 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 26,
    display: "flex",
    paddingHorizontal: 20,
    flexDirection: "column",
  },

  defaultBtn: {
    width: 30,
    height: "100%",
    marginLeft: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  toolbar: {
    zIndex: 99,
    display: "flex",
    flexDirection: "row",
  },

  actions: {
    width: "100%",
    marginTop: 20,
    marginBottom: 10,
    flexWrap: "wrap",
    overflow: "hidden",
    flexDirection: "row",
  },
  actionText: {
    fontSize: 15,
    marginLeft: 10,
  },
  studyAction: {
    flex: 1,
    height: 48,
    padding: 4,
    borderWidth: 1,
    minWidth: "40%",
    marginBottom: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  actionIcon__cover: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: { width: 20, height: 20 },

  currentList: {
    height: 22,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 4,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
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
