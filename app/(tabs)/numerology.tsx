import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

export default function NumerologyScreen() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Buraya '/' işaretli Banner ID'ni yaz:
  const bannerAdUnitId = __DEV__
    ? TestIds.BANNER
    : "ca-app-pub-4816381866965413/2489215274";

  const analyzeName = () => {
    if (name.trim().length < 2) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Keyboard.dismiss();
    setLoading(true);

    setTimeout(() => {
      const comments = [
        "Liderlik vasfın çok yüksek, öncü bir ruhun var.",
        "Duygusal zekan çok gelişmiş, hislerin kuvvetli.",
        "Sanatsal ve yaratıcı yönün bugünlerde ön planda.",
        "Pratik zekanla çözemeyeceğin sorun yok.",
        "Özgürlüğüne düşkünsün, kısıtlanmaya gelemiyorsun.",
        "Sorumluluk sahibisin, çevren sana güveniyor.",
        "Gizemli bir havan var, insanlar seni merak ediyor.",
        "Bolluk ve bereket enerjisi seninle.",
      ];

      const randomComment =
        comments[Math.floor(Math.random() * comments.length)];
      setResult(
        `${name.toUpperCase()}, senin isminin enerjisi diyor ki:\n\n"${randomComment}"`
      );
      setLoading(false);
    }, 1500);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LinearGradient
          colors={["#000000", "#2d004d", "#1a0033"]}
          style={styles.background}
        >
          <View style={styles.header}>
            <MaterialCommunityIcons name="auto-fix" size={50} color="#FFD700" />
            <Text style={styles.title}>İSİM ANALİZİ</Text>
            <Text style={styles.subtitle}>İsminin Enerjisini Keşfet</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="İsmini Yaz..."
              placeholderTextColor="#AAA"
              value={name}
              onChangeText={setName}
              maxLength={20}
            />

            <TouchableOpacity
              style={[styles.button, { opacity: name.length < 2 ? 0.5 : 1 }]}
              onPress={analyzeName}
              disabled={loading || name.length < 2}
            >
              {loading ? (
                <ActivityIndicator color="#1a0033" />
              ) : (
                <Text style={styles.buttonText}>ANALİZ ET</Text>
              )}
            </TouchableOpacity>
          </View>

          {result && (
            <View style={styles.resultContainer}>
              <MaterialCommunityIcons
                name="star-face"
                size={30}
                color="#FFD700"
                style={{ marginBottom: 10 }}
              />
              <Text style={styles.resultText}>{result}</Text>
            </View>
          )}

          {/* --- BANNER REKLAM --- */}
          <View style={styles.adContainer}>
            <BannerAd
              unitId={bannerAdUnitId}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 80,
  },
  header: { alignItems: "center", marginBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginTop: 10,
    letterSpacing: 2,
  },
  subtitle: { color: "#D8BFD8", fontSize: 14, marginTop: 5 },
  inputContainer: { width: "100%", alignItems: "center", gap: 15 },
  input: {
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 15,
    fontSize: 18,
    color: "#FFF",
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
    textAlign: "center",
  },
  button: {
    width: "90%",
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: { color: "#1a0033", fontWeight: "bold", fontSize: 16 },
  resultContainer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.2)",
    alignItems: "center",
    width: "90%",
  },
  resultText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
  },
  adContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    paddingBottom: 10,
  },
});
