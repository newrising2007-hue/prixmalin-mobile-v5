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

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();

  const MENU_ITEMS = [
    {
      key: 'search',
      icon: require('../assets/icons/search-icon.png'),
      title: t('menu.search_title'),
      subtitle: t('menu.search_sub'),
      color: '#16a34a',
      screen: 'Search',
    },
    {
      key: 'epicerie',
      icon: '🏷️',
      title: t('menu.epicerie_title'),
      subtitle: t('menu.epicerie_sub'),
      color: '#10b981',
      screen: 'Epicerie',
    },
    {
      key: 'restaurants',
      icon: '🍽️',
      title: t('menu.restaurants_title'),
      subtitle: t('menu.restaurants_sub'),
      color: '#f97316',
      screen: 'Restaurants',
    },
    {
      key: 'gaming',
      icon: '🎮',
      title: t('menu.gaming_title'),
      subtitle: t('menu.gaming_sub'),
      color: '#8b5cf6',
      screen: 'GamingHub',
    },
    {
      key: 'partenaires',
      icon: '🤝',
      title: t('menu.partenaires_title'),
      subtitle: t('menu.partenaires_sub'),
      color: '#3b82f6',
      screen: 'Partenaires',
    },
  ];

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
          <Text style={styles.recrutementTitre}>{t('recrutement_titre')}</Text>
          <Text style={styles.recrutementSub}>{t('recrutement_sub')}</Text>
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
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  // ── MENU ──
  menuContainer: {
    flex: 1,
    padding: 12,
    paddingTop: 12,
  },
  menuButton: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 8,
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
    padding: 10,
  },
  menuIconEmoji: {
    fontSize: 32,
    marginRight: 12,
    width: 44,
    textAlign: 'center',
  },
  menuIconImage: {
    width: 44,
    height: 44,
    marginRight: 12,
    resizeMode: 'contain',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  menuArrow: {
    fontSize: 32,
    color: '#d1d5db',
    fontWeight: 'bold',
  },
  // ── RECRUTEMENT ──
  recrutement: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 4,
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
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
