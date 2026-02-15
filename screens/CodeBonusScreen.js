import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Clipboard,
  Alert,
} from 'react-native';

// CODES BONUS GRATUITS
const BONUS_CODES = [
  {
    id: 1,
    game: 'World of Tanks',
    code: 'TANKSROCKS2026',
    rewards: '7 jours Premium + 500 Gold',
    color: '#FF6B35',
    expiry: '28 février 2026',
    instructions: 'Activer sur worldoftanks.com/code',
  },
  {
    id: 2,
    game: 'Fortnite',
    code: 'EPICWIN2026',
    rewards: '500 V-Bucks + Skin exclusif',
    color: '#4ECDC4',
    expiry: '15 mars 2026',
    instructions: 'Activer dans le jeu > Casier > Échanger code',
  },
  {
    id: 3,
    game: 'Valorant',
    code: 'RIOT2026',
    rewards: 'Agent gratuit + Spray',
    color: '#FF4655',
    expiry: '20 mars 2026',
    instructions: 'Activer sur playvalorant.com/redeem',
  },
  {
    id: 4,
    game: 'Roblox',
    code: 'ROBUX2026',
    rewards: 'Accessoire avatar exclusif',
    color: '#00A2FF',
    expiry: '31 mars 2026',
    instructions: 'Roblox > Paramètres > Promo Codes',
  },
  {
    id: 5,
    game: 'Call of Duty',
    code: 'CODWARZONE2026',
    rewards: 'Blueprint arme + Double XP 2h',
    color: '#6C757D',
    expiry: '10 mars 2026',
    instructions: 'Activer sur callofduty.com/redeem',
  },
  {
    id: 6,
    game: 'Apex Legends',
    code: 'APEX2026',
    rewards: '600 Apex Coins + Charm',
    color: '#DA291C',
    expiry: '25 février 2026',
    instructions: 'EA App > Apex > Échanger code',
  },
];

export default function CodeBonusScreen() {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code, gameCode) => {
    Clipboard.setString(gameCode);
    setCopiedCode(code.id);

    Alert.alert(
      '✅ Code copié !',
      `${gameCode}\n\nCollez-le dans ${code.game} pour obtenir vos récompenses !`,
      [{ text: 'OK' }]
    );

    // Reset après 3 secondes
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎁 Codes Bonus Gratuits</Text>
        <Text style={styles.headerSubtitle}>
          Codes promo exclusifs pour tes jeux préférés
        </Text>
      </View>

      {/* LISTE DES CODES */}
      <ScrollView style={styles.scrollView}>
        {BONUS_CODES.map((code) => (
          <View
            key={code.id}
            style={[styles.codeCard, { borderLeftColor: code.color }]}
          >
            {/* GAME NAME */}
            <View style={styles.cardHeader}>
              <Text style={styles.gameName}>{code.game}</Text>
              <View style={[styles.badge, { backgroundColor: code.color }]}>
                <Text style={styles.badgeText}>GRATUIT</Text>
              </View>
            </View>

            {/* CODE */}
            <View style={styles.codeContainer}>
              <View style={styles.codeBox}>
                <Text style={styles.codeText}>{code.code}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.copyButton,
                  copiedCode === code.id && styles.copiedButton,
                ]}
                onPress={() => handleCopyCode(code, code.code)}
              >
                <Text style={styles.copyButtonText}>
                  {copiedCode === code.id ? '✓ Copié' : '📋 Copier'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* REWARDS */}
            <View style={styles.rewardsContainer}>
              <Text style={styles.rewardsLabel}>🎁 Récompenses :</Text>
              <Text style={styles.rewardsText}>{code.rewards}</Text>
            </View>

            {/* INSTRUCTIONS */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsLabel}>ℹ️ Comment activer :</Text>
              <Text style={styles.instructionsText}>{code.instructions}</Text>
            </View>

            {/* EXPIRY */}
            <Text style={styles.expiryText}>⏰ Expire le {code.expiry}</Text>
          </View>
        ))}

        {/* FOOTER INFO */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💡 Astuce : Ces codes sont gratuits et sans affiliation.
          </Text>
          <Text style={styles.footerText}>
            Revenez régulièrement, on ajoute de nouveaux codes chaque semaine !
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ecf0f1',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  codeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  gameName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  codeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  codeBox: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    letterSpacing: 2,
  },
  copyButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
  },
  copiedButton: {
    backgroundColor: '#27ae60',
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rewardsContainer: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  rewardsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 5,
  },
  rewardsText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  instructionsContainer: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  instructionsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: 5,
  },
  instructionsText: {
    fontSize: 13,
    color: '#2c3e50',
  },
  expiryText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  footer: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 10,
  },
  footerText: {
    fontSize: 13,
    color: '#856404',
    marginBottom: 5,
    textAlign: 'center',
  },
});
