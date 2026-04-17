import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

const MENU_ITEMS = [
  {
    key: 'search',
    icon: require('../assets/icons/search-icon.png'),
    title: 'Recherche',
    subtitle: 'Cherche ton prix',
    color: '#16a34a',
    screen: 'Search',
  },
  {
    key: 'restaurants',
    icon: '🍽️',
    title: 'Restaurants',
    subtitle: 'Découvrez les restos près de vous',
    color: '#f97316',
    screen: 'Restaurants',
  },
  {
    key: 'partenaires',
    icon: '🤝',
    title: 'Partenaires locaux',
    subtitle: 'Rabais exclusifs PrixMalin',
    color: '#3b82f6',
    screen: 'Partenaires',
  },
  {
    key: 'gaming',
    icon: '🎮',
    title: 'Gaming',
    subtitle: 'Produits, codes et deals gaming',
    color: '#8b5cf6',
    screen: 'GamingHub',
  },
];

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();

  const MenuButton = ({ item }) => (
    <TouchableOpacity
      style={[styles.menuButton, { borderLeftColor: item.color }]}
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.7}
    >
      <View style={styles.menuButtonContent}>
        {typeof item.icon === 'string' ? (
          <Text style={styles.menuIconEmoji}>{item.icon}</Text>
        ) : (
          <Image source={item.icon} style={styles.menuIconImage} />
        )}
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
        </View>
        <Text style={styles.menuArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8faf8" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>PrixMalin</Text>
          <Text style={styles.subtitle}>{t('tagline')}</Text>
        </View>

        {/* MENU */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map(item => (
            <MenuButton key={item.key} item={item} />
          ))}
        </View>

        {/* BLOC RECRUTEMENT PARTENAIRE */}
        <View style={styles.recrutement}>
          <Text style={styles.recrutementTitre}>Devenez partenaire local 🤝</Text>
          <Text style={styles.recrutementSub}>Rejoignez PrixMalin et attirez plus de clients</Text>
          <Text
            style={styles.recrutementEmail}
            onPress={() => Linking.openURL('mailto:partenaires@prixmalin.ca')}
          >
            partenaires@prixmalin.ca
          </Text>
        </View>
        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.1 — 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8faf8',
  },
  scrollContent: {
    flexGrow: 1,
  },

  // ── HEADER ──
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },

  // ── MENU ──
  menuContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 24,
  },
  menuButton: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  menuIconEmoji: {
    fontSize: 40,
    marginRight: 14,
    width: 52,
    textAlign: 'center',
  },
  menuIconImage: {
    width: 52,
    height: 52,
    marginRight: 14,
    resizeMode: 'contain',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  menuArrow: {
    fontSize: 36,
    color: '#d1d5db',
    fontWeight: 'bold',
  },

  // ── RECRUTEMENT ──
  recrutement: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 8,
  },
  recrutementTitre: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2eaabf',
    marginBottom: 6,
  },
  recrutementSub: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 10,
  },
  recrutementEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b5cf6',
    textDecorationLine: 'underline',
  },
  // ── FOOTER ──
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
