import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const ProductCard = ({ product }) => {

  const getBadgeInfo = () => {
    if (product.affiliationType === 'local_web') {
      return { text: '🏷️ Affiliation Locale', color: '#4CAF50' };
    } else if (product.affiliationType === 'local_maps') {
      return { text: '📍 Commerce Local', color: '#FF9800' };
    } else if (product.affiliationType === 'online') {
      return { text: '🌐 Partenaire En Ligne', color: '#2196F3' };
    } else if (product.type === 'local_with_website') {
      return { text: '🏪 Commerce Local', color: '#4CAF50' };
    } else if (product.type === 'local_no_website') {
      return { text: '📍 Commerce Local', color: '#FF9800' };
    }
    return { text: '✅ Prix vérifié', color: '#757575' };
  };

  // Utilise affiliateLink, website, ou url — dans cet ordre
  const getLink = () => {
    return product.affiliateLink || product.website || product.url || null;
  };

  const handlePress = () => {
    const link = getLink();
    console.log('🔍 Clic détecté ! Lien:', link);
    if (link) {
      Linking.openURL(link).catch(err => console.error('Erreur ouverture lien:', err));
    } else {
      console.warn('⚠️ Aucun lien disponible pour ce produit');
    }
  };

  const badge = getBadgeInfo();
  const hasLink = !!getLink();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={hasLink ? 0.7 : 1}
    >
      <View style={styles.header}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.product_name}
        </Text>
      </View>

      {product.price ? (
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{product.price}$</Text>
        </View>
      ) : (
        <Text style={styles.noPrice}>Voir prix sur le site</Text>
      )}

      <Text style={styles.store}>📍 {product.store}</Text>

      {product.address ? (
        <Text style={styles.address}>📌 {product.address}</Text>
      ) : null}

      {product.distance ? (
        <Text style={styles.distance}>🚗 {product.distance}</Text>
      ) : null}

      {product.phone ? (
        <Text style={styles.phone}>📞 {product.phone}</Text>
      ) : null}

      {product.rating ? (
        <Text style={styles.rating}>⭐ {product.rating}/5</Text>
      ) : null}

      <View style={[styles.badge, { backgroundColor: badge.color }]}>
        <Text style={styles.badgeText}>{badge.text}</Text>
      </View>

      <View style={[styles.actionButton, !hasLink && styles.actionButtonDisabled]}>
        <Text style={styles.actionButtonText}>
          {hasLink ? 'Voir le produit →' : 'Aucun lien disponible'}
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
  noPrice: {
    fontSize: 14,
    color: '#FF9800',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  store: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    color: '#FF9800',
    marginBottom: 4,
    fontWeight: '600',
  },
  phone: {
    fontSize: 13,
    color: '#2196F3',
    marginBottom: 8,
  },
  rating: {
    fontSize: 13,
    color: '#FFC107',
    marginBottom: 8,
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
  actionButtonDisabled: {
    backgroundColor: '#bdbdbd',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductCard;
