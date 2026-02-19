import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';

export default function CouponsScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      
      <View style={styles.content}>
        <Text style={styles.icon}>💰</Text>
        <Text style={styles.title}>{t('nav.coupons')}</Text>
        <Text style={styles.subtitle}>{t('see_price')}</Text>
        
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>🚧 {t('searching')} 🚧</Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎟️</Text>
            <Text style={styles.featureText}>{t('nav.coupons')}</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>💳</Text>
            <Text style={styles.featureText}>{t('buy_now')}</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔔</Text>
            <Text style={styles.featureText}>{t('nav.alerts')}</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🏪</Text>
            <Text style={styles.featureText}>{t('local_store')}</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📋</Text>
            <Text style={styles.featureText}>{t('copy')}</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⏰</Text>
            <Text style={styles.featureText}>{t('expires')}</Text>
          </View>
        </View>

        <Text style={styles.footnote}>Phase 3</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  icon: { fontSize: 80, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#7f8c8d', marginBottom: 30 },
  comingSoon: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 40,
  },
  comingSoonText: { fontSize: 16, fontWeight: 'bold', color: '#2196F3' },
  featuresContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
  },
  feature: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  featureIcon: { fontSize: 24, marginRight: 10 },
  featureText: { fontSize: 14, color: '#34495e', flex: 1 },
  footnote: { marginTop: 30, fontSize: 12, color: '#95a5a6' },
});
