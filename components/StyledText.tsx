import { Text, TextProps } from "./Themed";

export function MonoText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "space-mono" }]} />
  );
}

export function RgText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "general-rg" }]} />
  );
}

export function MdText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "general-md" }]} />
  );
}

export function BdText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "general-bd" }]} />
  );
}
