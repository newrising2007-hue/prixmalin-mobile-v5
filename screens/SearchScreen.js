import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
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
  Keyboard,
  ScrollView,
  Linking,
} from 'react-native';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = 'https://prixmalin-backend.onrender.com';
const ONLINE_API_URL = 'https://prixmalin.ca/api/search';
const RECENT_SEARCHES_KEY = 'prixmalin_recent_searches';
const GPS_FALLBACK = { latitude: 47.3283, longitude: -79.4338 };

// ── NORMALISATION QUERY ──────────────────────────────────────────────
// Retire accents, tirets, espaces multiples avant envoi au backend
function normalizeQuery(query) {
  return query
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

// ── DÉTECTION AUTOMATIQUE DE CATÉGORIE ──────────────────────────────
const CATEGORY_KEYWORDS = {
  vehicules: [
    'voiture', 'auto', 'camion', 'moto', 'motocyclette', 'motoneige',
    'ski-doo', 'skidoo', 'vtt', 'quad', 'bateau', 'chaloupe', 'kayak',
    'canot', 'sea-doo', 'seadoo', 'can-am', 'canam', 'yamaha', 'honda',
    'kawasaki', 'suzuki', 'polaris', 'arctic cat', 'bombardier', 'brp',
    'lynx', 'ktm', 'husqvarna', 'ford', 'toyota', 'chevrolet', 'dodge',
    'gmc', 'ram', 'jeep', 'hyundai', 'kia', 'mazda', 'nissan', 'subaru',
    'harley', 'ducati', 'triumph', 'rzr', 'maverick', 'outlander',
    'mxz', 'summit', 'renegade', 'expedition', 'skandic',
    'motoneige', 'motomarine', 'concessionnaire',
  ],
  pieces: [
    'pneu', 'pneus', 'pare-brise', 'freins', 'frein', 'filtre a huile',
    'piece auto', 'pieces auto', 'amortisseur', 'courroie', 'batterie auto',
    'echappement', 'radiateur', 'alternateur', 'demarreur', 'embrayage',
    'transmission', 'huile moteur', 'essuie-glace', 'plaquettes',
    'rotule', 'roulement', 'catalyseur', 'silencieux',
    'outil mecanique', 'cle dynamometrique', 'cric', 'soudeuse', 'soudure',
    'meuleuse', 'piece detachee', 'carrosserie', 'debosselage',
  ],
  epicerie: [
    'pain', 'lait', 'beurre', 'fromage', 'oeuf', 'oeufs', 'yaourt',
    'yogourt', 'creme', 'farine', 'sucre', 'riz', 'pates', 'cereales',
    'jus', 'eau', 'cafe', 'the', 'chocolat', 'biscuits', 'chips',
    'epicerie', 'alimentation', 'nourriture', 'legume', 'fruit',
    'huile', 'vinaigre', 'sel', 'poivre', 'confiture', 'miel',
    'viande', 'boeuf', 'poulet', 'porc', 'steak', 'saucisse', 'bacon',
    'boucherie', 'charcuterie', 'jambon', 'boulangerie', 'viennoiserie',
    'traiteur', 'depanneur',
  ],
  electro: [
    'telephone', 'cellulaire', 'ordinateur', 'laptop', 'tablette',
    'ecran', 'moniteur', 'clavier', 'souris', 'casque', 'ecouteurs',
    'television', 'tele', 'tv', 'imprimante', 'camera', 'appareil photo',
    'console', 'playstation', 'xbox', 'nintendo', 'switch', 'manette',
    'disque dur', 'ssd', 'processeur', 'carte graphique', 'gpu', 'cpu',
    'routeur', 'modem', 'speaker', 'enceinte', 'drone', 'smartwatch',
    'composante', 'arduino', 'raspberry', 'cable', 'adaptateur',
    'chargeur', 'reseau', 'securite', 'camera surveillance',
  ],
  quincaillerie: [
    'quincaillerie', 'outil', 'marteau', 'tournevis', 'perceuse', 'scie',
    'clou', 'vis', 'boulon', 'ecrou', 'rondelle', 'peinture', 'plomberie',
    'tuyau', 'robinet', 'drain', 'electricite', 'fil electrique', 'disjoncteur',
    'prise', 'interrupteur', 'colle', 'scellant', 'mastic', 'calfeutrage',
    'meuleuse', 'sableuse', 'compresseur', 'niveau', 'ruban a mesurer',
    'paysagement', 'gazon', 'engrais', 'tondeuse', 'souffleuse feuilles',
  ],
  maison: [
    'electromenager', 'refrigerateur', 'laveuse', 'secheuse', 'lave-vaisselle',
    'cuisiniere', 'four', 'micro-ondes', 'congelateur', 'hotte',
    'meuble', 'canape', 'sofa', 'lit', 'matelas', 'armoire', 'commode',
    'table', 'chaise', 'bureau', 'etagere', 'rangement', 'garde-robe',
    'decoration', 'rideau', 'tapis', 'lampe', 'tableau', 'coussin',
    'cuisine', 'batterie de cuisine', 'chaudron', 'poele', 'ustensile',
  ],
  mode: [
    'vetement', 'habit', 'manteau', 'pantalon', 'chemise', 'robe',
    'chandail', 'veste', 'blouson', 'jupe', 't-shirt', 'sous-vetement',
    'chaussure', 'botte', 'espadrille', 'sandales', 'talon',
    'boutique', 'mode', 'fashion', 'collection',
    'vetement enfant', 'vetement femme', 'vetement homme',
  ],
  sport: [
    'sport', 'hockey', 'patin', 'raquette', 'tennis', 'soccer', 'ballon',
    'natation', 'velo', 'ski', 'snowboard', 'golf', 'basketball', 'volleyball',
    'baseball', 'football', 'course', 'running', 'musculation', 'gym',
    'fitness', 'haltere', 'tapis roulant', 'equipement sportif',
    'vetement sport', 'maillot', 'short sport',
  ],
  plein_air: [
    'chasse', 'peche', 'camping', 'randonnee', 'raquette neige',
    'tente', 'sac de couchage', 'lampe frontale', 'boussole', 'gps',
    'fusil', 'carabine', 'munition', 'appat', 'leurre', 'canne a peche',
    'moulinet', 'fil peche', 'gilet de peche', 'waders', 'canoeing',
    'survie', 'couteau', 'hache', 'allume-feu', 'rations',
  ],
  machinerie: [
    'tracteur', 'john deere', 'kubota', 'case', 'new holland', 'massey',
    'machinerie', 'excavatrice', 'chargeuse', 'niveleuse', 'compacteur',
    'agricole', 'ferme', 'agriculture', 'faucheuse', 'semoir', 'charrue',
    'grue', 'camion benne', 'camion citerne', 'remorque',
  ],
  sante: [
    'pharmacie', 'medicament', 'ordonnance', 'vitamine', 'supplement',
    'sante', 'optique', 'lunette', 'lentille', 'verres',
    'coiffure', 'coiffeur', 'salon', 'coupe', 'teinture', 'meche',
    'esthetique', 'esthete', 'massage', 'soin visage', 'epilation',
    'manucure', 'pedicure', 'soins personnels', 'creme', 'lotion',
    'shampooing', 'deodorant', 'parfum', 'maquillage',
  ],
  animalerie: [
    'animal', 'animaux', 'chien', 'chat', 'oiseau', 'poisson', 'lapin',
    'hamster', 'animalerie', 'veterinaire', 'veto', 'clinique veterinaire',
    'nourriture animaux', 'croquette', 'litiere', 'cage', 'aquarium',
    'collier chien', 'laisse', 'jouet chien', 'jouet chat',
  ],
  loisirs: [
    'jeux', 'jouet', 'puzzle', 'lego', 'figurine', 'jeux de societe',
    'hobby', 'modélisme', 'maquette', 'collection', 'carte collectionnable',
    'peinture hobby', 'bricolage', 'couture', 'tricot', 'crochet',
    'instrument musique', 'guitare', 'piano', 'batterie',
  ],
  bijoux: [
    'bijou', 'bijoux', 'bague', 'collier', 'bracelet', 'jonc',
    'or', 'argent', 'diamant', 'pendentif', 'alliance', 'medaille',
    'bijouterie', 'joaillerie', 'montre', 'horlogerie',
    'sac', 'sac a main', 'portefeuille', 'ceinture', 'accessoire mode',
  ],
  bureautique: [
    'bureau', 'imprimante', 'cartouche', 'toner', 'papier bureau',
    'classeur', 'chemise', 'reliure', 'laminage', 'plastification',
    'papeterie', 'crayon', 'stylo', 'marqueur', 'cahier', 'bloc-notes',
    'imprimerie', 'impression', 'affiche', 'carte affaire',
  ],
};

function detectCategory(query) {
  const normalized = normalizeQuery(query);
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => normalized.includes(kw))) {
      return category;
    }
  }
  return 'divers';
}

