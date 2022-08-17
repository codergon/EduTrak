import { padding } from "../../utils";
import Layout from "../../constants/Layout";
import * as Icon from "phosphor-react-native";
import { View } from "../../components/Themed";
import { TaskColors } from "../../constants/Colors";
import { FlatList, StyleSheet } from "react-native";
import { MdText, RgText } from "../../components/StyledText";
import { mockTasks } from "../../constants/Mock";
import { TaskItemProp } from "../../types/home";

const TaskItem = ({ item, index }: TaskItemProp) => {
  return (
    <View
      style={[
        styles.cardItem,
        {
          width: Layout.appWidth,
          backgroundColor: TaskColors[index % TaskColors.length],
        },
      ]}
    >
      <View style={styles.cardRow}>
        <MdText
          style={{ fontSize: 22, color: "#fff", textTransform: "uppercase" }}
        >
          {item?.course}
        </MdText>
        <Icon.DotsThree size={28} weight="bold" color="#fff" />
      </View>

      <View style={styles.cardRow}>
        <MdText style={{ fontSize: 14, color: "#fff" }}>
          {item?.lecturer}
        </MdText>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <MdText
            style={{
              fontSize: 14,
              color: "#fff",
              marginRight: 6,
            }}
          >
            {item?.due}
          </MdText>
          <Icon.Timer color="#fff" weight="bold" size={16} />
        </View>
      </View>
    </View>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  cardItem: {
    height: "100%",
    borderRadius: 6,
    overflow: "hidden",
    paddingVertical: 20,
    borderColor: "#000",
    position: "relative",
    justifyContent: "space-between",
  },
  cardRow: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
});
