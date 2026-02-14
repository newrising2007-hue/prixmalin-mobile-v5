import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const BACKEND_URL = 'https://prixmalin-backend.onrender.com';
// Pour tests locaux, utilise : 'http://192.168.0.73:10000'

// 10 CATÉGORIES DE PRODUITS
const CATEGORIES = [
  { id: 'epicerie', name: 'Épicerie', icon: require('../assets/icons/epicerie.png'), color: '#4CAF50' },
  { id: 'electro', name: 'Électro', icon: require('../assets/icons/electro.png'), color: '#2196F3' },
  { id: 'vetements', name: 'Vêtements', icon: require('../assets/icons/vetements.png'), color: '#E91E63' },
  { id: 'intime', name: 'Intime', icon: require('../assets/icons/intime.png'), color: '#FF69B4' },
  { id: 'quincaillerie', name: 'Quincaillerie', icon: require('../assets/icons/quincaillerie.png'), color: '#FF9800' },
  { id: 'loisirs', name: 'Loisirs & Culture', icon: require('../assets/icons/loisirs_culture.png'), color: '#9C27B0' },
  { id: 'animaux', name: 'Animaux', icon: require('../assets/icons/coin_animal.png'), color: '#00BCD4' },
  { id: 'sante', name: 'Santé & Optique', icon: require('../assets/icons/Soin_optique.png'), color: '#FF5722' },
  { id: 'sport', name: 'Sport & Nature', icon: require('../assets/icons/Sportnature.png'), color: '#8BC34A' },
  { id: 'vehicules', name: 'Véhicules', icon: require('../assets/icons/vehicules.png'), color: '#607D8B' },
];

export default function SearchScreen() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !selectedCategory) {
      alert('Veuillez sélectionner une catégorie et entrer un produit');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/search-prices`, {
        query: searchQuery,
        category: selectedCategory.id,
        location: {
          latitude: 45.5017,
          longitude: -73.5673
        }
      });

      setResults(response.data.products || []);
      setSearchQuery(''); // Vide la barre de recherche après les résultats
    } catch (error) {
      console.error('Erreur de recherche:', error);
      alert('Erreur lors de la recherche. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const CategoryButton = ({ category }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory?.id === category.id && styles.categoryButtonSelected,
        { borderColor: category.color }
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Image source={category.icon} style={styles.categoryIcon} />
      <Text style={[
        styles.categoryText,
        selectedCategory?.id === category.id && styles.categoryTextSelected
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* CATÉGORIES */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Choisis une catégorie</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {CATEGORIES.map(category => (
            <CategoryButton key={category.id} category={category} />
          ))}
        </ScrollView>
      </View>

      {/* BARRE DE RECHERCHE */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder={selectedCategory ? `Rechercher dans ${selectedCategory.name}...` : "Sélectionne une catégorie d'abord"}
          value={searchQuery}
          onChangeText={setSearchQuery}
          editable={!!selectedCategory}
        />
        <TouchableOpacity 
          style={[styles.searchButton, loading && styles.cancelButton]}
          onPress={loading ? () => setLoading(false) : handleSearch}
          disabled={!selectedCategory}
        >
          <Text style={styles.searchButtonText}>
            {loading ? '✖️' : '🔍'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* RÉSULTATS */}
      <View style={styles.resultsSection}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Recherche en cours...</Text>
          </View>
        ) : results.length > 0 ? (
          <>
            <Text style={styles.resultsTitle}>
              {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
            </Text>
            <FlatList
              data={results}
              renderItem={({ item }) => <ProductCard product={item} />}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.emptyText}>
              {selectedCategory 
                ? 'Commence une recherche pour voir les meilleurs prix !'
                : 'Sélectionne une catégorie pour commencer'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  categoriesSection: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoriesScroll: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    minWidth: 100,
  },
  categoryButtonSelected: {
    backgroundColor: '#e8f5e9',
    borderWidth: 2,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  searchSection: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  searchButtonText: {
    fontSize: 24,
  },
  resultsSection: {
    flex: 1,
    padding: 15,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  productStore: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
