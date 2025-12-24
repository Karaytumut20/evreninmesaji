import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import * as Sharing from "expo-sharing";
import * as StoreReview from "expo-store-review"; // YENİ EKLENDİ
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";
import ViewShot from "react-native-view-shot";

// --- GEÇİŞ REKLAMI ID ---
// Buraya '/' işaretli Interstitial ID'ni yaz:
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-4816381866965413/3605203430";

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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
  const [dailyMessage, setDailyMessage] = useState<string>("");
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkingStorage, setCheckingStorage] = useState<boolean>(true);
  const [adLoaded, setAdLoaded] = useState<boolean>(false);

  const viewShotRef = useRef<any>(null);

  useEffect(() => {
    checkDailyStatus();
    scheduleDailyNotification();

    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setAdLoaded(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setAdLoaded(false);
        interstitial.load();
        revealMessage();
      }
    );

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const scheduleDailyNotification = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") return;
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Evrenin Mesajı 🌙",
        body: "Bugün senin için ne fısıldıyor? Hemen keşfet!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
      } as any,
    });
  };

  const checkDailyStatus = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const storedDate = await AsyncStorage.getItem("lastDate");
      const storedMessage = await AsyncStorage.getItem("savedMessage");

      if (storedDate === today && storedMessage) {
        setDailyMessage(storedMessage);
        setIsRevealed(true);
      }
    } catch (e) {
      console.log("Hata", e);
    } finally {
      setCheckingStorage(false);
    }
  };

  const handlePress = () => {
    if (isRevealed) {
      Alert.alert("Mesajın Burada", "Evrenin bugünkü mesajı zaten ekranında.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (adLoaded) {
      interstitial.show();
    } else {
      revealMessage();
    }
  };

  const revealMessage = () => {
    setLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      const newMessage = messages[randomIndex];

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setDailyMessage(newMessage);
      setIsRevealed(true);
      setLoading(false);
      saveData(newMessage);
    }, 1500);
  };

  const saveData = async (msg: string) => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      await AsyncStorage.setItem("lastDate", today);
      await AsyncStorage.setItem("savedMessage", msg);

      const currentHistoryStr = await AsyncStorage.getItem("messageHistory");
      let currentHistory = currentHistoryStr
        ? JSON.parse(currentHistoryStr)
        : [];

      const alreadySaved = currentHistory.some(
        (item: any) => item.date === today
      );
      if (!alreadySaved) {
        currentHistory.unshift({ date: today, message: msg });
        await AsyncStorage.setItem(
          "messageHistory",
          JSON.stringify(currentHistory)
        );
      }
    } catch (e) {
      console.log("Kaydetme hatası", e);
    }
  };

  const shareImage = async () => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Evrenin Mesajını Paylaş",
        });
      }
    } catch (error) {
      Alert.alert("Hata", "Görüntü paylaşılamadı.");
    }
  };

  // --- OYLAMA FONKSİYONU ---
  const handleRateUs = async () => {
    if (await StoreReview.hasAction()) {
      StoreReview.requestReview();
    } else {
      Alert.alert("Teşekkürler", "Desteğin için teşekkür ederiz!");
    }
  };

  if (checkingStorage) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: "#1a0033",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a0033" />

      <LinearGradient
        colors={["#1a0033", "#2d004d", "#000000"]}
        style={styles.background}
      >
        <View style={styles.header}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={handleRateUs} style={styles.rateButton}>
              <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
            </TouchableOpacity>
          </View>

          <MaterialCommunityIcons
            name="moon-waning-crescent"
            size={50}
            color="#FFD700"
            style={styles.shadow}
          />
          <Text style={styles.title}>EVRENİN MESAJI</Text>
          <Text style={styles.subtitle}>2026 Spiritüel Rehber</Text>
        </View>

        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", quality: 0.9 }}
          style={{ backgroundColor: "transparent" }}
        >
          <View style={styles.cardContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color="#FFD700"
                  style={{ marginBottom: 20 }}
                />
                <Text style={styles.loadingText}>Enerji taranıyor...</Text>
              </View>
            ) : isRevealed ? (
              <View style={styles.messageBox}>
                <Text style={styles.dateText}>
                  {new Date().toLocaleDateString("tr-TR")}
                </Text>
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

                <View style={{ marginTop: 10, alignItems: "center" }}>
                  <Text style={{ color: "#666", fontSize: 10 }}>
                    @EvreninMesajiApp
                  </Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.mysteryButton}
                onPress={handlePress}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons
                    name="fingerprint"
                    size={60}
                    color="#1a0033"
                  />
                </View>
                <Text style={styles.buttonText}>Mesajını Al</Text>
                <Text style={styles.subText}>(Parmağını bas ve odaklan)</Text>
              </TouchableOpacity>
            )}
          </View>
        </ViewShot>

        {isRevealed && (
          <TouchableOpacity style={styles.shareButton} onPress={shareImage}>
            <LinearGradient
              colors={["#FFD700", "#FFA500"]}
              style={styles.shareGradient}
            >
              <MaterialCommunityIcons
                name="instagram"
                size={24}
                color="#1a0033"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.shareText}>Hikayende Paylaş</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  header: { alignItems: "center", marginBottom: 30, width: "100%" },
  topRow: { position: "absolute", top: 10, right: 20, zIndex: 10 },
  rateButton: { padding: 10 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700",
    letterSpacing: 2,
    marginTop: 10,
    textShadowColor: "rgba(255, 215, 0, 0.6)",
    textShadowRadius: 15,
  },
  subtitle: { color: "#D8BFD8", fontSize: 14, marginTop: 5, letterSpacing: 1 },
  shadow: { textShadowColor: "rgba(255, 215, 0, 0.8)", textShadowRadius: 20 },
  cardContainer: {
    width: Dimensions.get("window").width * 0.85,
    minHeight: 380,
    backgroundColor: "rgba(20, 0, 40, 0.8)",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },
  mysteryButton: { alignItems: "center", width: "100%" },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFD700",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#FFD700",
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  buttonText: { color: "#FFF", fontSize: 26, fontWeight: "bold" },
  subText: { color: "#AAA", fontSize: 14, marginTop: 10, fontStyle: "italic" },
  loadingContainer: { alignItems: "center" },
  loadingText: { color: "#FFD700", fontSize: 20, fontWeight: "600" },
  messageBox: { width: "100%", alignItems: "center" },
  messageText: {
    color: "#FFF",
    fontSize: 22,
    textAlign: "center",
    lineHeight: 32,
    fontWeight: "500",
    marginVertical: 15,
  },
  dateText: { color: "#AAA", fontSize: 14, marginBottom: 10, letterSpacing: 2 },
  shareButton: { marginTop: 30, width: "70%" },
  shareGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 25,
  },
  shareText: { color: "#1a0033", fontWeight: "bold", fontSize: 16 },
});
