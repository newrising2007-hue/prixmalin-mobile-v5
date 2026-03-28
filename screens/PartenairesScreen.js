import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

const BACKEND_URL = 'https://prixmalin-backend.onrender.com';

export default function PartenairesScreen() {
  const [partenaires, setPartenaires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/partenaires`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setPartenaires(data.partenaires);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const ouvrirCirculaire = (url) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8faf8" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤝 Partenaires locaux</Text>
        <Text style={styles.headerSubtitle}>Rabais exclusifs PrixMalin</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? (
          <ActivityIndicator size="large" color="#2eaabf" style={{ marginTop: 40 }} />
        ) : (
          <>
            {partenaires.map((p) => (
              <TouchableOpacity
                key={p.slug}
                style={styles.carte}
                onPress={() => ouvrirCirculaire(p.url)}
                activeOpacity={0.85}
              >
                {/* Bande couleur top */}
                <View style={[styles.bandeCouleur, { backgroundColor: p.couleur }]} />

                {/* Logo */}
                <View style={styles.logoContainer}>
                  <Image
                    source={{ uri: p.logo_url }}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>

                {/* Info */}
                <View style={styles.info}>
                  <Text style={styles.nom}>{p.nom}</Text>
                  {p.ville ? <Text style={styles.ville}>📍 {p.ville}</Text> : null}
                  <Text style={styles.slogan}>{p.slogan}</Text>
                </View>

                {/* Bouton circulaire */}
                <View style={[styles.bouton, { backgroundColor: p.couleur }]}>
                  <Text style={styles.boutonTexte}>Voir la circulaire →</Text>
                </View>

                {/* Badge coupon */}
                <View style={styles.badge}>
                  <Text style={styles.badgeTexte}>🏷️ Rabais sur produits désignés</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Placeholder futur partenaire */}
            <View style={styles.carteProchaine}>
              <Text style={styles.prochaineEmoji}>🚧</Text>
              <Text style={styles.prochaineTexte}>Prochain partenaire à venir</Text>
            </View>
          </>
        )}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  scroll: {
    padding: 16,
    gap: 16,
  },
  carte: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  bandeCouleur: {
    height: 5,
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 75,
  },
  info: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  nom: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  ville: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  slogan: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 18,
  },
  bouton: {
    margin: 16,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  boutonTexte: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  badge: {
    backgroundColor: '#f0fbfd',
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0f5f8',
  },
  badgeTexte: {
    fontSize: 13,
    color: '#1d8fa3',
    fontWeight: '600',
  },
  carteProchaine: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  prochaineEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  prochaineTexte: {
    fontSize: 15,
    color: '#9ca3af',
    fontWeight: '500',
  },
});
