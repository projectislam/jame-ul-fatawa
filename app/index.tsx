import { Bab, DarUlIfta, Fasal, Kitab } from "@/types/db";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DarUlIftaCard from "../components/DarUlIftaCard";

const HomeScreen: React.FC = ({ navigation }: any) => {
  const db = useSQLiteContext();
  const [darUlIftaData, setDarUlIftaData] = useState<DarUlIfta[]>([]);
  const [kitabData, setKitabData] = useState<Kitab[]>([]);
  const [babData, setBabData] = useState<Bab[]>([]);
  const [fasalData, setFasalData] = useState<Fasal[]>([]);
  const [expandedKitab, setExpandedKitab] = useState<number | null>(null);
  const [expandedBab, setExpandedBab] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadAllData();
      } catch (error) {
        showErrorDialog(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const showErrorDialog = (error: any) => {
    Alert.alert("Error", `Failed to load data: ${error.message}`, [
      { text: "OK" },
    ]);
  };

  const loadAllData = async () => {
    try {
      const darUlIftaResult = await db.getAllAsync("SELECT * FROM dar_ul_ifta");
      setDarUlIftaData(darUlIftaResult as DarUlIfta[]);
    } catch (error: any) {
      throw new Error(`Dar-ul-Ifta data: ${error.message}`);
    }

    try {
      const kitabResult = await db.getAllAsync("SELECT * FROM kitab");
      setKitabData(kitabResult as Kitab[]);
    } catch (error: any) {
      throw new Error(`Kitab data: ${error.message}`);
    }

    try {
      const babResult = await db.getAllAsync("SELECT * FROM bab");
      setBabData(babResult as Bab[]);
    } catch (error: any) {
      throw new Error(`Bab data: ${error.message}`);
    }

    try {
      const fasalResult = await db.getAllAsync("SELECT * FROM fasal");
      setFasalData(fasalResult as Fasal[]);
    } catch (error: any) {
      throw new Error(`Fasal data: ${error.message}`);
    }
  };

  const toggleKitab = (kitabId: number) => {
    if (expandedKitab === kitabId) {
      setExpandedKitab(null);
      setExpandedBab(null);
    } else {
      setExpandedKitab(kitabId);
      setExpandedBab(null);
    }
  };

  const toggleBab = (babId: number) => {
    if (expandedBab === babId) {
      setExpandedBab(null);
    } else {
      setExpandedBab(babId);
    }
  };

  const filteredBabData = expandedKitab
    ? babData.filter((bab) => bab.kitab === expandedKitab)
    : [];
  const filteredFasalData = expandedBab
    ? fasalData.filter((fasal) => fasal.bab === expandedBab)
    : [];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Search")}>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          editable={false}
        />
      </TouchableOpacity>

      <FlatList
        data={darUlIftaData}
        numColumns={2}
        renderItem={({ item }) => <DarUlIftaCard data={item} />}
        keyExtractor={(item) => item.id.toString()}
      />

      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={kitabData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: kitab }) => (
          <View>
            <TouchableOpacity onPress={() => toggleKitab(kitab.id)}>
              <Text style={styles.kitabItem}>{kitab.urdu}</Text>
            </TouchableOpacity>

            {expandedKitab === kitab.id && (
              <FlatList
                data={filteredBabData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item: bab }) => (
                  <View style={styles.babContainer}>
                    <TouchableOpacity onPress={() => toggleBab(bab.id)}>
                      <Text style={styles.babItem}>{bab.urdu}</Text>
                    </TouchableOpacity>

                    {expandedBab === bab.id && (
                      <FlatList
                        data={filteredFasalData}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item: fasal }) => (
                          <Text style={styles.fasalItem}>{fasal.urdu}</Text>
                        )}
                      />
                    )}
                  </View>
                )}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  kitabItem: { fontSize: 16, fontWeight: "bold", paddingVertical: 8 },
  babContainer: { paddingLeft: 20 },
  babItem: { fontSize: 14, paddingVertical: 6 },
  fasalItem: { fontSize: 12, paddingLeft: 40, paddingVertical: 4 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#000" },
});

export default HomeScreen;
