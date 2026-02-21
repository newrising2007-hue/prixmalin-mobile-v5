/**
 * CodeBonusScreen - PrixMalin V5
 * Codes mis à jour : 21 février 2026
 * Sources : Perplexity - À revérifier aux 15 de chaque mois
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
  Alert,
  StatusBar,
} from 'react-native';

const GAME_DATA = {
  pc: {
    label: '🖥️ PC',
    accent: '#4a9eff',
    games: [
      {
        id: 'genshin',
        name: 'Genshin Impact',
        icon: '✨',
        codes: [
          { id: 'g1', description: 'Mora + Hero\'s Wit + matériaux Anémo', code: 'GS64YTW65O', expires: 'Limité', value: 'Ressources' },
          { id: 'g2', description: '60 Primogems + Adventurer\'s Experience', code: '8BHA0KFRG94K', expires: 'Limité', value: '60 Primogems' },
          { id: 'g3', description: '60 Primogems + Adventurer\'s Experience', code: '8X73KH58KDHN', expires: 'Limité', value: '60 Primogems' },
          { id: 'g4', description: 'Mora + Moonfall Silver + Hero\'s Wit', code: 'TSUKINOARIKAE', expires: 'Limité', value: 'Ressources' },
          { id: 'g5', description: '50 Primogems + 3 Hero\'s Wit (récurrent)', code: 'GENSHINGIFT', expires: 'Récurrent', value: '50 Primogems' },
        ],
      },
      {
        id: 'wot',
        name: 'World of Tanks',
        icon: '🪖',
        codes: [
          { id: 'wot1', description: 'Tank T14 + 3 jours Premium + 1 000 Gold', code: 'WOTGURU', expires: 'Limité', value: 'Tank + Gold' },
          { id: 'wot2', description: '7 jours Premium + 1 000 Gold + 200 000 crédits', code: 'SUPERNOVA', expires: 'Limité', value: '7j Premium' },
          { id: 'wot3', description: 'Tank T2 Light + 7 jours Premium + 500 Gold', code: 'WORLDOFCOBI', expires: 'Limité', value: 'Tank + Gold' },
          { id: 'wot4', description: 'Tank Excelsior + 7 jours Premium + 1 000 Gold', code: 'YOGSCAST', expires: 'Limité', value: 'Tank + Gold' },
          { id: 'wot5', description: 'Tank Excelsior + 14 jours Premium + 250 000 crédits', code: 'PEWDIEPIE', expires: 'Limité', value: '14j Premium' },
        ],
      },
      {
        id: 'wows',
        name: 'World of Warships',
        icon: '⚓',
        codes: [
          { id: 'ws1', description: '1 Award Container', code: 'WOWSBATTLEDIGEST', expires: 'Limité', value: 'Container' },
          { id: 'ws2', description: 'Mission Brandon Herrera + containers', code: 'AKMISSION', expires: 'Limité', value: 'Mission' },
          { id: 'ws3', description: '1 container More Coal', code: 'IHEARTWOWS', expires: 'Limité', value: 'Container' },
          { id: 'ws4', description: '1 container More Coal', code: '9BDWOWSWHO', expires: 'Limité', value: 'Container' },
          { id: 'ws5', description: '5 bonus Commander XP +200%', code: 'LS7GQCNMD', expires: 'Limité', value: 'XP Boost' },
          { id: 'ws6', description: '5 bonus Crédits +40%', code: 'U7SVMPCNP24', expires: 'Limité', value: 'Crédits Boost' },
        ],
      },
      {
        id: 'warzone_pc',
        name: 'Call of Duty: Warzone',
        icon: '🎯',
        codes: [
          { id: 'wz1', description: 'Carte de visite KB High Road', code: 'KZE3K7ENKV6RW', expires: 'Limité', value: 'Cosmétique' },
          { id: 'wz2', description: 'Carte Verdansk is Back + 30 min Double XP', code: 'KYHPCVYSNP6HY', expires: 'Limité', value: 'XP + Cosmétique' },
        ],
      },
    ],
  },
  ps: {
    label: '🎮 PlayStation',
    accent: '#00aaff',
    games: [
      {
        id: 'genshin_ps',
        name: 'Genshin Impact',
        icon: '✨',
        codes: [
          { id: 'gps1', description: '60 Primogems + Adventurer\'s Experience', code: '8BHA0KFRG94K', expires: 'Limité', value: '60 Primogems' },
          { id: 'gps2', description: '60 Primogems + Adventurer\'s Experience', code: '8X73KH58KDHN', expires: 'Limité', value: '60 Primogems' },
          { id: 'gps3', description: '50 Primogems + 3 Hero\'s Wit (récurrent)', code: 'GENSHINGIFT', expires: 'Récurrent', value: '50 Primogems' },
        ],
      },
      {
        id: 'wows_legends_ps',
        name: 'WoWs: Legends',
        icon: '⚓',
        codes: [
          { id: 'wl1', description: 'Récompenses / caisse bonus', code: 'E7S8MD6MK5', expires: 'Limité', value: 'Caisse' },
          { id: 'wl2', description: 'Récompenses diverses', code: '4X9GP5WASG', expires: 'Limité', value: 'Bonus' },
          { id: 'wl3', description: 'Récompenses caisse/bonus', code: 'NOFLYZONE', expires: 'Limité', value: 'Bonus' },
          { id: 'wl4', description: '1 Winter Big Crate', code: '2026WAVE7AL', expires: 'Limité', value: 'Grosse caisse' },
        ],
      },
      {
        id: 'warzone_ps',
        name: 'Call of Duty: Warzone',
        icon: '🎯',
        codes: [
          { id: 'wzps1', description: 'Carte de visite KB High Road', code: 'KZE3K7ENKV6RW', expires: 'Limité', value: 'Cosmétique' },
          { id: 'wzps2', description: 'Carte Verdansk is Back + 30 min Double XP', code: 'KYHPCVYSNP6HY', expires: 'Limité', value: 'XP + Cosmétique' },
        ],
      },
    ],
  },
  xbox: {
    label: '🟢 Xbox',
    accent: '#52d463',
    games: [
      {
        id: 'wows_legends_xbox',
        name: 'WoWs: Legends',
        icon: '⚓',
        codes: [
          { id: 'wx1', description: 'Récompenses / caisse bonus', code: 'E7S8MD6MK5', expires: 'Limité', value: 'Caisse' },
          { id: 'wx2', description: 'Récompenses diverses', code: '4X9GP5WASG', expires: 'Limité', value: 'Bonus' },
          { id: 'wx3', description: 'Récompenses caisse/bonus', code: 'NOFLYZONE', expires: 'Limité', value: 'Bonus' },
          { id: 'wx4', description: '1 Winter Big Crate', code: '2026WAVE7AL', expires: 'Limité', value: 'Grosse caisse' },
        ],
      },
      {
        id: 'warzone_xbox',
        name: 'Call of Duty: Warzone',
        icon: '🎯',
        codes: [
          { id: 'wzx1', description: 'Carte de visite KB High Road', code: 'KZE3K7ENKV6RW', expires: 'Limité', value: 'Cosmétique' },
          { id: 'wzx2', description: 'Carte Verdansk is Back + 30 min Double XP', code: 'KYHPCVYSNP6HY', expires: 'Limité', value: 'XP + Cosmétique' },
        ],
      },
    ],
  },
  cross: {
    label: '🎯 Multi-Plateforme',
    accent: '#d084ff',
    games: [
      {
        id: 'fortnite',
        name: 'Fortnite ⚠️',
        icon: '⚡',
        codes: [
          { id: 'fn1', description: 'Emote Nanner Ringer (à vérifier)', code: 'BANAN-NANAN-ANA', expires: '⚠️ Possiblement expiré', value: 'Emote' },
          { id: 'fn2', description: 'Décor December Fish and Bonfire (à vérifier)', code: 'FAT6P-PPE2E-4WQKV-UXP95', expires: '⚠️ Possiblement expiré', value: 'Décor' },
          { id: 'fn3', description: 'Spray Squeezy Life (à vérifier)', code: '8Z35X-3ZWAB-BC57H-EQTQZ', expires: '⚠️ Possiblement expiré', value: 'Spray' },
          { id: 'fn4', description: 'Spray Shaka (à vérifier)', code: 'YGGWX-38PNW-6TE2Q-JVKLS', expires: '⚠️ Possiblement expiré', value: 'Spray' },
          { id: 'fn5', description: 'Objet Noble de Corazon (à vérifier)', code: 'FGNHR-LWLW5-698CN-DMZXL', expires: '⚠️ Possiblement expiré', value: 'Objet' },
        ],
      },
    ],
  },
};

const PLATFORMS = [
  { key: 'all', label: '⭐ Tous' },
  { key: 'pc', label: '🖥️ PC' },
  { key: 'ps', label: '🎮 PS' },
  { key: 'xbox', label: '🟢 Xbox' },
  { key: 'cross', label: '🎯 Multi' },
];

const CodeCard = ({ code, accent }) => {
  const handleCopy = () => {
    Clipboard.setString(code.code);
    Alert.alert('✅ Copié !', 'Code copié dans le presse-papier');
  };

  return (
    <View style={styles.codeCard}>
      <View style={styles.codeCardHeader}>
        <Text style={styles.codeDescription}>{code.description}</Text>
        <View style={[styles.valueBadge, { backgroundColor: accent + '33' }]}>
          <Text style={[styles.valueText, { color: accent }]}>{code.value}</Text>
        </View>
      </View>
      <View style={styles.codeRow}>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{code.code}</Text>
        </View>
        <TouchableOpacity
          style={[styles.copyBtn, { backgroundColor: accent }]}
          onPress={handleCopy}
          activeOpacity={0.8}
        >
          <Text style={styles.copyBtnText}>📋</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.expiresText}>⏰ {code.expires}</Text>
    </View>
  );
};

const GameSection = ({ game, accent, isExpanded, onToggle }) => (
  <View style={styles.gameSection}>
    <TouchableOpacity
      style={[styles.gameHeader, isExpanded && { borderBottomWidth: 1, borderBottomColor: '#ffffff22' }]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={styles.gameHeaderLeft}>
        <Text style={styles.gameIcon}>{game.icon}</Text>
        <Text style={styles.gameName}>{game.name}</Text>
        <View style={styles.codeCountBadge}>
          <Text style={styles.codeCountText}>{game.codes.length} code{game.codes.length > 1 ? 's' : ''}</Text>
        </View>
      </View>
      <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
    </TouchableOpacity>
    {isExpanded && (
      <View style={styles.codesContainer}>
        {game.codes.map((code) => (
          <CodeCard key={code.id} code={code} accent={accent} />
        ))}
      </View>
    )}
  </View>
);

export default function CodeBonusScreen() {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [expandedGame, setExpandedGame] = useState(null);

  const getPlatformsToShow = () => {
    if (selectedPlatform === 'all') return Object.entries(GAME_DATA);
    const platform = GAME_DATA[selectedPlatform];
    return platform ? [[selectedPlatform, platform]] : [];
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d1a" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎁 Codes Bonus</Text>
        <Text style={styles.headerSubtitle}>Mis à jour aux 15 de chaque mois</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContainer}
      >
        {PLATFORMS.map((platform) => (
          <TouchableOpacity
            key={platform.key}
            style={[styles.tab, selectedPlatform === platform.key && styles.tabActive]}
            onPress={() => { setSelectedPlatform(platform.key); setExpandedGame(null); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, selectedPlatform === platform.key && styles.tabTextActive]}>
              {platform.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {getPlatformsToShow().map(([platformKey, platformData]) => (
          <View key={platformKey} style={styles.platformBlock}>
            {selectedPlatform === 'all' && (
              <View style={[styles.platformTitle, { borderLeftColor: platformData.accent }]}>
                <Text style={styles.platformTitleText}>{platformData.label}</Text>
              </View>
            )}
            {platformData.games.map((game) => (
              <GameSection
                key={game.id}
                game={game}
                accent={platformData.accent}
                isExpanded={expandedGame === game.id}
                onToggle={() => setExpandedGame(expandedGame === game.id ? null : game.id)}
              />
            ))}
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🔄 Codes mis à jour aux 15 de chaque mois{'\n'}
            ⚠️ Vérifiez la validité avant utilisation{'\n'}
            ⚠️ Codes Fortnite possiblement expirés
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  header: {
    paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20,
    backgroundColor: '#0d0d1a', borderBottomWidth: 1, borderBottomColor: '#ffffff11',
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#ffffff', letterSpacing: 0.5 },
  headerSubtitle: { fontSize: 13, color: '#ffffff66', marginTop: 4 },
  tabsScroll: { maxHeight: 56, backgroundColor: '#0d0d1a' },
  tabsContainer: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  tab: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#ffffff22',
  },
  tabActive: { backgroundColor: '#ff6b35', borderColor: '#ff6b35' },
  tabText: { color: '#ffffff88', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#ffffff' },
  content: { flex: 1, paddingTop: 12, paddingHorizontal: 16 },
  platformBlock: { marginBottom: 8 },
  platformTitle: { borderLeftWidth: 3, paddingLeft: 12, marginBottom: 10, marginTop: 8 },
  platformTitleText: { color: '#ffffffcc', fontSize: 16, fontWeight: '700' },
  gameSection: {
    backgroundColor: '#1a1a2e', borderRadius: 12, marginBottom: 8,
    overflow: 'hidden', borderWidth: 1, borderColor: '#ffffff11',
  },
  gameHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  gameHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  gameIcon: { fontSize: 20 },
  gameName: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  codeCountBadge: { backgroundColor: '#ffffff22', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  codeCountText: { color: '#ffffffaa', fontSize: 11, fontWeight: '600' },
  chevron: { color: '#ffffff55', fontSize: 12 },
  codesContainer: { paddingHorizontal: 12, paddingBottom: 12, paddingTop: 8, gap: 8 },
  codeCard: {
    backgroundColor: '#0d0d1a', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: '#ffffff11', gap: 8,
  },
  codeCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  codeDescription: { color: '#ffffffcc', fontSize: 13, flex: 1, fontWeight: '500' },
  valueBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  valueText: { fontSize: 11, fontWeight: '700' },
  codeRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  codeBox: {
    flex: 1, backgroundColor: '#ffffff11', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: '#ffffff22', borderStyle: 'dashed',
  },
  codeText: { color: '#ffffff', fontSize: 13, fontWeight: '800', letterSpacing: 1, fontFamily: 'monospace' },
  copyBtn: { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  copyBtnText: { fontSize: 18 },
  expiresText: { color: '#ffffff55', fontSize: 11 },
  footer: {
    marginTop: 20, padding: 16, backgroundColor: '#1a1a2e',
    borderRadius: 12, borderWidth: 1, borderColor: '#ffffff11',
  },
  footerText: { color: '#ffffff55', fontSize: 12, textAlign: 'center', lineHeight: 20 },
});
