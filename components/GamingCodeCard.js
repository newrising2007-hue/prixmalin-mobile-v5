import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

const GamingCodeCard = ({ deal }) => {
  const { t } = useTranslation();

  const handleBuyPress = (link) => {
    Linking.openURL(link).catch(err => console.error('Erreur ouverture lien:', err));
  };

  const getBadgeColor = () => {
    if (deal.discount >= 50) return '#FF4444';
    if (deal.discount >= 30) return '#FF9800';
    if (deal.discount >= 10) return '#4CAF50';
    return '#2196F3';
  };

  const getCategoryIcon = () => {
    switch(deal.category) {
      case 'subscription': return '📅';
      case 'giftcard': return '💳';
      case 'virtualcurrency': return '💎';
      case 'game': return '🎮';
      case 'hardware': return '🖥️';
      default: return '🎁';
    }
  };

  const formatPrice = (price) => {
    return price === 0 ? t('free') : `${price.toFixed(2)}$`;
  };

  return (
    <View style={styles.card}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>{getCategoryIcon()}</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>{deal.name}</Text>
          <Text style={styles.platform}>{deal.platform || deal.type}</Text>
        </View>
        {deal.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>🔥 HOT</Text>
          </View>
        )}
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>{deal.description}</Text>

      {/* Bonus */}
      {deal.bonus && (
        <View style={styles.bonusContainer}>
          <Text style={styles.bonusText}>🎁 {deal.bonus}</Text>
        </View>
      )}

      {/* Prix */}
      <View style={styles.priceContainer}>
        {deal.discount > 0 ? (
          <>
            <Text style={styles.oldPrice}>{deal.regularPrice.toFixed(2)}$</Text>
            <Text style={styles.newPrice}>{formatPrice(deal.dealPrice)}</Text>
            <View style={[styles.discountBadge, { backgroundColor: getBadgeColor() }]}>
              <Text style={styles.discountText}>-{deal.discount}%</Text>
            </View>
          </>
        ) : (
          <Text style={styles.regularPrice}>{formatPrice(deal.regularPrice)}</Text>
        )}
      </View>

      {/* Économies */}
      {deal.savings > 0 && (
        <Text style={styles.savings}>💰 {deal.savings.toFixed(2)}$</Text>
      )}

      {/* Retailers */}
      <View style={styles.retailersContainer}>
        <Text style={styles.retailersLabel}>{t('visit_site')} :</Text>
        {deal.retailers.slice(0, 2).map((retailer, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.retailerButton,
              retailer.type === 'local' ? styles.localRetailer : styles.onlineRetailer
            ]}
            onPress={() => handleBuyPress(retailer.affiliateLink)}
          >
            <Text style={styles.retailerName}>
              {retailer.type === 'local' ? '🏪' : '🌐'} {retailer.name}
            </Text>
            {!retailer.stock && (
              <Text style={styles.outOfStock}>{t('no_results')}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Expiration */}
      {deal.expires && (
        <Text style={styles.expires}>
          ⏰ {t('expires')} : {new Date(deal.expires).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  icon: { fontSize: 32, marginRight: 12 },
  titleContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  platform: { fontSize: 12, color: '#666' },
  featuredBadge: { backgroundColor: '#FF4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  featuredText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  description: { fontSize: 14, color: '#555', marginBottom: 12, lineHeight: 20 },
  bonusContainer: { backgroundColor: '#FFF3CD', padding: 8, borderRadius: 6, marginBottom: 12 },
  bonusText: { fontSize: 12, color: '#856404', fontWeight: '600' },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  oldPrice: { fontSize: 14, color: '#999', textDecorationLine: 'line-through', marginRight: 8 },
  newPrice: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginRight: 8 },
  regularPrice: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  discountBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  discountText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  savings: { fontSize: 14, color: '#4CAF50', fontWeight: '600', marginBottom: 12 },
  retailersContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  retailersLabel: { fontSize: 12, color: '#666', marginBottom: 8 },
  retailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  localRetailer: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#4CAF50' },
  onlineRetailer: { backgroundColor: '#E3F2FD', borderWidth: 1, borderColor: '#2196F3' },
  retailerName: { fontSize: 14, fontWeight: '600', color: '#333' },
  outOfStock: { fontSize: 11, color: '#F44336', fontStyle: 'italic' },
  expires: { fontSize: 11, color: '#FF9800', marginTop: 8, fontStyle: 'italic' },
});

export default GamingCodeCard;
