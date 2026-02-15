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

export default function HomeScreen({ navigation }) {
  const MenuButton = ({ icon, title, subtitle, color, onPress }) => (
    <TouchableOpacity
      style={[styles.menuButton, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuButtonContent}>
        <Text style={styles.menuIcon}>{icon}</Text>
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
        <Text style={styles.subtitle}>Économise sur tous tes achats au Canada</Text>
      </View>

      {/* MENU PRINCIPAL */}
      <View style={styles.menuContainer}>

        {/* BOUTON 1 - RECHERCHER */}
        <MenuButton
          icon="🔍"
          title="Rechercher"
          subtitle="Compare les prix de produits"
          color="#4CAF50"
          onPress={() => navigation.navigate('Search')}
        />

        {/* BOUTON 2 - DEALS GAMING */}
        <MenuButton
          icon={require('../assets/icons/deals_gaming.png')}
          title="Deals Gaming"
          subtitle="Game Pass, cartes-cadeaux, V-Bucks"
          color="🟡#FFB300"
          onPress={() => navigation.navigate('Gaming')}
        />

        {/* BOUTON 3 - CODES BONUS GRATUITS */}
        <MenuButton
          icon={require('../assets/icons/code_bonus.png')}
          title="Codes Bonus"
          subtitle="Codes promo gratuits World of Tanks, Fortnite..."
          color="🟢#4CAF50"
          onPress={() => navigation.navigate('CodeBonus')}
        />

        {/* BOUTON 4 - COUPONS & PROMOS */}
        <MenuButton
          icon="💰"
          title="Coupons & Promos"
          subtitle="Codes de rabais actifs"
          color="#2196F3"
          onPress={() => navigation.navigate('Coupons')}
        />

        {/* BOUTON 5 - ALERTES PRIX */}
        <MenuButton
          icon="📢"
          title="Alertes Prix"
          subtitle="Sois notifié des baisses de prix"
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
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
    marginBottom: 15,
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
    padding: 20,
  },
  menuIcon: {
    fontSize: 40,
    marginRight: 15,
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
