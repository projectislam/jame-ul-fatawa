import { Text, type TextProps } from "react-native";

const UrduText = ({ style, ...rest }: TextProps) => {
  return <Text style={[{ fontFamily: "Urdu" }, style]} {...rest} />;
};

export default UrduText;
