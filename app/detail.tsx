import UrduText from "@/components/UrduText";
import { useRoute } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import WebView from "react-native-webview";

type FatwaDetails = {
  id: number;
  title: string;
  question: string;
  answer: string;
  fatwaNumber: string;
  darUlIftaName: string;
  issuedAt: string;
};

export default function DetailScreen() {
  const [webViewHeight, setWebViewHeight] = useState(800); // Set initial height
  const webViewRef = useRef(null);
  const { width } = Dimensions.get("window");
  const db = useSQLiteContext();
  const route = useRoute();
  const { fatwaId } = route.params as { fatwaId: number };

  const [fatwa, setFatwa] = useState<FatwaDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFatwaDetails = async () => {
      setLoading(true);

      const statement = await db.prepareAsync(
        `SELECT f.id, f.title, f.question, f.answer, f.fatwa_number AS fatwaNumber,
           d.name AS darUlIftaName, f.issued_at AS issuedAt
           FROM fatwa f
           JOIN dar_ul_ifta d ON f.dar_ul_ifta = d.id
           WHERE f.id = $fatwaId`
      );

      try {
        const result = await statement.executeAsync({ $fatwaId: fatwaId });
        const row = await result.getFirstAsync();
        setFatwa(row as FatwaDetails);
      } catch (error) {
        Alert.alert("Error", "Failed to load fatwa details.");
        console.error(error);
      } finally {
        setLoading(false);
        await statement.finalizeAsync();
      }
    };

    fetchFatwaDetails();
  }, [fatwaId]);

  // Loading indicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading details...</Text>
      </View>
    );
  }

  if (!fatwa) {
    return null;
  }

  // HTML content for WebView
  const htmlContent = `
      <html>
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
        <style>
          body {  direction: rtl;  }
        </style>
      </head>
        <body>
          ${fatwa.answer}
        </body>
      </html>
    `;

  const injectedJavaScript = `
    setTimeout(function() {
      window.ReactNativeWebView.postMessage(document.body.scrollHeight);
    }, 500);
    true; 
  `;

  const handleWebViewMessage = (event: any) => {
    setWebViewHeight(Number(event.nativeEvent.data));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <UrduText style={styles.title}>{fatwa.title}</UrduText>
      <Text style={styles.subText}>Dar-ul-Ifta: {fatwa.darUlIftaName}</Text>
      <Text style={styles.subText}>Issued at: {fatwa.issuedAt}</Text>
      <Text style={styles.subText}>Fatwa Number: {fatwa.fatwaNumber}</Text>
      <Text style={styles.sectionTitle}>Question</Text>
      <UrduText style={styles.content}>{fatwa.question}</UrduText>
      <Text style={styles.sectionTitle}>Answer</Text>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={{ width: width - 40, height: webViewHeight }}
        scalesPageToFit={false}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled
        onMessage={handleWebViewMessage}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
});