// ── BADGE CATÉGORIE DÉTECTÉE ─────────────────────────────────────────
const CATEGORY_LABELS = {
  vehicules:    '🚗 Véhicules',
  pieces:       '🔧 Pièces & mécanique',
  epicerie:     '🛒 Épicerie & alimentation',
  electro:      '💻 Électronique',
  quincaillerie:'🔨 Quincaillerie',
  maison:       '🏠 Maison & meubles',
  mode:         '👕 Mode & vêtements',
  sport:        '⚽ Sport',
  plein_air:    '🌲 Plein air & chasse',
  machinerie:   '🚜 Machinerie',
  sante:        '💊 Santé & beauté',
  animalerie:   '🐾 Animalerie',
  loisirs:      '🎲 Loisirs',
  bijoux:       '💍 Bijoux & accessoires',
  bureautique:  '🖨️ Bureautique',
  divers:       null,
};

export default function SearchScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineResults, setOnlineResults] = useState([]);
  const [localResults, setLocalResults] = useState([]);
  const [loadingOnline, setLoadingOnline] = useState(false);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('idle'); // idle | asking | granted | denied
  const [userCity, setUserCity] = useState('');
  const [detectedCategory, setDetectedCategory] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);
  const cancelRef = useRef(false); // flag annulation recherche

  // Charger historique au montage
  useEffect(() => {
    loadRecentSearches();
  }, []);

  async function loadRecentSearches() {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {}
  }

  async function saveRecentSearch(query) {
    try {
      const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {}
  }

  async function getLocation() {
    setGpsStatus('asking');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsStatus('denied');
        return GPS_FALLBACK;
      }
      const loc = await Location.getCurrentPositionAsync({ timeout: 8000 });
      setGpsStatus('granted');
      // Reverse geocoding pour afficher la ville
      try {
        const geo = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&format=json`
        );
        const geoData = await geo.json();
        const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || '';
        const province = geoData.address?.state || '';
        if (city) setUserCity(`${city}, ${province}`);
      } catch {}
      return { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    } catch {
      setGpsStatus('denied');
      return GPS_FALLBACK;
    }
  }

  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;

    cancelRef.current = false;
    Keyboard.dismiss();
    setHasSearched(true);
    setOnlineResults([]);
    setLocalResults([]);
    setUserCity('');

    const category = detectCategory(q);
    setDetectedCategory(category !== 'divers' ? category : null);

    await saveRecentSearch(q);
    setSearchQuery('');

    // Lancer les deux appels en parallèle
    loadOnline(q, category);
    loadLocalResults(q, category);
  };

  function handleCancel() {
    cancelRef.current = true;
    setLoadingOnline(false);
    setLoadingLocal(false);
    setOnlineResults([]);
    setLocalResults([]);
    setHasSearched(false);
    setDetectedCategory(null);
    setSearchQuery('');
    setUserCity('');
    setGpsStatus('idle');
    inputRef.current?.focus();
  }

  async function loadOnline(q, category) {
    setLoadingOnline(true);
    try {
      const res = await fetch(
        `${ONLINE_API_URL}?q=${encodeURIComponent(q)}&cat=${category}`
      );
      const data = await res.json();
      if (!cancelRef.current) setOnlineResults(data.results || []);
    } catch {
      if (!cancelRef.current) setOnlineResults([]);
    }
    if (!cancelRef.current) setLoadingOnline(false);
  }

  async function loadLocalResults(q, category) {
    setLoadingLocal(true);
    const location = await getLocation();
    try {
      const response = await axios.post(`${BACKEND_URL}/api/search-prices`, {
        query: normalizeQuery(q),
        category: category,
        location: location,
        radiusKm: 150,
      });
      const locals = (response.data.results || []).filter(
        r => r.type === 'local_with_website' || r.type === 'local_no_website'
      );
      if (!cancelRef.current) setLocalResults(locals);
    } catch {
      if (!cancelRef.current) setLocalResults([]);
    }
    if (!cancelRef.current) setLoadingLocal(false);
  }

  const isLoading = loadingOnline || loadingLocal;

  // ── RENDU RÉSULTAT EN LIGNE ──────────────────────────────────────
  function renderOnlineItem({ item }) {
    const logoMap = {
      'Amazon.ca': '📦',
      'Walmart.ca': '🛒',
      'eBay.ca': '🏷️',
      'Facebook Marketplace': '📘',
      'Kijiji': '📢',
    };
    const colorMap = {
      'Amazon.ca': '#FF9900',
      'Walmart.ca': '#0071CE',
      'eBay.ca': '#E53238',
      'Facebook Marketplace': '#1877F2',
      'Kijiji': '#373373',
    };
    const logo = logoMap[item.store] || '🌐';
    const color = item.color || colorMap[item.store] || '#16a34a';
    const url = item.url || item.affiliate_url || '#';

    return (
      <TouchableOpacity
        style={styles.onlineCard}
        onPress={() => {
          Linking.openURL(url).catch(() => {});
        }}
        activeOpacity={0.75}
      >
        <Text style={styles.onlineLogo}>{logo}</Text>
        <View style={styles.onlineInfo}>
          <Text style={styles.onlineStore}>{item.store}</Text>
          <Text style={styles.onlineSubtitle}>En ligne · Livraison disponible</Text>
        </View>
        <View style={[styles.onlineButton, { backgroundColor: color }]}>
          <Text style={styles.onlineButtonText}>Voir les prix →</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // ── RENDU RÉSULTAT LOCAL ─────────────────────────────────────────
  function renderLocalItem({ item }) {
    const isFromGoogle = !item.verified && item.type !== undefined;
    const hasWebsite = item.type === 'local_with_website' && (item.website || item.affiliate_url);
    const mapsUrl = item.latitude && item.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`
      : `https://www.google.com/maps/search/?q=${encodeURIComponent(item.address || item.store)}`;

    return (
      <View style={styles.localCard}>
        <Text style={styles.localPin}>📍</Text>
        <View style={styles.localInfo}>
          <View style={styles.localNameRow}>
            <Text style={styles.localStore} numberOfLines={1}>{item.store}</Text>
            {isFromGoogle && !item.verified && (
              <Text style={styles.viaGoogle}>
                via <Text style={{ color: '#4285F4' }}>G</Text>
                <Text style={{ color: '#EA4335' }}>o</Text>
                <Text style={{ color: '#FBBC05' }}>o</Text>
                <Text style={{ color: '#34A853' }}>g</Text>
                <Text style={{ color: '#EA4335' }}>l</Text>
                <Text style={{ color: '#4285F4' }}>e</Text>
              </Text>
            )}
            {item.verified && (
              <Text style={styles.verifiedBadge}>✓ PrixMalin</Text>
            )}
            {item.partner && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`https://prixmalin.ca/fr/partenaires/${item.partner}`).catch(() => {})}
                activeOpacity={0.75}
              >
                <Text style={styles.partnerBadge}>🤝 Fier Partenaire</Text>
              </TouchableOpacity>
            )}
          </View>
          {item.address ? (
            <Text style={styles.localAddress} numberOfLines={1}>{item.address}</Text>
          ) : null}
          {item.distance ? (
            <Text style={styles.localDistance}>📏 {item.distance}</Text>
          ) : null}
          {item.rating ? (
            <Text style={styles.localRating}>⭐ {item.rating}/5</Text>
          ) : null}

          {/* ── 3 BOUTONS D'ACTION ── */}
          <View style={styles.localActions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnDirections]}
              onPress={() => Linking.openURL(mapsUrl).catch(() => {})}
            >
              <Text style={styles.actionBtnText}>📍 Directions</Text>
            </TouchableOpacity>

            {hasWebsite && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnWebsite]}
                onPress={() => Linking.openURL(item.website || item.affiliate_url).catch(() => {})}
              >
                <Text style={styles.actionBtnText}>🌐 Site web</Text>
              </TouchableOpacity>
            )}

            {item.phone ? (
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnPhone]}
                onPress={() => Linking.openURL(`tel:${item.phone}`).catch(() => {})}
              >
                <Text style={styles.actionBtnText}>📞 Appeler</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  // ── ÉTAT VIDE / INITIAL ──────────────────────────────────────────
  function renderEmptyState() {
    if (hasSearched && !isLoading && onlineResults.length === 0 && localResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Aucun résultat</Text>
          <Text style={styles.emptySubtitle}>Essayez avec d'autres mots-clés</Text>
        </View>
      );
    }
    if (!hasSearched) {
      return (
        <View style={styles.initialState}>
          <Text style={styles.initialIcon}>🛍️</Text>
          <Text style={styles.initialText}>Recherchez un produit pour trouver les meilleurs prix près de chez vous</Text>
          {recentSearches.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={styles.recentTitle}>🕐 Recherches récentes</Text>
              {recentSearches.map((q, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.recentItem}
                  onPress={() => {
                    setSearchQuery(q);
                    setTimeout(() => handleSearch(), 100);
                  }}
                >
                  <Text style={styles.recentText}>{q}</Text>
                  <Text style={styles.recentArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      );
    }
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8faf8" />

      {/* ── BARRE DE RECHERCHE ── */}
      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder={t('search_placeholder')}
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.searchButton, isLoading && styles.searchButtonCancel]}
            onPress={isLoading ? handleCancel : handleSearch}
          >
            {isLoading
              ? <Text style={styles.searchButtonIcon}>✕</Text>
              : <Text style={styles.searchButtonIcon}>🔍</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Badge catégorie détectée */}
        {detectedCategory && hasSearched && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {CATEGORY_LABELS[detectedCategory]}
            </Text>
          </View>
        )}

        {/* Statut GPS */}
        {hasSearched && (
          <View style={styles.gpsRow}>
            {gpsStatus === 'denied' && (
              <Text style={styles.gpsWarning}>⚠️ Position non détectée — résultats pour l'Abitibi</Text>
            )}
            {gpsStatus === 'granted' && userCity ? (
              <Text style={styles.gpsOk}>📍 {userCity}</Text>
            ) : null}
            {gpsStatus === 'asking' && (
              <Text style={styles.gpsAsking}>📡 Localisation...</Text>
            )}
          </View>
        )}
      </View>

      <ScrollView
        style={styles.resultsScroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── SECTION EN LIGNE ── */}
        {hasSearched && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>🌐 EN LIGNE</Text>
            {loadingOnline ? (
              <View style={styles.sectionLoading}>
                <ActivityIndicator size="small" color="#16a34a" />
                <Text style={styles.sectionLoadingText}>Chargement...</Text>
              </View>
            ) : onlineResults.length > 0 ? (
              onlineResults.map((item, i) => (
                <View key={i}>{renderOnlineItem({ item })}</View>
              ))
            ) : !loadingOnline && (
              <Text style={styles.sectionEmpty}>Aucun résultat en ligne</Text>
            )}
          </View>
        )}

        {/* ── SECTION MAGASINS LOCAUX ── */}
        {hasSearched && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>📍 MAGASINS PRÈS DE VOUS</Text>
              {loadingLocal && (
                <ActivityIndicator size="small" color="#16a34a" style={{ marginLeft: 8 }} />
              )}
            </View>
            {loadingLocal && localResults.length === 0 ? (
              <View style={styles.sectionLoading}>
                <Text style={styles.sectionLoadingText}>Recherche de magasins...</Text>
              </View>
            ) : localResults.length > 0 ? (
              localResults.map((item, i) => (
                <View key={i}>{renderLocalItem({ item })}</View>
              ))
            ) : !loadingLocal && (
              <Text style={styles.sectionEmpty}>Aucun magasin trouvé dans votre région</Text>
            )}
          </View>
        )}

        {/* ── ÉTAT INITIAL / VIDE ── */}
        {renderEmptyState()}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8faf8',
  },

  // ── BARRE RECHERCHE ──
  searchSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#1f2937',
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonLoading: {
    backgroundColor: '#6b7280',
  },
  searchButtonCancel: {
    backgroundColor: '#dc2626',
  },
  searchButtonIcon: {
    fontSize: 20,
  },

  // ── BADGE CATÉGORIE ──
  categoryBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },

  // ── GPS ──
  gpsRow: {
    marginTop: 6,
  },
  gpsWarning: {
    fontSize: 12,
    color: '#d97706',
  },
  gpsOk: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },
  gpsAsking: {
    fontSize: 12,
    color: '#6b7280',
  },

  // ── SCROLL ──
  resultsScroll: {
    flex: 1,
  },

  // ── SECTIONS ──
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  sectionLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  sectionLoadingText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  sectionEmpty: {
    fontSize: 14,
    color: '#9ca3af',
    paddingVertical: 12,
    fontStyle: 'italic',
  },

  // ── CARTE EN LIGNE ──
  onlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    gap: 12,
  },
  onlineLogo: {
    fontSize: 28,
  },
  onlineInfo: {
    flex: 1,
  },
  onlineStore: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  onlineSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  onlineButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  onlineButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  // ── CARTE LOCALE ──
  localCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    gap: 10,
  },
  localPin: {
    fontSize: 24,
    marginTop: 2,
  },
  localInfo: {
    flex: 1,
  },
  localNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  localStore: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  viaGoogle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  partnerBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2eaabf',
    backgroundColor: 'rgba(46,170,191,0.12)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(46,170,191,0.4)',
    overflow: 'hidden',
  },
  verifiedBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16a34a',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  localAddress: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 3,
  },
  localDistance: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
    marginTop: 3,
  },
  localRating: {
    fontSize: 12,
    color: '#d97706',
    marginTop: 2,
  },
  localActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  actionBtnDirections: {
    backgroundColor: '#16a34a',
  },
  actionBtnWebsite: {
    backgroundColor: '#3b82f6',
  },
  actionBtnPhone: {
    backgroundColor: '#d97706',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  // ── ÉTAT INITIAL ──
  initialState: {
    padding: 24,
    alignItems: 'center',
  },
  initialIcon: {
    fontSize: 56,
    marginBottom: 16,
    marginTop: 20,
  },
  initialText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  recentSection: {
    width: '100%',
    marginTop: 8,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  recentText: {
    fontSize: 14,
    color: '#374151',
  },
  recentArrow: {
    fontSize: 14,
    color: '#9ca3af',
  },

  // ── ÉTAT VIDE ──
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
