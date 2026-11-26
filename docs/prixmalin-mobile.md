# PrixMalin — app mobile (Android) — état au 26 nov. 2026
*NeoSmarthing — François & Claude Senior*
*Dépôt : `/mnt/projets/PrixMalin/prixmalin-mobile-v5-clean/` — GitHub `prixmalin-mobile-v5`, branche `master`. Package : `com.neosmarthing.prixmalin`. Expo SDK 54.*

---

## 1. Version en cours — 1.0.5 (versionCode 16)
- **Envoyée en révision pour la production le 26 nov. 2026 (18:00)** — déploiement complet (« Start full rollout »), Canada.
- Contenu : version 1.0.5 + **R8** (minification / obfuscation) + **nettoyage des ressources** en release.
- **Testée par François** sur son téléphone par la piste de test interne avant la promotion : tout fonctionne.
- Effet : **10,8 Mo au lieu de 15,1 Mo** (−4,33 Mo) ; une mise à jour = ~3 Mo. Aucun appareil perdu (vérification Play : 0 « no longer supported »).
- Règle l'avertissement Play **« DEX code optimization below our threshold — Obfuscation (1 %) »** (release 15 / 1.0.4), échéance février 2027 — devrait disparaître quand Google aura des données sur la 1.0.5.
- **À faire** : confirmer dans la Play Console que la révision est acceptée et que l'avertissement DEX disparaît (quelques jours / semaines).

Commits (`master`) : `3232368` version 1.0.5 · `7554f6b` R8 (expo-build-properties) · `0bebc97` retrait de `android.versionCode`.

## 2. Configuration de build (à savoir avant le prochain build)
- **`app.json` fait foi.** Le dossier `android/` est dans `.gitignore` : c'est un reste d'un vieux `prebuild` (son `build.gradle` dit 5.0.0 / code 1) — EAS ne le voit pas. Ne pas s'y fier.
- **Numéro de build** : `eas.json` → `cli.appVersionSource: "remote"` + `production.autoIncrement: true` → EAS garde le compteur sur ses serveurs (dernier : **16**). Il n'y a plus de `versionCode` dans `app.json` (retiré le 26 nov.). Seule la `version` (« 1.0.5 ») se change à la main dans `app.json`.
- **R8** : plugin `expo-build-properties` (~1.0.10) dans `app.json` :
  ```json
  ["expo-build-properties", { "android": {
      "enableMinifyInReleaseBuilds": true,
      "enableShrinkResourcesInReleaseBuilds": true } }]
  ```
  Vérifier qu'Expo l'applique : `(cd <dépôt> && npx expo config --type introspect --json) | grep -o -i -E '"[^"]*(minify|shrink)[^"]*"[^}]*'`.
  Pas de règles `extraProguardRules` : à ajouter **seulement** si un écran plante en release (R8 casse surtout ce qui est chargé par réflexion — le bug n'apparaît qu'en release, jamais en dev).
- **Builds EAS** (cloud, gratuits pour PrixMalin) :
  - `eas build --platform android --profile production` → **AAB** pour Play (c'est lui qu'on teste et qu'on publie) ;
  - `--profile preview` → APK installable à la main ; inutile pour Play, et il faut désinstaller la version Play pour l'installer (signature différente).
- 42 vulnérabilités npm signalées (`npm audit`) — pas touché ; jamais de `npm audit fix --force`.

## 3. Publier une mise à jour (méthode du 26 nov.)
1. Changer la `version` dans `app.json`, commit (branche si le changement est risqué).
2. `eas build --platform android --profile production` → télécharger l'AAB depuis la page du build.
3. Play Console → PrixMalin → **Test and release → Testing → Internal testing → Create new release** → téléverser l'AAB → notes de version → **Save and publish** (piste interne seulement).
4. Testeurs : liste **« Personnel teste »** (Gmail du téléphone) — **la case de la liste doit être cochée + Save**, sinon personne ne reçoit le build (c'était le blocage du 26 nov. au matin). Lien « Copy link » ouvert sur le téléphone → Become a tester → mise à jour par Play (pas besoin de désinstaller).
5. Tester sur le téléphone : démarrage, chaque écran, recherche, commerces avec localisation, fr → en → ar (droite à gauche), lien Amazon (bon tag), images, fermer / rouvrir.
6. Internal testing → **Promote release → Production** → vérifier l'écran (appareils perdus = 0) → **Save** → **Publishing overview** : vérifier qu'il n'y a QUE ce changement → envoyer en révision.

**Balises de langue des notes de version (fiche PrixMalin)** — exactement celles-ci, sinon Play jette la note :
```
<fr-CA>
…
</fr-CA>
<ar>
…
</ar>
<en-CA>
…
</en-CA>
<es-419>
…
</es-419>
<zh-CN>
…
</zh-CN>
```
(Pas `en-US`, pas `es-ES`.)

## 4. Compte Google Play (commun avec MachShop)
- Compte **organisation** NeoSmarthing ; PrixMalin offert au **Canada seulement** (« restera toujours Canada, c'est local »).
- **Statut trader déclaré le 26 nov. 2026** (compte + par app « Yes, my trader status applies »), parce que MachShop est offert dans 13 pays dont l'Europe et le Royaume-Uni.
- Coordonnées publiques (partout dans le monde, sous « App support ») = celles du profil de paiement / D-U-N-S, **choix de François** de les garder pour l'instant. À changer si ça devient lourd : téléphone dans Détails du compte ; adresse par le profil de paiement Google + Dun & Bradstreet (plus long).
- **À faire (pas urgent)** : page **Conditions d'utilisation** sur prixmalin.ca (5 langues — il n'y a qu'une politique de confidentialité), puis lien dans Play → App content → App-level trader status and Terms of Service.
