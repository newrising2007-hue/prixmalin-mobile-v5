import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { COLORS } from '../styles/colors';

const ProductCard = ({ item }) => {
  const { config, storeData } = item;

  // Ouvrir Google Maps pour navigation
  const openGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url).catch((err) => console.error('Erreur Google Maps:', err));
  };

  // Ouvrir lien produit
  const openProductLink = (url) => {
    Linking.openURL(url).catch((err) => console.error('Erreur ouverture lien:', err));
  };

  return (
    <View style={styles.card}>
      {/* Image produit */}
      {item.image_url && (
        <Image 
          source={{ uri: item.image_url }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.info}>
        {/* Nom produit */}
        <Text style={styles.productName} numberOfLines={2}>
          {item.product_name}
        </Text>

        {/* Nom magasin */}
        <Text style={styles.storeName}>{item.store}</Text>

        {/* Prix SI displayPrice = true */}
        {config?.displayPrice && item.price && (
          <View style={styles.priceRow}>
            <Text style={styles.price}>{item.price}$</Text>
            <View style={styles.badgeVerified}>
              <Text style={styles.badgeTextVerified}>✅ Prix vérifié</Text>
            </View>
          </View>
        )}

        {/* Badge SI displayPrice = false */}
        {config && !config.displayPrice && (
          <View style={styles.badgeEstimated}>
            <Text style={styles.badgeTextEstimated}>⚠️ Prix sur le site</Text>
          </View>
        )}

        {/* Distance SI magasin physique */}
        {config?.hasPhysicalStores && storeData && (
          <View style={styles.locationInfo}>
            <Text style={styles.distance}>
              📍 {storeData.distance} km · {storeData.timeEstimate}
            </Text>
            <Text style={styles.address} numberOfLines={1}>
              {storeData.address}
            </Text>
          </View>
        )}

        {/* Info livraison SI e-commerce */}
        {config && !config.hasPhysicalStores && (
          <Text style={styles.delivery}>📦 Livraison disponible</Text>
        )}

        {/* Boutons d'action */}
        <View style={styles.buttons}>
          {/* Bouton Y Aller (Google Maps) */}
          {config?.hasPhysicalStores && storeData && (
            <TouchableOpacity 
              style={styles.mapsButton}
              onPress={() => openGoogleMaps(storeData.latitude, storeData.longitude)}
            >
              <Text style={styles.buttonText}>🗺️ Y Aller</Text>
            </TouchableOpacity>
          )}

          {/* Bouton principal (Acheter ou Voir Prix) */}
          <TouchableOpacity 
            style={[
              styles.productButton,
              config?.hasPhysicalStores && storeData ? styles.productButtonHalf : styles.productButtonFull
            ]}
            onPress={() => openProductLink(item.url)}
          >
            <Text style={styles.buttonText}>
              {config?.displayPrice && item.price
                ? `🛒 ${config.hasPhysicalStores ? 'Acheter' : 'Commander'} ${item.price}$`
                : '🔗 Voir le Prix'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.background,
  },
  info: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  storeName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.success,
    marginRight: 8,
  },
  badgeVerified: {
    backgroundColor: COLORS.badgeVerified,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextVerified: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.success,
  },
  badgeEstimated: {
    backgroundColor: COLORS.badgeEstimated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeTextEstimated: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.warning,
  },
  locationInfo: {
    marginBottom: 8,
  },
  distance: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  address: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  delivery: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  mapsButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  productButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  productButtonHalf: {
    flex: 2,
  },
  productButtonFull: {
    flex: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductCard;
