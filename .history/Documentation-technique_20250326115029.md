# Documentation Technique - API Wikidata - Périodes Géologiques

## Description du Projet
Ce projet vise à tester la connexion et l'utilisation de l'API Wikidata pour récupérer des informations sur les périodes géologiques.

## Technologies Utilisées
- Vue.js 3 avec Composition API
- TypeScript
- Vite
- Vitest pour les tests unitaires
- Vue Test Utils pour les tests de composants
- Axios pour les requêtes HTTP
- SPARQL pour les requêtes Wikidata

## Structure du Projet
```
src/
├── components/
│   ├── GeologicalPeriods.vue
│   └── __tests__/
│       └── GeologicalPeriods.test.ts
├── services/
│   ├── wikidata.ts
│   └── __tests__/
│       └── wikidata.test.ts
├── types/
│   └── geological.ts
├── App.vue
├── main.ts
└── vitest.config.ts
```

## Configuration Requise
- Node.js >= 16
- Yarn >= 1.22

## Installation
```bash
yarn install
```

## Scripts Disponibles
- `yarn dev` : Lance le serveur de développement
- `yarn build` : Compile le projet pour la production
- `yarn preview` : Prévisualise la version de production
- `yarn test` : Lance les tests unitaires
- `yarn test:coverage` : Lance les tests avec couverture
- `yarn test:ui` : Lance l'interface utilisateur des tests

## Architecture Technique

### Service Wikidata
- Implémentation du pattern Singleton
- Gestion des requêtes SPARQL vers l'API Wikidata
- Support multilingue (fr, en)
- Pagination des résultats
- Gestion des erreurs

### Composant GeologicalPeriods
- Affichage des périodes géologiques
- Gestion des états (chargement, erreur, données)
- Support multilingue
- Pagination côté client
- Formatage des dates
- Design responsive avec CSS Grid

### Tests
#### Tests Unitaires du Service
- Test du pattern Singleton
- Test des requêtes avec options par défaut
- Test des requêtes avec options personnalisées
- Test de la gestion des erreurs
- Mock des appels API avec Vitest

#### Tests des Composants
- Test de l'état de chargement initial
- Test de l'affichage des données
- Test de la gestion des erreurs
- Test du changement de langue
- Test de la pagination
- Utilisation de Vue Test Utils pour le montage et les interactions

### Points d'Attention
1. Gestion des erreurs
   - Classe `WikidataError` personnalisée avec codes d'erreur spécifiques
   - Système de retry automatique (3 tentatives, délai de 1s)
   - Timeout des requêtes (10s)
   - Gestion des erreurs HTTP (429, 503, 504)
   - Validation des données de réponse
   - Interface utilisateur réactive avec messages contextuels
   - Bouton de réessai pour les erreurs récupérables

2. Limites de l'API
   - Pagination côté serveur (20 éléments par page)
   - Gestion des timeouts
   - Cache des requêtes

3. Validation des données
   - Typage strict avec TypeScript
   - Vérification des données reçues
   - Formatage des dates

4. Performance
   - Lazy loading des données
   - Optimisation des requêtes SPARQL
   - Mise en cache des résultats

## Bonnes Pratiques
1. Tests
   - Tests unitaires pour les services
   - Tests d'intégration pour les composants
   - Mocks pour les dépendances externes
   - Couverture de code > 80%

2. Code
   - Utilisation de TypeScript strict
   - Documentation des fonctions
   - Gestion des cas d'erreur
   - Respect des conventions de nommage

3. UI/UX
   - Design responsive
   - États de chargement
   - Messages d'erreur clairs
   - Navigation intuitive 