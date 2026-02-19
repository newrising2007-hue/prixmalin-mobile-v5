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
  Keyboard,
} from 'react-native';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';

const BACKEND_URL = 'https://prixmalin-backend.onrender.com';

const CATEGORIES = [
  { id: 'epicerie', icon: require('../assets/icons/epicerie.png'), color: '#4CAF50' },
  { id: 'electro', icon: require('../assets/icons/electro.png'), color: '#2196F3' },
  { id: 'vetements', icon: require('../assets/icons/vetements.png'), color: '#E91E63' },
  { id: 'intime', icon: require('../assets/icons/intime.png'), color: '#FF69B4' },
  { id: 'quincaillerie', icon: require('../assets/icons/quincaillerie.png'), color: '#FF9800' },
  { id: 'loisirs', icon: require('../assets/icons/loisirs_culture.png'), color: '#9C27B0' },
  { id: 'animaux', icon: require('../assets/icons/coin_animal.png'), color: '#00BCD4' },
  { id: 'sante', icon: require('../assets/icons/Soin_optique.png'), color: '#FF5722' },
  { id: 'sport', icon: require('../assets/icons/Sportnature.png'), color: '#8BC34A' },
  { id: 'vehicules', icon: require('../assets/icons/vehicules.png'), color: '#607D8B' },
  { id: 'divers', icon: require('../assets/icons/divers.png'), color: '#795548' },
];

export default function SearchScreen() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !selectedCategory) {
      alert(t('errors.no_results'));
      return;
    }

    Keyboard.dismiss();
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

      setResults(response.data.results || []);
      setSearchQuery('');
    } catch (error) {
      console.error('Erreur de recherche:', error);
      alert(t('errors.network'));
    } finally {
      setLoading(false);
    }
  };

  const CategoryButton = ({ category }) => {
    const isSelected = selectedCategory?.id === category.id;
    const name = t(`categories.${category.id}`);
    return (
      <TouchableOpacity
        onPress={() => setSelectedCategory(category)}
        activeOpacity={0.8}
      >
        <View style={[styles.categoryIconBox, { borderColor: category.color }]}>
          <Image source={category.icon} style={styles.categoryIcon} />
        </View>
        <View style={[styles.categoryDivider, { backgroundColor: category.color }]} />
        <View style={[
          styles.categoryNameBox,
          { borderColor: category.color },
          isSelected && { backgroundColor: category.color }
        ]}>
          <Text style={[
            styles.categoryText,
            isSelected && styles.categoryTextSelected
          ]}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* CATÉGORIES */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>{t('home.start_search')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {CATEGORIES.map(category => (
            <View key={category.id} style={styles.categoryWrapper}>
              <CategoryButton category={category} />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* BARRE DE RECHERCHE */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder={selectedCategory
            ? `${t('search_placeholder').replace('...', '')} ${t(`categories.${selectedCategory.id}`)}...`
            : t('search_placeholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          editable={!!selectedCategory}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
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
            <Text style={styles.loadingText}>{t('searching')}</Text>
          </View>
        ) : results.length > 0 ? (
          <>
            <Text style={styles.resultsTitle}>
              {results.length} {t('results_found')}
            </Text>
            <FlatList
              data={results}
              renderItem={({ item }) => <ProductCard product={item} />}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.emptyText}>
              {selectedCategory
                ? t('home.start_search')
                : t('search_placeholder')}
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
    paddingTop: 20,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  categoriesScrollContent: {
    paddingHorizontal: 15,
    alignItems: 'flex-start',
  },
  categoryWrapper: {
    marginHorizontal: 6,
  },
  categoryIconBox: {
    width: 90,
    height: 75,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  categoryIcon: {
    width: 82,
    height: 67,
    resizeMode: 'cover',
  },
  categoryDivider: {
    height: 1.5,
    width: 90,
  },
  categoryNameBox: {
    width: 90,
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 11,
    color: '#7f8c8d',
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 18,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 4,
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
    paddingTop: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
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
