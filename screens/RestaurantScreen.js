import * as Location from 'expo-location';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  Linking,
  RefreshControl,
  Platform,
} from 'react-native';

const BACKEND_URL = 'https://prixmalin-backend.onrender.com';
const GPS_FALLBACK = { lat: 47.3340, lng: -79.4335 };

// ── JOURS ────────────────────────────────────────────────────────────
const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const JOURS_LABEL = {
  lundi: 'Lun', mardi: 'Mar', mercredi: 'Mer', jeudi: 'Jeu',
  vendredi: 'Ven', samedi: 'Sam', dimanche: 'Dim',
};

// ── TYPES CUISINE ────────────────────────────────────────────────────
const TYPES_CUISINE = [
  { value: 'all', label: 'Tous', emoji: '🍽️' },
  { value: 'québécois', label: 'Québécois', emoji: '🍁' },
  { value: 'fast-food', label: 'Fast Food', emoji: '🍔' },
  { value: 'pizza', label: 'Pizzeria', emoji: '🍕' },
  { value: 'buffet', label: 'Buffet', emoji: '🍱' },
  { value: 'grillades', label: 'Grillades', emoji: '🥩' },
  { value: 'fruits-de-mer', label: 'Fruits de mer', emoji: '🦞' },
  { value: 'mexicain', label: 'Mexicain', emoji: '🌮' },
  { value: 'chinois', label: 'Chinois', emoji: '🥢' },
  { value: 'japonais', label: 'Japonais', emoji: '🍣' },
  { value: 'italien', label: 'Italien', emoji: '🍝' },
  { value: 'indien', label: 'Indien', emoji: '🍛' },
  { value: 'café', label: 'Café', emoji: '☕' },
  { value: 'bar', label: 'Bar / Pub', emoji: '🍺' },
  { value: 'végétarien', label: 'Végétarien', emoji: '🥗' },
  { value: 'déjeuner', label: 'Déjeuner', emoji: '🥞' },
  { value: 'rôtisserie', label: 'Rôtisserie', emoji: '🍗' },
  { value: 'sushi', label: 'Sushi', emoji: '🍱' },
  { value: 'libanais', label: 'Libanais', emoji: '🥙' },
  { value: 'méditerranéen', label: 'Méditerranéen', emoji: '🫒' },
  { value: 'thaïlandais', label: 'Thaïlandais', emoji: '🍜' },
  { value: 'vietnamien', label: 'Vietnamien', emoji: '🍲' },
  { value: 'coréen', label: 'Coréen', emoji: '🥘' },
  { value: 'grec', label: 'Grec', emoji: '🫕' },
  { value: 'halal', label: 'Halal', emoji: '🌙' },
  { value: 'brunch', label: 'Brunch', emoji: '🥂' },
  { value: 'food-truck', label: 'Food Truck', emoji: '🚚' },
  { value: 'sandwich', label: 'Sandwich & Pita', emoji: '🥪' },
];

const SERVICES = [
  { value: 'surplace', label: 'Sur place', emoji: '🪑' },
  { value: 'takeout', label: 'Take out', emoji: '🥡' },
  { value: 'livraison', label: 'Livraison', emoji: '🚗' },
  { value: 'drive', label: 'Drive', emoji: '🚘' },
];

// ── PROVINCES + VILLES ───────────────────────────────────────────────
const PROVINCES = [
  { code: 'QC', nom: 'Québec' },
  { code: 'ON', nom: 'Ontario' },
  { code: 'BC', nom: 'Colombie-Britannique' },
  { code: 'AB', nom: 'Alberta' },
  { code: 'MB', nom: 'Manitoba' },
  { code: 'SK', nom: 'Saskatchewan' },
  { code: 'NS', nom: 'Nouvelle-Écosse' },
  { code: 'NB', nom: 'Nouveau-Brunswick' },
  { code: 'NL', nom: 'Terre-Neuve' },
  { code: 'PE', nom: 'Île-du-Prince-Édouard' },
];

