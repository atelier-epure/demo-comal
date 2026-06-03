# Site web — Comal

Taqueria mexicaine · Flagey, Ixelles (Bruxelles). Tier **Signature** · mood **Street food**.

Site statique HTML/CSS/JS. Aucune dépendance, aucun framework, aucun build.

## Déploiement (3 minutes)

### Première mise en ligne

1. Crée un repo GitHub privé : `agence-mathis/site-comal`
2. `git init && git add . && git commit -m "init"`
3. `git remote add origin git@github.com:agence-mathis/site-comal.git`
4. `git push -u origin main`
5. Sur Hostinger : Sites → Add website → Connect from GitHub → sélectionner le repo
6. Le déploiement est automatique à chaque push sur `main`. Compte ~30 secondes.

### Modifications futures (maintenance)

```bash
cd site-comal
# édite les fichiers
git add .
git commit -m "maj: changement horaires"
git push
```

Hostinger redéploie automatiquement.

## Structure

- `index.html` — page principale (FR, langue par défaut)
- `en.html`, `nl.html` — versions multilingues
- `styles.css` — design complet (mood : Street food)
- `script.js` — interactions (nav scroll, galerie filtres + voir plus, compteurs, reveal, parallax hero, curseur custom)
- `sitemap.xml`, `robots.txt` — SEO
- `client-data.json` — brief client d'origine (traçabilité, ne pas commit publiquement)
- `assets/` — logo.svg, favicon.svg, photos/

## Maintenance courante

- **Horaires** : éditer dans les 3 fichiers HTML (section `id="contact"`) ET dans le JSON-LD du `<head>`
- **Menu** : section `id="menu"` dans `index.html` / `en.html` / `nl.html`
- **Photos** : remplacer dans `assets/photos/` en gardant le même nom de fichier
- **CSS/JS** : après toute modif de `styles.css` ou `script.js`, **bumper la version** dans les liens `?v=N` de TOUS les fichiers HTML :
  ```bash
  sed -i '' 's/?v=1/?v=2/g' index.html en.html nl.html
  ```

## SEO post-déploiement

- Soumettre le sitemap à Google Search Console : `https://comal.be/sitemap.xml`
- Vérifier le rich snippet via [Rich Results Test](https://search.google.com/test/rich-results)
- Mettre à jour la fiche Google Business avec l'URL du site

## Notes spécifiques à ce site

- **Photos** : photos de stock thématiques (restaurant fictif de démo). À remplacer par les vraies photos du client avant mise en production réelle.
- **Carte** : embed OpenStreetMap (pas de clé API requise, zéro maintenance). Pour passer à Google Maps embed, remplacer l'`<iframe>` de la section contact.
- **Traductions EN/NL** : Histoire et slogan validés. Le menu est une traduction baseline à faire valider par le client.
- **Réservation** : lien TheFork de démo — remplacer par l'URL réelle du restaurant dans les 3 fichiers HTML.
