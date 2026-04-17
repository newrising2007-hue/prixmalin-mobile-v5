path = '/mnt/sauvegardes/Important/Projets/PrixMalin/prixmalin-mobile-v5-clean/screens/SearchScreen.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Ajouter le badge partenaire après verifiedBadge
old1 = "            {item.verified && (\n              <Text style={styles.verifiedBadge}>✓ PrixMalin</Text>\n            )}"
new1 = "            {item.verified && (\n              <Text style={styles.verifiedBadge}>✓ PrixMalin</Text>\n            )}\n            {item.partner && (\n              <Text style={styles.partnerBadge}>🤝 Fier Partenaire</Text>\n            )}"

# 2. Ajouter le style partnerBadge
old2 = "  verifiedBadge: {"
new2 = "  partnerBadge: {\n    fontSize: 10,\n    fontWeight: '700',\n    color: '#2eaabf',\n    backgroundColor: 'rgba(46,170,191,0.12)',\n    borderRadius: 8,\n    paddingHorizontal: 6,\n    paddingVertical: 2,\n    borderWidth: 1,\n    borderColor: 'rgba(46,170,191,0.4)',\n    overflow: 'hidden',\n  },\n  verifiedBadge: {"

count = 0
if old1 in content:
    content = content.replace(old1, new1, 1)
    count += 1
    print('✅ Fix 1 — badge partenaire ajouté dans renderLocalItem')
else:
    print('❌ Fix 1 non trouvé')

if old2 in content:
    content = content.replace(old2, new2, 1)
    count += 1
    print('✅ Fix 2 — style partnerBadge ajouté')
else:
    print('❌ Fix 2 non trouvé')

if count > 0:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'✅ {count} fix(es) sauvegardés')
