import UrduText from "@/components/UrduText";
import { useRoute } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Fatwa = {
  id: number;
  title: string;
  darUlIftaName: string;
  issuedAt: string;
};

export default function ResultsScreen() {
  const db = useSQLiteContext();
  const route = useRoute();
  const { fasalId } = route.params as { fasalId: number };

  const [fatawa, setFatawa] = useState<Fatwa[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch fatawa related to the selected fasal
  useEffect(() => {
    const fetchFatawa = async () => {
      setLoading(true);

      const statement = await db.prepareAsync(
        `SELECT f.id, f.title, d.name AS darUlIftaName, f.issued_at AS issuedAt
           FROM fatwa f
           JOIN dar_ul_ifta d ON f.dar_ul_ifta = d.id
           WHERE f.fasal = $fasalId`
      );

      try {
        const result = await statement.executeAsync({ $fasalId: fasalId });
        const rows: any[] = await result.getAllAsync();
        const fatawaData = rows.map((row) => ({
          id: row.id,
          title: row.title,
          darUlIftaName: row.darUlIftaName,
          issuedAt: row.issuedAt,
        }));
        setFatawa(fatawaData);
        setLoading(false);
      } catch (error) {
        Alert.alert("Error", "Failed to load fatawa.");
        console.error(error);
      } finally {
        setLoading(false);
        await statement.finalizeAsync();
      }
    };

    fetchFatawa();
  }, [fasalId]);

  // Loading indicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading fatawa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={fatawa}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.fatwaCard}>
            <UrduText style={styles.title}>{item.title}</UrduText>
            <Text style={styles.subText}>
              Dar-ul-Ifta: {item.darUlIftaName}
            </Text>
            <Text style={styles.subText}>Issued: {item.issuedAt}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fatwaCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: "#555",
  },
});
