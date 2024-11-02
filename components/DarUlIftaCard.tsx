import { DarUlIfta } from "@/types/db";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DarUlIftaCardProps {
  data: DarUlIfta;
}

const DarUlIftaCard: React.FC<DarUlIftaCardProps> = ({ data }) => {
  return (
    <View style={styles.card}>
      {/* <Image source={{ uri: data.logo }} style={styles.logo} /> */}
      <Text style={styles.name}>{data.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DarUlIftaCard;
