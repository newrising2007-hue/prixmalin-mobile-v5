import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const ProductCard = ({ product }) => {
  
  // Fonction pour obtenir les infos du badge selon le type d'affiliation
  const getBadgeInfo = () => {
    if (product.affiliationType === 'local_web') {
      return {
        text: '🏷️ Affiliation Locale',
        color: '#4CAF50',
      };
    } else if (product.affiliationType === 'local_maps') {
      return {
        text: '📍 Commerce Local',
        color: '#FF9800',
      };
    } else if (product.affiliationType === 'online') {
      return {
        text: '🌐 Partenaire En Ligne',
        color: '#2196F3',
      };
    }
    return {
      text: '✅ Prix vérifié',
      color: '#757575',
    };
  };

  // Fonction pour ouvrir le lien affilié
  const handlePress = () => {
  console.log('🔍 Clic détecté ! Lien:', product.affiliateLink);
    console.log
    if (product.affiliateLink) {
      Linking.openURL(product.affiliateLink)
        .catch(err => console.error('Erreur ouverture lien:', err));
    }
  };

  const badge = getBadgeInfo();

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.product_name}
        </Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>{product.price}$</Text>
      </View>

      <Text style={styles.store}>📍 {product.store}</Text>

      {product.distance && (
        <Text style={styles.distance}>🚗 {product.distance}</Text>
      )}

      <View style={[styles.badge, { backgroundColor: badge.color }]}>
        <Text style={styles.badgeText}>{badge.text}</Text>
      </View>

      <View style={styles.actionButton}>
        <Text style={styles.actionButtonText}>
          Voir le produit →
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  store: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    color: '#FF9800',
    marginBottom: 8,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductCard;
