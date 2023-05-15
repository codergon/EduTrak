import TaskItem from "./TaskItem";
import { padding } from "../../utils";
import Layout from "../../constants/Layout";
import { View } from "../../components/Themed";
import { mockTasks } from "../../constants/Mock";
import { FlatList, StyleSheet } from "react-native";
import { MdText, RgText } from "../../components/StyledText";
import useColorScheme from "../../hooks/useColorScheme";

const PendingTasks = () => {
  const colorScheme = useColorScheme();
  const subColor = colorScheme === "dark" ? "#444" : "#ccc";

  return (
    <>
      <View style={styles.cardsContainer}>
        <View style={styles.cardsHeader}>
          <RgText style={{ fontSize: 16 }}>
            Current tasks assigned to you
          </RgText>

          <View
            lightColor="#f4f4f4"
            style={[styles.cardsHeaderValue, { borderColor: subColor }]}
            darkColor="rgba(255,255,255,0.3)"
          >
            <MdText style={{ fontSize: 12 }}>5</MdText>
          </View>
        </View>

        <View style={styles.cardsContent}>
          <FlatList
            horizontal
            data={mockTasks}
            bounces={false}
            pagingEnabled={true}
            renderItem={({ item, index }) => (
              <TaskItem item={item} index={index} />
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
    </>
  );
};

export default PendingTasks;

const styles = StyleSheet.create({
  cardsContainer: {
    width: "100%",
    marginTop: 10,
  },
  cardsHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardsHeaderValue: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 10,
    ...padding(0, 8),
  },
  cardsContent: {
    height: 120,
    width: "100%",
    marginTop: 22,
  },
});
