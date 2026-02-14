import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  StatusBar 
} from 'react-native';
import GamingCodeCard from '../components/GamingCodeCard';
import gamingData from '../data/gaming-codes.json';

const GamingCodesScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('featured'); // featured, new, discount

  // Catégories disponibles
  const categories = [
    { id: 'all', name: 'Tous', icon: '🎮' },
    { id: 'subscription', name: 'Abonnements', icon: '📅' },
    { id: 'giftcard', name: 'Cartes-Cadeaux', icon: '💳' },
    { id: 'virtualcurrency', name: 'Monnaie Virtuelle', icon: '💎' },
    { id: 'game', name: 'Jeux', icon: '🎯' },
    { id: 'hardware', name: 'Matériel', icon: '🖥️' },
  ];

  // Filtrer les deals
  const getFilteredDeals = () => {
    let allDeals = [];
    
    // Rassembler tous les deals
    if (selectedCategory === 'all') {
      allDeals = [
        ...gamingData.subscriptions,
        ...gamingData.giftCards,
        ...gamingData.virtualCurrency,
        ...gamingData.games,
        ...gamingData.hardware,
      ];
    } else {
      switch(selectedCategory) {
        case 'subscription':
          allDeals = gamingData.subscriptions;
          break;
        case 'giftcard':
          allDeals = gamingData.giftCards;
          break;
        case 'virtualcurrency':
          allDeals = gamingData.virtualCurrency;
          break;
        case 'game':
          allDeals = gamingData.games;
          break;
        case 'hardware':
          allDeals = gamingData.hardware;
          break;
      }
    }

    // Appliquer les filtres
    if (selectedFilter === 'featured') {
      return allDeals.filter(deal => deal.featured);
    } else if (selectedFilter === 'discount') {
      return allDeals.sort((a, b) => b.discount - a.discount);
    } else {
      return allDeals;
    }
  };

  const filteredDeals = getFilteredDeals();

  // Statistiques
  const getTotalSavings = () => {
    return filteredDeals.reduce((total, deal) => total + deal.savings, 0);
  };

  const getBestDeal = () => {
    return filteredDeals.reduce((best, deal) => 
      deal.discount > best.discount ? deal : best
    , filteredDeals[0]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🎮 Codes Gaming</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Stats Banner */}
      <View style={styles.statsBanner}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredDeals.length}</Text>
          <Text style={styles.statLabel}>Deals actifs</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{getTotalSavings().toFixed(0)}$</Text>
          <Text style={styles.statLabel}>Économies totales</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>-{getBestDeal()?.discount || 0}%</Text>
          <Text style={styles.statLabel}>Meilleur deal</Text>
        </View>
      </View>

      {/* Filtres de catégories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryButton,
              selectedCategory === cat.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={[
              styles.categoryText,
              selectedCategory === cat.id && styles.categoryTextActive
            ]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filtres de tri */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'featured' && styles.filterButtonActive
          ]}
          onPress={() => setSelectedFilter('featured')}
        >
          <Text style={[
            styles.filterText,
            selectedFilter === 'featured' && styles.filterTextActive
          ]}>
            🔥 En vedette
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'discount' && styles.filterButtonActive
          ]}
          onPress={() => setSelectedFilter('discount')}
        >
          <Text style={[
            styles.filterText,
            selectedFilter === 'discount' && styles.filterTextActive
          ]}>
            💰 % Rabais
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'new' && styles.filterButtonActive
          ]}
          onPress={() => setSelectedFilter('new')}
        >
          <Text style={[
            styles.filterText,
            selectedFilter === 'new' && styles.filterTextActive
          ]}>
            ✨ Tous
          </Text>
        </TouchableOpacity>
      </View>

      {/* Liste des deals */}
      <ScrollView style={styles.dealsContainer}>
        {filteredDeals.length > 0 ? (
          filteredDeals.map((deal, index) => (
            <GamingCodeCard 
              key={deal.id || index} 
              deal={deal}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎮</Text>
            <Text style={styles.emptyText}>Aucun deal disponible</Text>
            <Text style={styles.emptySubtext}>Reviens bientôt pour de nouveaux codes !</Text>
          </View>
        )}
        
        {/* Padding bottom */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Codes mis à jour quotidiennement • Premier en Amérique du Nord 🇨🇦
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1976D2',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 60,
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  categoriesScroll: {
    marginTop: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  categoryButtonActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  dealsContainer: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});

export default GamingCodesScreen;