const VILLES_PAR_PROVINCE = {
  QC: ['Alma','Amos','Baie-Comeau','Baie-Saint-Paul','Beauceville','Blainville','Boisbriand','Boucherville','Bromont','Brossard','Candiac','Châteauguay','Chicoutimi','Coaticook','Cowansville','Dollard-des-Ormeaux','Dorval','Drummondville','Farnham','Gaspé','Gatineau','Granby','Joliette','Kirkland','La Prairie','La Sarre','La Tuque','Lac-Mégantic','Lachute','Laval','Lévis','L\'Assomption','Longueuil','Lorraine','Magog','Mascouche','Matane','Mirabel','Mont-Joli','Mont-Laurier','Mont-Royal','Mont-Saint-Hilaire','Montmagny','Montréal','Pincourt','Pointe-Claire','Pont-Rouge','Québec','Repentigny','Rimouski','Rivière-du-Loup','Roberval','Rosemère','Rouyn-Noranda','Saint-Basile-le-Grand','Saint-Bruno-de-Montarville','Saint-Constant','Saint-Eustache','Saint-Georges','Saint-Hyacinthe','Saint-Jean-sur-Richelieu','Saint-Jérôme','Saint-Lambert','Saint-Laurent','Saint-Lazare','Saint-Lin-Laurentides','Saint-Nicolas','Saint-Rémi','Saint-Sauveur','Sainte-Agathe-des-Monts','Sainte-Julie','Sainte-Marie','Sainte-Thérèse','Salaberry-de-Valleyfield','Sept-Îles','Shawinigan','Sherbrooke','Sorel-Tracy','Terrebonne','Thetford Mines','Trois-Rivières','Val-d\'Or','Varennes','Vaudreuil-Dorion','Victoriaville','Ville-Marie','Waterloo'],
  ON: ['Ajax','Aurora','Barrie','Belleville','Brampton','Brantford','Burlington','Cambridge','Chatham','Clarington','Cobourg','Cornwall','Guelph','Halton Hills','Hamilton','Innisfil','Kingston','Kitchener','London','Markham','Milton','Mississauga','Newmarket','Niagara Falls','North Bay','Oakville','Oshawa','Ottawa','Peterborough','Pickering','Richmond Hill','Sarnia','Sault Ste. Marie','St. Catharines','Sudbury','Thunder Bay','Timmins','Toronto','Vaughan','Waterloo','Welland','Whitby','Windsor','Woodstock'],
  BC: ['Abbotsford','Armstrong','Burnaby','Campbell River','Castlegar','Chilliwack','Colwood','Comox','Coquitlam','Courtenay','Cranbrook','Delta','Fort St. John','Kamloops','Kelowna','Kimberley','Langford','Langley','Maple Ridge','Mission','Nanaimo','Nelson','New Westminster','North Vancouver','Penticton','Pitt Meadows','Port Coquitlam','Port Moody','Prince George','Richmond','Salmon Arm','Saanich','Surrey','Terrace','Trail','Vancouver','Vernon','Victoria','West Kelowna','White Rock'],
  AB: ['Airdrie','Beaumont','Brooks','Calgary','Camrose','Chestermere','Cold Lake','Edmonton','Fort McMurray','Fort Saskatchewan','Grande Prairie','Lacombe','Leduc','Lethbridge','Lloydminster','Medicine Hat','Okotoks','Red Deer','Spruce Grove','St. Albert','Sherwood Park','Sylvan Lake','Wetaskiwin'],
  MB: ['Brandon','Dauphin','Flin Flon','Morden','Portage la Prairie','Selkirk','Steinbach','The Pas','Thompson','Winkler','Winnipeg'],
  SK: ['Estevan','Humboldt','Lloydminster','Martensville','Meadow Lake','Melfort','Moose Jaw','North Battleford','Prince Albert','Regina','Saskatoon','Swift Current','Warman','Weyburn','Yorkton'],
  NS: ['Amherst','Bridgewater','Dartmouth','Glace Bay','Halifax','Kentville','New Glasgow','Sydney','Truro','Windsor','Yarmouth'],
  NB: ['Bathurst','Campbellton','Dieppe','Edmundston','Fredericton','Miramichi','Moncton','Oromocto','Quispamsis','Rothesay','Saint John','Shediac','Woodstock'],
  NL: ['Conception Bay South','Corner Brook','Gander','Grand Falls-Windsor','Happy Valley-Goose Bay','Labrador City','Mount Pearl','Paradise','St. John\'s','Stephenville'],
  PE: ['Charlottetown','Cornwall','Montague','Stratford','Summerside'],
};

