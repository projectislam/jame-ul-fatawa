import { Text, type TextProps } from "react-native";

const UrduText = ({ style, ...rest }: TextProps) => {
  return <Text style={[{ direction: "rtl" }, style]} {...rest} />;
};

export default UrduText;
