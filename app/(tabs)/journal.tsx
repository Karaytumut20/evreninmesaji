import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router"; // Sayfa her açıldığında veriyi yenilemek için
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function JournalScreen() {
  const [history, setHistory] = useState<any[]>([]);

  // Sayfaya her gelindiğinde veriyi çek
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem("messageHistory");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      "Günlüğü Temizle",
      "Tüm geçmiş mesajların silinecek. Emin misin?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("messageHistory");
            setHistory([]);
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons
          name="calendar-month"
          size={16}
          color="#FFD700"
        />
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <Text style={styles.messageText}>"{item.message}"</Text>
      <View style={styles.decorationLine} />
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#1a0033", "#2d004d"]}
        style={styles.background}
      >
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={40}
            color="#FFD700"
          />
          <Text style={styles.title}>RUHSAL GÜNLÜK</Text>
          <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color="#FF6666"
            />
          </TouchableOpacity>
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="feather"
              size={60}
              color="rgba(255,255,255,0.2)"
            />
            <Text style={styles.emptyText}>
              Henüz kaydedilmiş bir mesaj yok.
            </Text>
            <Text style={styles.emptySubText}>
              Her gün mesajını aldıkça burası dolacak.
            </Text>
          </View>
        ) : (
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    letterSpacing: 2,
    marginLeft: 10,
  },
  clearButton: { padding: 10 },

  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: "#FFD700",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    opacity: 0.7,
  },
  dateText: {
    color: "#FFD700",
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "600",
  },
  messageText: {
    color: "#FFF",
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic",
  },
  decorationLine: {
    position: "absolute",
    right: 20,
    top: 20,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,215,0,0.2)",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: { color: "#FFF", fontSize: 18, marginTop: 20, fontWeight: "bold" },
  emptySubText: { color: "#AAA", fontSize: 14, marginTop: 10 },
});
