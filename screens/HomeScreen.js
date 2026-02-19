import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();

  const MenuButton = ({ icon, title, subtitle, color, onPress }) => (
    <TouchableOpacity
      style={[styles.menuButton, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuButtonContent}>
        {typeof icon === 'string' ? (
          <Text style={styles.menuIcon}>{icon}</Text>
        ) : (
          <Image source={icon} style={styles.menuIconImage} />
        )}
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.menuArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require('../assets/icon.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>PrixMalin</Text>
        <Text style={styles.subtitle}>{t('tagline')}</Text>
      </View>

      {/* MENU PRINCIPAL */}
      <View style={styles.menuContainer}>

        <MenuButton
          icon="🔍"
          title={t('nav.search')}
          subtitle={t('home.subtitle')}
          color="#4CAF50"
          onPress={() => navigation.navigate('Search')}
        />

        <MenuButton
          icon={require('../assets/icons/deals_gaming.png')}
          title={t('nav.gaming_deals')}
          subtitle={t('gaming.deals_title')}
          color="#FFB300"
          onPress={() => navigation.navigate('Gaming')}
        />

        <MenuButton
          icon={require('../assets/icons/code_bonus.png')}
          title={t('nav.bonus_codes')}
          subtitle={t('gaming.codes_subtitle')}
          color="#4CAF50"
          onPress={() => navigation.navigate('CodeBonus')}
        />

        <MenuButton
          icon="💰"
          title={t('nav.coupons')}
          subtitle={t('nav.coupons')}
          color="#2196F3"
          onPress={() => navigation.navigate('Coupons')}
        />

        <MenuButton
          icon="📢"
          title={t('nav.alerts')}
          subtitle={t('nav.alerts')}
          color="#F44336"
          onPress={() => navigation.navigate('Alerts')}
        />

      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 5.0 - Février 2026</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 15,  // ← réduit de 30 à 15
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
    marginTop: 10, 
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  menuContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  menuButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  menuIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  menuIconImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  menuArrow: {
    fontSize: 40,
    color: '#bdc3c7',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
  },
});
