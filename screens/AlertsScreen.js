import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function AlertsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F44336" />
      
      <View style={styles.content}>
        <Text style={styles.icon}>📢</Text>
        <Text style={styles.title}>Alertes Prix</Text>
        <Text style={styles.subtitle}>Notifications de baisse de prix</Text>
        
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>🚧 Bientôt disponible 🚧</Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Fonctionnalités à venir :</Text>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔔</Text>
            <Text style={styles.featureText}>Crée des alertes personnalisées pour tes produits</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📉</Text>
            <Text style={styles.featureText}>Sois notifié dès qu'un prix baisse</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureText}>Fixe ton prix cible et reçois une alerte</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>Historique des variations de prix</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>Alertes en temps réel via notifications push</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🛍️</Text>
            <Text style={styles.featureText}>Suivi de plusieurs produits simultanément</Text>
          </View>
        </View>

        <Text style={styles.footnote}>Phase 3 - En développement</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
  },
  comingSoon: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 40,
  },
  comingSoonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
  },
  featuresContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#34495e',
    flex: 1,
  },
  footnote: {
    marginTop: 30,
    fontSize: 12,
    color: '#95a5a6',
  },
});