// ── HELPERS ──────────────────────────────────────────────────────────
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isOpenNow(horaires) {
  if (!horaires) return null;
  const now = new Date();
  const jourIdx = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const jour = JOURS[jourIdx];
  const h = horaires[jour];
  if (!h) return false;
  const [oh, om] = h.ouverture.split(':').map(Number);
  const [fh, fm] = h.fermeture.split(':').map(Number);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return nowMin >= oh * 60 + om && nowMin <= fh * 60 + fm;
}

function getTodayJour() {
  const now = new Date();
  return JOURS[now.getDay() === 0 ? 6 : now.getDay() - 1];
}

function normalizeStr(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function openDirections(address, name) {
  const query = encodeURIComponent(`${name} ${address || ''}`);
  const url = Platform.select({
    ios: `maps://maps.apple.com/?q=${query}`,
    android: `geo:0,0?q=${query}`,
  });
  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) return Linking.openURL(url);
      return Linking.openURL(`https://www.google.com/maps/search/?q=${query}`);
    })
    .catch(() => Linking.openURL(`https://www.google.com/maps/search/?q=${query}`));
}

// ── COMPOSANT HORAIRES ACCORDION ─────────────────────────────────────
function HorairesAccordion({ horaires, phone }) {
  const [open, setOpen] = useState(false);
  const today = getTodayJour();

  return (
    <View style={styles.accordion}>
      <TouchableOpacity
        style={styles.accordionToggle}
        onPress={() => setOpen(o => !o)}
        activeOpacity={0.7}
      >
        <Text style={styles.accordionLabel}>⏰ Voir les horaires</Text>
        <Text style={styles.accordionChevron}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.accordionContent}>
          {!horaires ? (
            <View>
              <Text style={styles.horaireInconnu}>Horaires non disponibles — contactez le restaurant</Text>
              {phone && (
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)}>
                  <Text style={styles.horairePhone}>📞 {phone}</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            JOURS.map(jour => {
              const h = horaires[jour];
              const isToday = jour === today;
              return (
                <View key={jour} style={[styles.horaireRow, isToday && styles.horaireRowToday]}>
                  <Text style={[styles.horaireJour, isToday && styles.horaireJourToday]}>
                    {JOURS_LABEL[jour]}
                  </Text>
                  {h ? (
                    <View style={styles.horaireRight}>
                      <Text style={[styles.horaireHeure, isToday && styles.horaireHeureToday]}>
                        {h.ouverture} – {h.fermeture}
                      </Text>
                      {h.note && <Text style={styles.horaireNote}> · {h.note}</Text>}
                    </View>
                  ) : (
                    <Text style={styles.horaireFerme}>Fermé</Text>
                  )}
                </View>
              );
            })
          )}
        </View>
      )}
    </View>
  );
}

