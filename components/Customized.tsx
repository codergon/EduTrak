import { Keyboard, StyleProp, TouchableOpacity } from "react-native";
import { SafeAreaViewProps } from "react-native-safe-area-context";
import {
  SafeAreaView as DefaultSafeArea,
  ScrollView,
  ThemeProps,
} from "./Themed";

export function SafeAreaView(props: SafeAreaViewProps & ThemeProps) {
  const { style, ...otherProps } = props;

  return (
    <DefaultSafeArea
      style={[{}, style as StyleProp<SafeAreaViewProps & ThemeProps>]}
      {...otherProps}
    >
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {props.children}
      </ScrollView>
    </DefaultSafeArea>
  );
}

export function SafeAreaAutoDismiss(
  props: SafeAreaViewProps &
    ThemeProps & {
      onClickIn?: (() => void) | { (data?: string): void }[];
    }
) {
  const { style, onClickIn, ...otherProps } = props;

  return (
    <DefaultSafeArea
      style={[{}, style as StyleProp<SafeAreaViewProps & ThemeProps>]}
      {...otherProps}
    >
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss();
            onClickIn &&
              (typeof onClickIn === "function"
                ? onClickIn()
                : onClickIn?.map(fn => fn()));
          }}
          style={{ flex: 1 }}
        >
          {props.children}
        </TouchableOpacity>
      </ScrollView>
    </DefaultSafeArea>
  );
}
