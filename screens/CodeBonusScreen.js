import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function CodeBonusScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF9800" />
      
      <View style={styles.content}>
        <Text style={styles.icon}>🎮</Text>
        <Text style={styles.title}>Code Bonus</Text>
        <Text style={styles.subtitle}>Système de gamification</Text>
        
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>🚧 Bientôt disponible 🚧</Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Fonctionnalités à venir :</Text>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⭐</Text>
            <Text style={styles.featureText}>Gagne des points à chaque recherche</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🏆</Text>
            <Text style={styles.featureText}>Débloque des badges et récompenses</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎁</Text>
            <Text style={styles.featureText}>Ouvre des coffres mystères</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>Monte de niveau et deviens expert</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureText}>Complète des défis quotidiens</Text>
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
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 40,
  },
  comingSoonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
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
