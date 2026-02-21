import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

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

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={hasLink ? 0.7 : 1}
    >
      {/* IMAGE EN HAUT */}
      {hasImage && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            resizeMode="contain"
          />
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

        {/* Pas de badge si image (déjà affiché dessus) */}
        {!hasImage && (
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
  // IMAGE
  imageContainer: {
    height: 160,
    backgroundColor: '#1A1A2E',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '70%',
    height: '70%',
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
