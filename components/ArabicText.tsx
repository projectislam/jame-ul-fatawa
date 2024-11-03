import { Text, type TextProps } from "react-native";

const ArabicText = ({ style, ...rest }: TextProps) => {
  return <Text style={[{ fontFamily: "Arabic" }, style]} {...rest} />;
};

export default ArabicText;
