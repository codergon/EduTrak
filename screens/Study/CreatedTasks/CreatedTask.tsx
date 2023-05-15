import { View } from "../../../components/Themed";
import { StudyTaskProp } from "../../../types/study";
import { MdText } from "../../../components/StyledText";
import useColorScheme from "../../../hooks/useColorScheme";
import { StyleSheet, TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import { padding } from "../../../utils";
import { useNavigation } from "@react-navigation/native";

const CreatedTask = ({ item, index, lastIndex }: StudyTaskProp) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const subColor = colorScheme === "dark" ? "#444" : "#ddd";

  const OpenTask = () => {
    navigation.navigate("Root", {
      screen: "Study",
      params: {
        screen: "ViewResponses",
        params: {
          taskId: item.courseId,
          taskInfo: item,
        },
      },
    });
  };

  return (
    <TouchableOpacity
      onPress={OpenTask}
      activeOpacity={0.7}
      style={[styles.taskItem, { borderBottomColor: subColor }]}
    >
      <View
        style={[
          styles.details,
          {
            borderBottomColor: subColor,
            borderBottomWidth: index === lastIndex ? 0 : 1,
          },
        ]}
      >
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View
            style={{
              flexDirection: "row",
              // alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <MdText
              style={{
                fontSize: 15,
                marginBottom: 4,
                textTransform: "uppercase",
              }}
              darkColor="#f2f2f2"
            >
              {item?.courseName}
            </MdText>

            <View
              style={{
                marginTop: 2,
                ...padding(4, 5),
                borderRadius: 4,
                marginBottom: 4,
                backgroundColor: "#2967c4",
              }}
            >
              <MdText style={{ fontSize: 11.5, color: "#fff" }}>
                {dayjs(item?.dateDue.toDate()).format("MMM DD, HH:mm")}
              </MdText>
            </View>
          </View>

          <MdText
            style={{ fontSize: 13, lineHeight: 1.4 * 12 }}
            lightColor="#777"
            darkColor="#aaa"
            numberOfLines={3}
          >
            {item?.description}
          </MdText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CreatedTask;

const styles = StyleSheet.create({
  imageContainer: {
    width: 40,
    height: 40,
    marginRight: 14,
    borderRadius: 40,
  },
  taskItem: {
    width: "100%",
    paddingTop: 18,
    paddingBottom: 6,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  details: {
    flex: 1,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
