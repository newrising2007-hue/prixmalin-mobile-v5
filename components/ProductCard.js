import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

// Couleurs par marque - 100% local, zéro réseau requis
const BRAND_COLORS = {
  'yamaha':      { bg: '#CC0000', text: 'YAMAHA', emoji: '🏍️' },
  'suzuki':      { bg: '#003087', text: 'SUZUKI', emoji: '🏍️' },
  'arctic cat':  { bg: '#003087', text: 'ARCTIC CAT', emoji: '🏂' },
  'ski-doo':     { bg: '#FFD700', text: 'SKI-DOO', emoji: '🛷', textColor: '#000' },
  'can-am':      { bg: '#CC0000', text: 'CAN-AM', emoji: '🏍️' },
  'sea-doo':     { bg: '#0066CC', text: 'SEA-DOO', emoji: '🚤' },
  'honda':       { bg: '#CC0000', text: 'HONDA', emoji: '🏍️' },
  'kawasaki':    { bg: '#00A651', text: 'KAWASAKI', emoji: '🏍️' },
  'ktm':         { bg: '#FF6600', text: 'KTM', emoji: '🏍️' },
  'polaris':     { bg: '#003087', text: 'POLARIS', emoji: '🏂' },
  'cfmoto':      { bg: '#CC0000', text: 'CFMOTO', emoji: '🏍️' },
  'lynx':        { bg: '#FFD700', text: 'LYNX', emoji: '🛷', textColor: '#000' },
  'husqvarna':   { bg: '#0000CD', text: 'HUSQVARNA', emoji: '🏍️' },
  'ford':        { bg: '#003087', text: 'FORD', emoji: '🚗' },
  'toyota':      { bg: '#CC0000', text: 'TOYOTA', emoji: '🚗' },
  'facebook marketplace': { bg: '#1877F2', text: 'Facebook Marketplace', emoji: '🛒' },
  'kijiji':      { bg: '#FF6600', text: 'Kijiji', emoji: '🏷️' },
  'amazon.ca':   { bg: '#FF9900', text: 'Amazon.ca', emoji: '📦', textColor: '#000' },
  'walmart.ca':  { bg: '#0071CE', text: 'Walmart.ca', emoji: '🛒' },
};

function getBrandDisplay(product) {
  const storeLower = (product.store || '').toLowerCase();
  const nameLower = (product.product_name || '').toLowerCase();

  for (const [brand, info] of Object.entries(BRAND_COLORS)) {
    if (storeLower.includes(brand) || nameLower.includes(brand)) {
      return info;
    }
  }
  return { bg: '#1A1A2E', text: product.store || 'Véhicule', emoji: '🚗' };
}

const ProductCard = ({ product }) => {
  const { t } = useTranslation();

  const getBadgeInfo = () => {
    if (product.verified) {
      return { text: '✓ Vérifié', color: '#2ECC71' };
    } else if (product.type === 'marketplace') {
      return { text: `🏷️ ${product.badge || 'USAGÉ'}`, color: product.badge_color || '#1877F2' };
    } else if (product.type === 'local_with_website') {
      return { text: `🏪 ${t('local_store')}`, color: '#4CAF50' };
    } else if (product.type === 'local_no_website') {
      return { text: `📍 ${t('local_store')}`, color: '#FF9800' };
    } else if (product.affiliationType === 'online') {
      return { text: `🌐 ${t('online')}`, color: '#2196F3' };
    }
    return { text: `✅ ${t('see_price')}`, color: '#757575' };
  };

  const getLink = () => product.affiliateLink || product.affiliate_url || product.website || product.url || null;

  const getButtonColor = () => {
    if (product.verified) return '#2ECC71';
    if (product.store === 'Facebook Marketplace') return '#1877F2';
    if (product.store === 'Kijiji') return '#FF6600';
    if (product.store === 'Amazon.ca') return '#FF9900';
    if (product.store === 'Walmart') return '#0071CE';
    return '#2196F3';
  };

  const handlePress = () => {
    const link = getLink();
    if (link) {
      Linking.openURL(link).catch(err => console.error('Erreur ouverture lien:', err));
    }
  };

  const badge = getBadgeInfo();
  const hasLink = !!getLink();
  const hasImage = !!product.image_url;
  const brandDisplay = getBrandDisplay(product);

  // Affiche bannière colorée si catégorie véhicule OU si image_url présente
  const showBanner = hasImage || product.type === 'marketplace' || product.verified ||
    product.type === 'local_with_website' || product.type === 'local_no_website';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={hasLink ? 0.7 : 1}
    >
      {/* BANNIÈRE COLORÉE EN HAUT */}
      {showBanner && (
        <View style={[styles.imageContainer, { backgroundColor: brandDisplay.bg }]}>
          <Text style={[styles.brandEmoji]}>{brandDisplay.emoji}</Text>
          <Text style={[styles.brandText, { color: brandDisplay.textColor || '#FFFFFF' }]}>
            {brandDisplay.text}
          </Text>
          {/* Badge vérifié sur l'image */}
          <View style={[styles.imgBadge, { backgroundColor: badge.color }]}>
            <Text style={styles.imgBadgeText}>{badge.text}</Text>
          </View>
          {/* Distance sur l'image */}
          {product.distance ? (
            <View style={styles.imgDistance}>
              <Text style={styles.imgDistanceText}>🚗 {product.distance}</Text>
            </View>
          ) : null}
        </View>
      )}

      {/* CORPS DE LA CARTE */}
      <View style={styles.body}>
        <Text style={styles.storeName} numberOfLines={1}>
          {product.store}
        </Text>

        <Text style={styles.productName} numberOfLines={2}>
          {product.product_name?.replace(`${product.store} - `, '').replace(` - ${product.store}`, '')}
        </Text>

        {product.address ? (
          <Text style={styles.info}>📌 {product.address}</Text>
        ) : null}

        {product.phone ? (
          <Text style={styles.info}>📞 {product.phone}</Text>
        ) : null}

        {product.rating ? (
          <Text style={styles.rating}>⭐ {product.rating}/5</Text>
        ) : null}

        {product.price ? (
          <Text style={styles.price}>{product.price}$</Text>
        ) : (
          <Text style={styles.noPrice}>{t('see_price')}</Text>
        )}

        {/* Badge si pas de bannière */}
        {!showBanner && (
          <View style={[styles.badge, { backgroundColor: badge.color }]}>
            <Text style={styles.badgeText}>{badge.text}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: hasLink ? getButtonColor() : '#bdbdbd' }]}
          onPress={handlePress}
          disabled={!hasLink}
        >
          <Text style={styles.actionButtonText}>
            {hasLink ? `${t('visit_site')} →` : t('no_results')}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  // BANNIÈRE
  imageContainer: {
    height: 160,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  imgBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  imgBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  imgDistance: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  imgDistanceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  // CORPS
  body: {
    padding: 14,
  },
  storeName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  info: {
    fontSize: 13,
    color: '#555',
    marginBottom: 3,
  },
  rating: {
    fontSize: 13,
    color: '#FFA000',
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2ECC71',
    marginBottom: 8,
  },
  noPrice: {
    fontSize: 13,
    color: '#FF9800',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ProductCard;
