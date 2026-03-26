import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';

const GAMING_LINKS = [
  {
    emoji: '🛒',
    title: 'Produits Gaming',
    subtitle: 'Claviers, souris, casques et plus',
    url: 'https://prixmalin.ca/produits',
    color: '#8b5cf6',
  },
  {
    emoji: '🎁',
    title: 'Codes Bonus',
    subtitle: 'Codes exclusifs pour gamers canadiens',
    url: 'https://prixmalin.ca/codes-bonus',
    color: '#16a34a',
  },
  {
    emoji: '💳',
    title: 'Cartes Cadeaux & Abonnements',
    subtitle: 'Xbox, PlayStation, Steam et plus',
    url: 'https://prixmalin.ca/deals',
    color: '#f97316',
  },
];

export default function GamingHubScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8faf8" />

      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🎮</Text>
        <Text style={styles.headerTitle}>Gaming Hub</Text>
        <Text style={styles.headerSubtitle}>Tout le gaming PrixMalin</Text>
      </View>

      <View style={styles.linksContainer}>
        {GAMING_LINKS.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.linkCard, { borderLeftColor: item.color }]}
            onPress={() => Linking.openURL(item.url).catch(() => {})}
            activeOpacity={0.7}
          >
            <Text style={styles.linkEmoji}>{item.emoji}</Text>
            <View style={styles.linkText}>
              <Text style={styles.linkTitle}>{item.title}</Text>
              <Text style={styles.linkSubtitle}>{item.subtitle}</Text>
            </View>
            <View style={[styles.linkButton, { backgroundColor: item.color }]}>
              <Text style={styles.linkButtonText}>Voir →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.note}>
        <Text style={styles.noteText}>
          🌐 Le contenu gaming est géré sur prixmalin.ca — toujours à jour
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8faf8',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  linksContainer: {
    padding: 20,
    gap: 12,
  },
  linkCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderLeftWidth: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  linkEmoji: {
    fontSize: 36,
  },
  linkText: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  linkSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  linkButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  note: {
    margin: 20,
    padding: 14,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  noteText: {
    fontSize: 12,
    color: '#16a34a',
    textAlign: 'center',
    lineHeight: 18,
  },
});
