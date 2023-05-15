import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { MdText } from "../../../components/StyledText";
import { View } from "../../../components/Themed";
import { padding } from "../../../utils";
import * as Icon from "phosphor-react-native";

type StudentCardProps = {
  answerIndex: number;
  studentName: string;
  studentMatricNo: string;
  openResponse: (answer: number) => void;
};

const StudentCard = ({
  answerIndex,
  studentName,
  openResponse,
  studentMatricNo,
}: StudentCardProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const RowEntry = ({
    label,
    value,
    capitals,
  }: {
    label: string;
    value: string;
    capitals?: boolean;
  }) => {
    return value ? (
      <View
        style={{
          marginBottom: 8,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MdText
          style={{
            fontSize: 15,
          }}
        >
          {label}
          {" : "}
        </MdText>
        <MdText
          style={{
            fontSize: 15,
            textTransform: capitals ? "uppercase" : "none",
          }}
        >
          {value}
        </MdText>
      </View>
    ) : (
      <></>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={{
        width: "100%",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: "center",
        flexDirection: "row",
        ...padding(12, 12, 6),
        borderColor: isDark ? "#444" : "#e3e3e3",
      }}
      onPress={() => openResponse(answerIndex)}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
        }}
      >
        <RowEntry label="Student Name" value={studentName} />
        <RowEntry label="Matric No" value={studentMatricNo} capitals />
      </View>
      <View
        style={{
          width: 30,
          height: 30,
          marginLeft: 12,
          marginBottom: 6,
          borderRadius: 40,
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: isDark ? "#383838" : "#e5e5e5",
        }}
      >
        <Icon.CaretRight
          size={17}
          weight={"bold"}
          color={isDark ? "#ccc" : "#777"}
        />
      </View>
    </TouchableOpacity>
  );
};

export default StudentCard;

const styles = StyleSheet.create({});