// ── COMPOSANT CARTE RESTAURANT ────────────────────────────────────────
function CarteRestaurant({ restaurant }) {
  const ouvert = isOpenNow(restaurant.horaires);
  const isGoogle = restaurant.source === 'google';
  const isPrixMalin = restaurant.source === 'prixmalin';

  const correctionUrl = isGoogle
    ? `https://www.google.com/maps/search/?q=${encodeURIComponent(restaurant.name + ' ' + (restaurant.address || ''))}`
    : `mailto:contact@prixmalin.ca?subject=${encodeURIComponent('Correction - ' + restaurant.name)}`;

  return (
    <View style={[styles.card, isPrixMalin && styles.cardPrixMalin]}>

      {/* ── EN-TÊTE ── */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.nameRow}>
            <Text style={styles.cardName} numberOfLines={2}>{restaurant.name}</Text>
          </View>

          {/* Badges source + ouvert/fermé */}
          <View style={styles.badgeRow}>
            {isPrixMalin && (
              <View style={styles.badgeVerifie}>
                <Text style={styles.badgeVerifieText}>✓ Vérifié</Text>
              </View>
            )}
            {isGoogle && (
              <Text style={styles.badgeGoogle}>
                {'via '}
                <Text style={{ color: '#4285F4' }}>G</Text>
                <Text style={{ color: '#EA4335' }}>o</Text>
                <Text style={{ color: '#FBBC05' }}>o</Text>
                <Text style={{ color: '#34A853' }}>g</Text>
                <Text style={{ color: '#EA4335' }}>l</Text>
                <Text style={{ color: '#4285F4' }}>e</Text>
              </Text>
            )}
            {ouvert === true && (
              <View style={styles.badgeOuvert}>
                <Text style={styles.badgeOuvertText}>● Ouvert</Text>
              </View>
            )}
            {ouvert === false && restaurant.horaires && (
              <View style={styles.badgeFerme}>
                <Text style={styles.badgeFermeText}>● Fermé</Text>
              </View>
            )}
          </View>
        </View>

        {/* Distance */}
        {restaurant.distance !== undefined && (
          <Text style={styles.cardDistance}>
            {restaurant.distance.toFixed(1)} km
          </Text>
        )}
      </View>

      {/* ── TAGS CUISINE ── */}
      {(restaurant.cuisine || []).length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
          <View style={styles.tagsRow}>
            {(restaurant.cuisine || []).map(c => {
              const tc = TYPES_CUISINE.find(x => x.value === c);
              return (
                <View key={c} style={styles.tagCuisine}>
                  <Text style={styles.tagCuisineText}>
                    {tc ? `${tc.emoji} ${tc.label}` : c}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* ── TAGS SERVICE ── */}
      {(restaurant.service || []).length > 0 && (
        <View style={styles.tagsRow}>
          {(restaurant.service || []).map(s => {
            const sv = SERVICES.find(x => x.value === s);
            return (
              <View key={s} style={styles.tagService}>
                <Text style={styles.tagServiceText}>
                  {sv ? `${sv.emoji} ${sv.label}` : s}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* ── RÉSERVATION ── */}
      {restaurant.reservation && (
        <View style={styles.reservationBadge}>
          <Text style={styles.reservationText}>
            📋 {restaurant.reservationSurplace ? 'Réservation recommandée' : 'Réservation acceptée'}
            {restaurant.reservationInfo ? ` — ${restaurant.reservationInfo}` : ''}
          </Text>
        </View>
      )}

      {/* ── NOTE ÉDITORIALE ── */}
      {restaurant.note && (
        <View style={styles.noteEdito}>
          <Text style={styles.noteEditoText}>« {restaurant.note} »</Text>
        </View>
      )}

      {/* ── ADRESSE ── */}
      {restaurant.address && (
        <Text style={styles.cardAddress}>📍 {restaurant.address}</Text>
      )}

      {/* ── ACTIONS ── */}
      <View style={styles.actionsRow}>
        {restaurant.phone && (
          <TouchableOpacity
            style={styles.btnAppeler}
            onPress={() => Linking.openURL(`tel:${restaurant.phone}`)}
            activeOpacity={0.75}
          >
            <Text style={styles.btnAppelerText}>📞 Appeler</Text>
          </TouchableOpacity>
        )}
        {restaurant.address && (
          <TouchableOpacity
            style={styles.btnDirections}
            onPress={() => openDirections(restaurant.address, restaurant.name)}
            activeOpacity={0.75}
          >
            <Text style={styles.btnDirectionsText}>🗺️ Directions</Text>
          </TouchableOpacity>
        )}
        {restaurant.website && (
          <TouchableOpacity
            style={styles.btnSite}
            onPress={() => Linking.openURL(restaurant.website)}
            activeOpacity={0.75}
          >
            <Text style={styles.btnSiteText}>🌐 Site web</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── HORAIRES ── */}
      <HorairesAccordion horaires={restaurant.horaires} phone={restaurant.phone} />

      {/* ── CORRECTION ── */}
      <TouchableOpacity
        style={styles.correctionLink}
        onPress={() => Linking.openURL(correctionUrl)}
        activeOpacity={0.6}
      >
        <Text style={styles.correctionText}>
          {isGoogle ? '✏️ Corriger sur Google Maps...' : '✏️ Signaler une correction...'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ── ÉCRAN PRINCIPAL ───────────────────────────────────────────────────
export default function RestaurantScreen() {
  const { i18n } = useTranslation();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // GPS
  const [userPos, setUserPos] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('idle');
  const [userCity, setUserCity] = useState('');

  // Mode
  const [modeVille, setModeVille] = useState(false);
  const [villeCoords, setVilleCoords] = useState(null);
  const [villeActive, setVilleActive] = useState(null);

  // Sélecteur province/ville
  const [province, setProvince] = useState('QC');
  const [villeInput, setVilleInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [villeLoading, setVilleLoading] = useState(false);
  const [showProvinceList, setShowProvinceList] = useState(false);

  // Filtres
  const [cuisine, setCuisine] = useState('all');
  const [servicesActifs, setServicesActifs] = useState([]);
  const [search, setSearch] = useState('');

  // Compteur sticky
  const centerLat = villeCoords?.lat ?? userPos?.lat ?? GPS_FALLBACK.lat;
  const centerLng = villeCoords?.lng ?? userPos?.lng ?? GPS_FALLBACK.lng;

  // ── GPS ──────────────────────────────────────────────────────────
  async function getLocation() {
    setGpsStatus('asking');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsStatus('denied');
        return GPS_FALLBACK;
      }
      const loc = await Location.getCurrentPositionAsync({ timeout: 8000 });
      const pos = { lat: loc.coords.latitude, lng: loc.coords.longitude };
      setUserPos(pos);
      setGpsStatus('granted');
      try {
        const geo = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${pos.lat}&lon=${pos.lng}&format=json`
        );
        const geoData = await geo.json();
        const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || '';
        const prov = geoData.address?.state || '';
        if (city) setUserCity(`${city}, ${prov}`);
      } catch {}
      return pos;
    } catch {
      setGpsStatus('denied');
      return GPS_FALLBACK;
    }
  }

  // ── FETCH RESTAURANTS ────────────────────────────────────────────
  async function fetchRestaurants(lat, lng, isVille = false, isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    setRestaurants([]);
    const rayon = isVille ? 20 : 45;
    try {
      const lang = i18n.language?.split('-')[0] || 'fr';
      const res = await fetch(`${BACKEND_URL}/api/restaurants/google?lat=${lat}&lng=${lng}&rayon=${rayon}&lang=${lang}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRestaurants(data.restaurants || []);
    } catch {
      setError('Impossible de charger les restaurants. Vérifiez votre connexion.');
    }
    setLoading(false);
    setRefreshing(false);
  }

  // Chargement initial
  useEffect(() => {
    (async () => {
      setLoading(true);
      const pos = await getLocation();
      await fetchRestaurants(pos.lat, pos.lng, false);
    })();
  }, []);

  // ── AUTOCOMPLETE VILLE ───────────────────────────────────────────
  function handleVilleChange(val) {
    setVilleInput(val);
    if (!val.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
    const villes = VILLES_PAR_PROVINCE[province] || [];
    const q = normalizeStr(val);
    const found = villes.filter(v => normalizeStr(v).startsWith(q)).slice(0, 8);
    setSuggestions(found);
    setShowSuggestions(found.length > 0);
  }

  async function pickSuggestion(ville) {
    setVilleInput(ville);
    setSuggestions([]);
    setShowSuggestions(false);
    setVilleLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/geocode?ville=${encodeURIComponent(ville + ', ' + province)}`
      );
      const data = await res.json();
      if (data.lat && data.lng) {
        setVilleCoords({ lat: data.lat, lng: data.lng });
        setVilleActive(data.nom || ville);
        setVilleInput('');
        setCuisine('all');
        setServicesActifs([]);
        setSearch('');
        fetchRestaurants(data.lat, data.lng, true);
      }
    } catch {}
    setVilleLoading(false);
  }

  async function rechercherVille() {
    if (!villeInput.trim()) return;
    setVilleLoading(true);
    setShowSuggestions(false);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/geocode?ville=${encodeURIComponent(villeInput + ', ' + province)}`
      );
      const data = await res.json();
      if (data.lat && data.lng) {
        setVilleCoords({ lat: data.lat, lng: data.lng });
        setVilleActive(data.nom || villeInput);
        setVilleInput('');
        setCuisine('all');
        setServicesActifs([]);
        setSearch('');
        fetchRestaurants(data.lat, data.lng, true);
      }
    } catch {}
    setVilleLoading(false);
  }

  function switchToLocal() {
    setModeVille(false);
    setVilleActive(null);
    setVilleCoords(null);
    setVilleInput('');
    setSuggestions([]);
    setCuisine('all');
    setServicesActifs([]);
    setSearch('');
    const pos = userPos || GPS_FALLBACK;
    fetchRestaurants(pos.lat, pos.lng, false);
  }

  function toggleService(s) {
    setServicesActifs(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  }

  // ── FILTRAGE + TRI ────────────────────────────────────────────────
  const filtered = restaurants
    .map(r => ({
      ...r,
      distance: (r.latitude && r.longitude)
        ? getDistance(centerLat, centerLng, r.latitude, r.longitude)
        : undefined,
    }))
    .filter(r => {
      const rayon = modeVille ? 20 : 45;
      if (r.distance !== undefined && r.distance > rayon) return false;
      if (cuisine !== 'all' && !(r.cuisine || []).includes(cuisine)) return false;
      if (servicesActifs.length > 0 && !servicesActifs.every(s => (r.service || []).includes(s))) return false;
      if (search.trim()) {
        const q = normalizeStr(search);
        return normalizeStr(r.name).includes(q) ||
          normalizeStr(r.address || '').includes(q) ||
          (r.cuisine || []).some(c => normalizeStr(c).includes(q)) ||
          (r.keywords || []).some(k => normalizeStr(k).includes(q));
      }
      return true;
    })
    .sort((a, b) => {
      if (a.source === 'prixmalin' && b.source !== 'prixmalin') return -1;
      if (b.source === 'prixmalin' && a.source !== 'prixmalin') return 1;
      return (a.distance ?? 999) - (b.distance ?? 999);
    });

  // ── RENDER ────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8faf8" />

      {/* ── HEADER STICKY ── */}
      <View style={styles.stickyHeader}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>🍽️ Restaurants</Text>
            {gpsStatus === 'denied' && (
              <Text style={styles.gpsWarning}>⚠️ Position non détectée — Abitibi par défaut</Text>
            )}
            {gpsStatus === 'granted' && userCity ? (
              <Text style={styles.gpsOk}>📍 {userCity}</Text>
            ) : null}
            {gpsStatus === 'asking' && (
              <Text style={styles.gpsAsking}>📡 Localisation...</Text>
            )}
            {villeActive && (
              <Text style={styles.gpsOk}>🗺️ {villeActive}</Text>
            )}
          </View>
          {!loading && (
            <View style={styles.compteurBadge}>
              <Text style={styles.compteurText}>{filtered.length} resto{filtered.length > 1 ? 's' : ''}</Text>
            </View>
          )}
        </View>

        {/* ── TOGGLE LOCAL / AUTRE VILLE ── */}
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[styles.modeBtn, !modeVille && styles.modeBtnActive]}
            onPress={switchToLocal}
          >
            <Text style={[styles.modeBtnText, !modeVille && styles.modeBtnTextActive]}>📍 Local</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, modeVille && styles.modeBtnActive]}
            onPress={() => { setModeVille(true); setCuisine('all'); setServicesActifs([]); setSearch(''); }}
          >
            <Text style={[styles.modeBtnText, modeVille && styles.modeBtnTextActive]}>🗺️ Autre ville</Text>
          </TouchableOpacity>
        </View>

        {/* ── SÉLECTEUR VILLE ── */}
        {modeVille && (
          <View style={styles.villeSection}>
            {/* Dropdown province */}
            <TouchableOpacity
              style={styles.provinceBtn}
              onPress={() => setShowProvinceList(p => !p)}
            >
              <Text style={styles.provinceBtnText}>
                {PROVINCES.find(p => p.code === province)?.nom || 'Québec'} ▾
              </Text>
            </TouchableOpacity>

            {showProvinceList && (
              <View style={styles.provinceList}>
                {PROVINCES.map(p => (
                  <TouchableOpacity
                    key={p.code}
                    style={[styles.provinceItem, province === p.code && styles.provinceItemActive]}
                    onPress={() => {
                      setProvince(p.code);
                      setShowProvinceList(false);
                      setVilleInput('');
                      setSuggestions([]);
                    }}
                  >
                    <Text style={[styles.provinceItemText, province === p.code && styles.provinceItemTextActive]}>
                      {p.nom}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Input ville + autocomplete */}
            <View style={styles.villeInputRow}>
              <TextInput
                style={styles.villeInput}
                placeholder="Ex: Rouyn-Noranda"
                placeholderTextColor="#9ca3af"
                value={villeInput}
                onChangeText={handleVilleChange}
                onSubmitEditing={rechercherVille}
                returnKeyType="search"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.villeChercher}
                onPress={rechercherVille}
                disabled={villeLoading}
              >
                {villeLoading
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Text style={styles.villeChercherText}>Chercher</Text>
                }
              </TouchableOpacity>
            </View>

            {/* Suggestions autocomplete */}
            {showSuggestions && suggestions.length > 0 && (
              <View style={styles.suggestionsList}>
                {suggestions.map(ville => (
                  <TouchableOpacity
                    key={ville}
                    style={styles.suggestionItem}
                    onPress={() => pickSuggestion(ville)}
                  >
                    <Text style={styles.suggestionText}>{ville}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── RECHERCHE TEXTE ── */}
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Rechercher un resto, une cuisine..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />

        {/* ── FILTRE CUISINE (scroll horizontal) ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cuisineScroll}>
          <View style={styles.cuisineRow}>
            {TYPES_CUISINE.map(tc => (
              <TouchableOpacity
                key={tc.value}
                style={[styles.cuisineChip, cuisine === tc.value && styles.cuisineChipActive]}
                onPress={() => setCuisine(tc.value)}
              >
                <Text style={[styles.cuisineChipText, cuisine === tc.value && styles.cuisineChipTextActive]}>
                  {tc.emoji} {tc.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* ── FILTRE SERVICE ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.serviceScroll}>
          <View style={styles.serviceRow}>
            {SERVICES.map(s => (
              <TouchableOpacity
                key={s.value}
                style={[styles.serviceChip, servicesActifs.includes(s.value) && styles.serviceChipActive]}
                onPress={() => toggleService(s.value)}
              >
                <Text style={[styles.serviceChipText, servicesActifs.includes(s.value) && styles.serviceChipTextActive]}>
                  {s.emoji} {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* ── LISTE ── */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              const pos = villeCoords || userPos || GPS_FALLBACK;
              fetchRestaurants(pos.lat, pos.lng, !!villeCoords, true);
            }}
            colors={['#f97316']}
            tintColor="#f97316"
          />
        }
      >
        {/* Chargement */}
        {loading && (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#f97316" />
            <Text style={styles.loadingText}>Recherche de restaurants...</Text>
          </View>
        )}

        {/* Erreur */}
        {error && !loading && (
          <View style={styles.errorState}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => {
                const pos = villeCoords || userPos || GPS_FALLBACK;
                fetchRestaurants(pos.lat, pos.lng, !!villeCoords);
              }}
            >
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Aucun résultat */}
        {!loading && !error && filtered.length === 0 && restaurants.length > 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>Aucun restaurant trouvé</Text>
            <Text style={styles.emptySubtitle}>Essayez de changer vos filtres</Text>
          </View>
        )}

        {/* Liste */}
        {!loading && filtered.map(r => (
          <CarteRestaurant key={r.id} restaurant={r} />
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8faf8',
  },

  // ── HEADER STICKY ──
  stickyHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
  },
  gpsWarning: { fontSize: 11, color: '#d97706', marginTop: 2 },
  gpsOk: { fontSize: 11, color: '#16a34a', fontWeight: '600', marginTop: 2 },
  gpsAsking: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  compteurBadge: {
    backgroundColor: '#f97316',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  compteurText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  // ── MODE TOGGLE ──
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  modeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#d1fae5',
    backgroundColor: '#f0fdf4',
  },
  modeBtnActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  modeBtnText: { fontSize: 13, fontWeight: '600', color: '#16a34a' },
  modeBtnTextActive: { color: '#fff' },

  // ── SÉLECTEUR VILLE ──
  villeSection: { marginBottom: 10 },
  provinceBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  provinceBtnText: { fontSize: 13, color: '#374151', fontWeight: '600' },
  provinceList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 100,
  },
  provinceItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  provinceItemActive: { backgroundColor: '#f0fdf4' },
  provinceItemText: { fontSize: 14, color: '#374151' },
  provinceItemTextActive: { color: '#16a34a', fontWeight: '700' },
  villeInputRow: { flexDirection: 'row', gap: 8 },
  villeInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1f2937',
  },
  villeChercher: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 14,
    borderRadius: 10,
    justifyContent: 'center',
  },
  villeChercherText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  suggestionsList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 99,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  suggestionText: { fontSize: 14, color: '#374151' },

  // ── RECHERCHE ──
  searchInput: {
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 10,
  },

  // ── CHIPS CUISINE ──
  cuisineScroll: { marginBottom: 8 },
  cuisineRow: { flexDirection: 'row', gap: 6, paddingRight: 16 },
  cuisineChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#fed7aa',
    backgroundColor: '#fff7ed',
  },
  cuisineChipActive: { backgroundColor: '#f97316', borderColor: '#f97316' },
  cuisineChipText: { fontSize: 12, fontWeight: '600', color: '#ea580c' },
  cuisineChipTextActive: { color: '#fff' },

  // ── CHIPS SERVICE ──
  serviceScroll: { marginBottom: 4 },
  serviceRow: { flexDirection: 'row', gap: 6, paddingRight: 16 },
  serviceChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    backgroundColor: '#eff6ff',
  },
  serviceChipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  serviceChipText: { fontSize: 12, fontWeight: '600', color: '#1d4ed8' },
  serviceChipTextActive: { color: '#fff' },

  // ── SCROLL ──
  scroll: { flex: 1 },

  // ── CARTE RESTAURANT ──
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardPrixMalin: {
    borderColor: '#bbf7d0',
    borderWidth: 1.5,
  },

  // En-tête carte
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardHeaderLeft: { flex: 1, marginRight: 8 },
  nameRow: { marginBottom: 4 },
  cardName: { fontSize: 16, fontWeight: '800', color: '#1f2937' },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  badgeVerifie: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeVerifieText: { fontSize: 11, fontWeight: '700', color: '#16a34a' },
  badgeGoogle: { fontSize: 11, fontWeight: '600', color: '#6b7280' },
  badgeOuvert: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeOuvertText: { fontSize: 11, fontWeight: '700', color: '#16a34a' },
  badgeFerme: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeFermeText: { fontSize: 11, fontWeight: '700', color: '#dc2626' },
  cardDistance: { fontSize: 12, fontWeight: '600', color: '#9ca3af', fontVariant: ['tabular-nums'] },

  // Tags
  tagsScroll: { marginBottom: 6 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 6 },
  tagCuisine: {
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagCuisineText: { fontSize: 11, color: '#c2410c', fontWeight: '600' },
  tagService: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagServiceText: { fontSize: 11, color: '#1d4ed8', fontWeight: '600' },

  // Réservation
  reservationBadge: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  reservationText: { fontSize: 12, color: '#92400e' },

  // Note éditoriale
  noteEdito: {
    borderLeftWidth: 3,
    borderLeftColor: '#bbf7d0',
    paddingLeft: 10,
    marginBottom: 8,
  },
  noteEditoText: { fontSize: 13, color: '#4b5563', fontStyle: 'italic', lineHeight: 18 },

  // Adresse
  cardAddress: { fontSize: 12, color: '#9ca3af', marginBottom: 10 },

  // Actions
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  btnAppeler: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#bbf7d0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  btnAppelerText: { fontSize: 12, fontWeight: '700', color: '#16a34a' },
  btnDirections: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  btnDirectionsText: { fontSize: 12, fontWeight: '700', color: '#1d4ed8' },
  btnSite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f9fafb',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  btnSiteText: { fontSize: 12, fontWeight: '700', color: '#374151' },

  // Accordion horaires
  accordion: { marginTop: 8 },
  accordionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  accordionLabel: { fontSize: 13, color: '#6b7280', fontWeight: '600' },
  accordionChevron: { fontSize: 10, color: '#9ca3af' },
  accordionContent: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  horaireRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    gap: 10,
  },
  horaireRowToday: {
    backgroundColor: '#f0fdf4',
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  horaireJour: { width: 28, fontSize: 12, color: '#9ca3af', fontWeight: '500' },
  horaireJourToday: { color: '#16a34a', fontWeight: '800' },
  horaireRight: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  horaireHeure: { fontSize: 12, color: '#374151' },
  horaireHeureToday: { color: '#16a34a', fontWeight: '700' },
  horaireNote: { fontSize: 11, color: '#d97706', fontStyle: 'italic' },
  horaireFerme: { fontSize: 12, color: '#d1d5db' },
  horaireInconnu: { fontSize: 12, color: '#9ca3af', fontStyle: 'italic', marginBottom: 6 },
  horairePhone: { fontSize: 13, color: '#16a34a', fontWeight: '700' },

  // Correction
  correctionLink: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  correctionText: { fontSize: 11, color: '#d1d5db' },

  // États
  loadingState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  loadingText: { fontSize: 14, color: '#9ca3af' },
  errorState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32, gap: 12 },
  errorIcon: { fontSize: 40 },
  errorText: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  retryBtn: {
    backgroundColor: '#f97316',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 4,
  },
  retryText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#374151' },
  emptySubtitle: { fontSize: 13, color: '#9ca3af' },
});
