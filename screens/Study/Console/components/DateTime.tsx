import { useState } from "react";
import { StyleSheet } from "react-native";
import { doubleDigit, padding, roundMinutes } from "../../../../utils";
import { View } from "../../../../components/Themed";
import { useAppDispatch } from "../../../../hooks/storeHooks";
import { toggleInput } from "../../../../store/console/consoleSlice";
import { InputBd, MdText } from "../../../../components/StyledText";
import useColorScheme from "../../../../hooks/useColorScheme";
import { numStr } from "../../../../types/study";

interface DateTimeProps {
  date: Date;
  setDate: any;
}

const DateTime = ({ date, setDate }: DateTimeProps) => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const invColor = isDark ? "#fff" : "#000";
  const labelColor = isDark ? "#ddd" : "#888";

  const [placeholder, _s] = useState(roundMinutes());
  const [day, setDay] = useState(doubleDigit(roundMinutes().getDate()));
  const [month, setMonth] = useState(
    doubleDigit(roundMinutes().getMonth() + 1)
  );
  const [hour, setHour] = useState(doubleDigit(roundMinutes().getHours()));
  const [minute, setMinute] = useState(
    doubleDigit(roundMinutes().getMinutes())
  );

  const isToday = (activeDate = date) =>
    activeDate.getDate() === new Date().getDate() &&
    activeDate.getMonth() === new Date().getMonth();

  const onHourChange = (value: numStr, newDate: Date) => {
    const present = new Date();
    const hr = Number(value) < present.getHours() ? present.getHours() : value;
    const min =
      Number(minute) < present.getMinutes()
        ? Number(present.getMinutes())
        : minute;
    newDate.setHours(Number(hr));
    newDate.setMinutes(Number(min));

    return { hr, min };
  };

  const onMinChange = (value: numStr, newDate: Date) => {
    const present = new Date();
    const hr = Number(hour) < present.getHours() ? present.getHours() : hour;
    const min =
      Number(hour) <= present.getHours() && Number(value) < present.getMinutes()
        ? present.getMinutes()
        : value;
    newDate.setHours(Number(hr));
    newDate.setMinutes(Number(min));

    return { hr, min };
  };

  const updateTime = (value: numStr, maxVal: number, clock: string) => {
    if (Number(value) > maxVal) return;
    const newDate = date;

    if (isToday()) {
      const { hr, min } = (clock === "min" ? onMinChange : onHourChange)(
        value,
        newDate
      );
      setDate(newDate);
      setHour(doubleDigit(hr));
      setMinute(doubleDigit(min));
    } else {
      newDate[clock === "min" ? "setMinutes" : "setHours"](Number(value));
      setDate(newDate);
      (clock === "min" ? setMinute : setHour)(doubleDigit(value));
    }
  };

  const onDateChange = (value: numStr, dType: string, maxVal: number) => {
    if (Number(value) > maxVal) return;
    const newDate = date;
    const currDate = new Date();
    const currDay = currDate.getDate();
    const currMonth = currDate.getMonth();

    if (dType === "month") {
      if (Number(value) - 1 < currMonth) {
        newDate.setDate(currDay);
        newDate.setMonth(currMonth);
        setDay(doubleDigit(currDay));
        setMonth(doubleDigit(currMonth + 1));
        setDate(newDate);
        return;
      } else {
        newDate.setMonth(Number(value) - 1);
        setMonth(doubleDigit(value));
        setDate(newDate);
        return;
      }
    } else if (dType === "day") {
      if (Number(value) < currDay && Number(month) - 1 === currMonth) {
        newDate.setDate(currDay);
        setDay(doubleDigit(currDay));
        setDate(newDate);
        return;
      } else {
        newDate.setDate(Number(value));
        setDay(doubleDigit(value));
        setDate(newDate);
        return;
      }
    }
  };

  return (
    <View
      style={{
        width: "100%",
        marginTop: 8,
        paddingTop: 14,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {[
        {
          minVal: 1,
          maxVal: 31,
          value: day,
          label: "Day",
          setValue: setDay,
          blurEvtDate: onDateChange,
          placeholder: placeholder.getDate(),
        },
        {
          minVal: 1,
          maxVal: 12,
          value: month,
          label: "Month",
          setValue: setMonth,
          blurEvtDate: onDateChange,
          placeholder: placeholder.getMonth(),
        },
        {
          maxVal: 23,
          value: hour,
          clock: "hr",
          label: "Hour",
          setValue: setHour,
          blurEvt: updateTime,
          placeholder: placeholder.getHours(),
        },
        {
          maxVal: 59,
          clock: "min",
          value: minute,
          label: "Minute",
          setValue: setMinute,
          blurEvt: updateTime,
          placeholder: placeholder.getMinutes(),
        },
      ].map((item, _i) => {
        return (
          <View
            key={_i}
            style={{
              flex: 1,
              alignItems: "center",
              flexDirection: "column",
              marginLeft: _i === 0 ? 0 : 10,
              marginRight: _i === 3 ? 0 : 10,
            }}
          >
            <MdText style={{ fontSize: 14, color: labelColor }}>
              {item.label}
            </MdText>

            <View
              style={[
                {
                  marginTop: 4,
                  width: "100%",
                  borderRadius: 6,
                  ...padding(2, 10, 0),
                  alignItems: "center",
                  flexDirection: "column",
                  backgroundColor: isDark ? "#2b2b2b" : "#f2f2f2",
                },
              ]}
            >
              <InputBd
                keyboardType="numeric"
                value={
                  Number(item.value) > item.maxVal
                    ? doubleDigit(item.maxVal).toString()
                    : item.value.toString()
                }
                textAlignVertical="top"
                placeholderTextColor={"#808080"}
                placeholder={item.placeholder.toString()}
                onBlur={e => {
                  dispatch(toggleInput(true));
                  item.blurEvt
                    ? item.blurEvt(e.nativeEvent.text, item.maxVal, item.clock)
                    : item.blurEvtDate(
                        e.nativeEvent.text,
                        item.label.toLowerCase(),
                        item.maxVal
                      );
                }}
                onFocus={() => dispatch(toggleInput(false))}
                onChange={e =>
                  e.nativeEvent.text.length < 3 &&
                  item.setValue(
                    Number(e.nativeEvent.text) > item.maxVal
                      ? item.maxVal
                      : Number(e.nativeEvent.text) < 0
                      ? 0
                      : e.nativeEvent.text
                  )
                }
                style={{ ...styles.input, color: invColor }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default DateTime;

const styles = StyleSheet.create({
  container: {},
  input: {
    width: "100%",
    fontSize: 15,
    ...padding(4, 10),
    textAlign: "center",
    fontFamily: "general-md",
  },
});
