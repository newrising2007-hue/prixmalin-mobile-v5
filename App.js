// v5.0 - Build Fresh
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import { COLORS } from './styles/colors';

const BACKEND_URL = 'https://prixmalin-backend.onrender.com';

// Les 6 catégories actives v5.0
const CATEGORIES = [
  { id: 'epicerie', name: '🛒 Épicerie', icon: require('./assets/icons/epicerie.png') },
  { id: 'electro', name: '⚡ Électronique', icon: require('./assets/icons/electro.png') },
  { id: 'vetements', name: '👕 Vêtements', icon: require('./assets/icons/vetements.png') },
  { id: 'intime', name: '💋 Intime', icon: require('./assets/icons/intime.png') },
  { id: 'quincaillerie', name: '🔧 Quincaillerie', icon: require('./assets/icons/quincaillerie.png') },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('epicerie');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction de recherche
  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Veuillez entrer un produit à rechercher');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // Coordonnées Abitibi-Témiscamingue (par défaut)
      const latitude = 48.0;
      const longitude = -79.0;

      const response = await axios.post(`${BACKEND_URL}/api/search-prices`, {
        query: query.trim(),
        category: selectedCategory,
        latitude,
        longitude,
      });

      if (response.data && response.data.results) {
        setResults(response.data.results);
        
        if (response.data.results.length === 0) {
          setError('Aucun résultat trouvé. Essayez un autre produit.');
        }
      }
    } catch (err) {
      console.error('Erreur recherche:', err);
      setError(
        err.response?.data?.error || 
        'Erreur de connexion au serveur. Vérifiez votre connexion internet.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PrixMalin</Text>
          <Text style={styles.subtitle}>Trouvez les meilleurs prix au Canada 🇨🇦</Text>
        </View>

        {/* Sélection catégorie */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.categoryLabel}>Catégorie :</Text>
          <View style={styles.categories}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat.id && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === cat.id && styles.categoryButtonTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ex: pain, laptop, marteau..."
            placeholderTextColor={COLORS.textSecondary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>
              {loading ? '⏳' : '🔍'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Message d'erreur */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Recherche en cours...</Text>
          </View>
        )}

        {/* Résultats */}
        {!loading && results.length > 0 && (
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.store}-${index}`}
          renderItem={({ item }) => <ProductCard item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading && !error && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>🔍</Text>
                <Text style={styles.emptyTitle}>Aucune recherche</Text>
                <Text style={styles.emptySubtitle}>
                  Sélectionnez une catégorie et recherchez un produit
                </Text>
              </View>
            )
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  categoriesContainer: {
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardBg,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 20,
  },
  errorContainer: {
    backgroundColor: '#FFE8E8',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
