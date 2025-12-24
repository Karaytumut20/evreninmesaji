import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- ADMOB KÜTÜPHANESİ (Expo Go'da hata vermemesi için şimdilik kapalı) ---
// Build alırken aşağıdaki 3 satırın başındaki // işaretini kaldıracaksın.
// import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

// const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3940256099942544~3347511713';
/*
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});
*/

// --- 1. MİSTİK SÖZLER LİSTESİ ---
const messages = [
  "Bugün evren sana sürpriz bir kapı açacak, o kapıdan girmekten korkma.",
  "Eski bir dosttan alacağın haber, tüm planlarını değiştirebilir.",
  "Şu an zihnini kurcalayan o sorunun cevabı: 'Evet'.",
  "Bugün kendine şefkat göstermen gereken bir gün. Acele etme.",
  "Maddi konularda beklemediğin bir rahatlama geliyor.",
  "Rüyalarına dikkat et, sana bir şeyler anlatmaya çalışıyorlar.",
  "Enerjin çok yüksek, bugün başladığın işler başarıyla biter.",
  "Biraz yavaşla. Evrenin senin için hazırladığı senaryo henüz bitmedi.",
  "Bugün şans rengin Mor. Etrafında bu rengi ara.",
  "Kalbinin sesini dinle, mantığın bugün seni yanıltabilir.",
  "Geçmişi serbest bırak, ellerin doluysa yeni hediyeleri tutamazsın.",
  "Bir mucizeye inanmak, onu çağırmanın ilk adımıdır.",
  "Bugün karşına çıkan sayılara dikkat et (11:11, 22:22).",
  "Sessiz kalmak, bazen en güçlü cevaptır.",
  "İçindeki potansiyel sandığından çok daha büyük.",
];

export default function App() {
  // HATA ÇÖZÜMÜ: Başlangıç değerini null değil, boş tırnak ("") yaptık.
  const [dailyMessage, setDailyMessage] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  /* --- REKLAM YÜKLEME KODLARI (Şimdilik Kapalı) ---
  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setAdLoaded(true);
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setAdLoaded(false);
      interstitial.load();
      revealMessage(); // Reklam bitince mesajı göster
    });

    interstitial.load();

    return () => {
      unsubscribe();
      unsubscribeClosed();
    };
  }, []);
  */

  // Mesajı Açma Mantığı
  const handlePress = () => {
    if (isRevealed) {
      Alert.alert(
        "Yarın Görüşürüz!",
        "Evren her gün sadece bir mesaj verir. Yarın tekrar gel."
      );
      return;
    }

    // NORMALDE BURADA REKLAM KONTROLÜ YAPILIR
    // if (adLoaded) { interstitial.show(); } else { revealMessage(); }

    // Şimdilik direkt mesajı açıyoruz:
    revealMessage();
  };

  const revealMessage = () => {
    setLoading(true);
    // Heyecan yaratmak için 1.5 saniye bekleme
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setDailyMessage(messages[randomIndex]);
      setIsRevealed(true);
      setLoading(false);
      saveForToday();
    }, 1500);
  };

  const saveForToday = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      await AsyncStorage.setItem("lastOpenedDate", today);
    } catch (e) {
      console.log("Kaydetme hatası", e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a0033" />

      {/* Arka Plan: Koyu Mistik Tema */}
      <LinearGradient
        colors={["#1a0033", "#2d004d", "#000000"]}
        style={styles.background}
      >
        {/* Başlık Alanı */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="moon-waning-crescent"
            size={50}
            color="#FFD700"
            style={styles.shadow}
          />
          <Text style={styles.title}>EVRENİN MESAJI</Text>
          <Text style={styles.subtitle}>2026 Spiritüel Rehber</Text>
        </View>

        {/* Kart Alanı */}
        <View style={styles.cardContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <MaterialCommunityIcons
                name="star-four-points"
                size={40}
                color="#FFD700"
                style={styles.spinner}
              />
              <Text style={styles.loadingText}>Yıldızlar hizalanıyor...</Text>
            </View>
          ) : isRevealed ? (
            <View style={styles.messageBox}>
              <MaterialCommunityIcons
                name="format-quote-open"
                size={40}
                color="#FFD700"
                style={{ opacity: 0.5 }}
              />
              <Text style={styles.messageText}>{dailyMessage}</Text>
              <MaterialCommunityIcons
                name="format-quote-close"
                size={40}
                color="#FFD700"
                style={{ alignSelf: "flex-end", opacity: 0.5 }}
              />

              <TouchableOpacity
                style={styles.shareHint}
                onPress={() =>
                  Alert.alert(
                    "Paylaş",
                    "Ekran görüntüsü alıp arkadaşlarına gönder!"
                  )
                }
              >
                <Text style={styles.shareText}>
                  Paylaşmak için Ekran Görüntüsü Al
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.mysteryButton}
              onPress={handlePress}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="email-seal"
                  size={60}
                  color="#1a0033"
                />
              </View>
              <Text style={styles.buttonText}>Mesajını Al</Text>
              <Text style={styles.subText}>(Önce Niyet Et, Sonra Dokun)</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700",
    letterSpacing: 2,
    marginTop: 10,
    textShadowColor: "rgba(255, 215, 0, 0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    color: "#D8BFD8",
    fontSize: 14,
    marginTop: 5,
    letterSpacing: 1,
  },
  shadow: {
    textShadowColor: "rgba(255, 215, 0, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  cardContainer: {
    width: Dimensions.get("window").width * 0.85,
    minHeight: 350,
    backgroundColor: "rgba(255, 255, 255, 0.08)", // Glassmorphism
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  mysteryButton: {
    alignItems: "center",
    width: "100%",
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFD700",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  subText: {
    color: "#AAA",
    fontSize: 14,
    marginTop: 10,
    fontStyle: "italic",
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingText: {
    color: "#FFD700",
    fontSize: 18,
    marginTop: 15,
    fontStyle: "italic",
  },
  messageBox: {
    width: "100%",
    alignItems: "center",
  },
  messageText: {
    color: "#FFF",
    fontSize: 22,
    textAlign: "center",
    lineHeight: 32,
    fontWeight: "500",
    marginVertical: 15,
  },
  shareHint: {
    marginTop: 30,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
  shareText: {
    color: "#AAA",
    fontSize: 12,
  },
  spinner: {
    // Basit bir döndürme efekti gerekirse eklenebilir
  },
});
