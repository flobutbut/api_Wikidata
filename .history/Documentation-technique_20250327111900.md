# Documentation Technique

## Architecture

Le projet utilise Vue 3 avec TypeScript pour créer une interface de navigation des périodes géologiques en utilisant l'API SPARQL de Wikidata.

### Structure du Projet
```
src/
├── components/
│   ├── GeologicalPeriods.vue    # Composant principal
│   ├── GeologicalPeriodCard.vue # Carte de période
│   └── LanguageSelector.vue     # Sélecteur de langue
├── services/
│   └── wikidata.ts             # Service d'accès à Wikidata
├── utils/
│   └── dateFormatter.ts        # Utilitaire de formatage des dates
└── types/
    └── geological.ts           # Types TypeScript
```

### Services

#### Service Wikidata (`wikidata.ts`)
- Gestion des requêtes SPARQL vers l'API Wikidata
- Transformation des données brutes en objets typés
- Gestion des erreurs et des timeouts

#### Formatage des Dates (`dateFormatter.ts`)
- Classe utilitaire pour le formatage des dates
- Gestion des différents formats de dates :
  - Dates géologiques (années avant le présent)
  - Dates françaises (JJ/MM/AAAA)
  - Dates anglaises (MM/DD/YYYY)
- Conversion automatique des unités :
  - Ga (Giga-années) pour les dates ≥ 1 000 000 000 ans
  - Ma (Méga-années) pour les dates ≥ 1 000 000 ans
  - ans pour les dates < 1 000 000 ans

#### WikidataService

Service singleton pour l'interaction avec l'API Wikidata.

#### Fonctionnalités
- Requêtes SPARQL vers l'API Wikidata
- Mise en cache des résultats
- Gestion des erreurs et retry automatique
- Transformation des données

#### Configuration
```typescript
const WIKIDATA_API_URL = '/api/wikidata/sparql';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde
const REQUEST_TIMEOUT = 30000; // 30 secondes
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

#### Méthodes Principales
- `getGeologicalPeriods(options)`: Récupère les périodes géologiques
- `getChildPeriods(parentId, options)`: Récupère les sous-périodes

### DateFormatter

Utilitaire pour le formatage des dates géologiques.

#### Fonctionnalités
- Conversion des dates en format lisible
- Support des dates négatives
- Formatage en années géologiques

### Composants

#### GeologicalPeriods (Composant Principal)
- Gestion de l'état global de l'application
- Coordination des sous-composants
- Gestion des données et des erreurs
- Affichage conditionnel des états (chargement, erreur)

#### GeologicalPeriodCard
- Affichage d'une période géologique individuelle
- Gestion des interactions utilisateur
- Styles isolés pour la carte
- Émission d'événements de clic

#### BackButton
- Bouton de navigation retour
- Affichage conditionnel basé sur la profondeur de navigation
- Styles isolés pour le bouton
- Émission d'événements de clic

#### LanguageSelector
- Sélection de la langue d'affichage
- Support du v-model pour la liaison bidirectionnelle
- Styles isolés pour le sélecteur
- Gestion des événements de changement

### Types

#### GeologicalPeriod
```typescript
interface GeologicalPeriod {
  id: string;
  label: string;
  description: string;
  startDate?: string;
  endDate?: string;
  parentPeriod?: string;
  childPeriods: string[];
}
```

## Technologies Utilisées
- Vue 3 avec Composition API
- TypeScript
- Axios pour les requêtes HTTP
- SPARQL pour les requêtes Wikidata

## Configuration Proxy

Le projet utilise un proxy Vite pour éviter les problèmes CORS avec l'API Wikidata.

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

## Configuration

### Vite
Le projet utilise Vite comme bundler avec la configuration suivante :
- Proxy configuré pour l'API Wikidata (`/api/wikidata/*` -> `https://www.wikidata.org`)
- Gestion des en-têtes CORS et User-Agent via le proxy
- Support du HMR (Hot Module Replacement)

### API Wikidata
- Utilisation de l'API REST Wikidata via le proxy local
- Endpoint : `/api/wikidata/w/api.php`
- Paramètres de requête :
  - `action`: wbsearchentities
  - `format`: json
  - `language`: fr/en
  - `type`: item
  - `limit`: 20 (par défaut)

## Architecture Technique

### Service Wikidata
- Implémentation du pattern Singleton
- Gestion des requêtes SPARQL vers l'API Wikidata
- Support multilingue (fr, en)
- Pagination des résultats
- Gestion des erreurs
- Système de cache en mémoire
  - Durée de vie : 5 minutes
  - Clé de cache basée sur les options de requête
  - Invalidation automatique
  - Cache distinct par combinaison d'options

### Système de Gestion des Erreurs
#### WikidataError
- Classe d'erreur personnalisée avec :
  - Message d'erreur localisé
  - Code d'erreur spécifique
  - Erreur d'origine (pour le debugging)

#### Codes d'Erreur
- `RATE_LIMIT` : Limite de requêtes dépassée
- `SERVICE_UNAVAILABLE` : Service indisponible
- `ENDPOINT_NOT_FOUND` : Endpoint non trouvé
- `API_ERROR` : Erreur API générique
- `INVALID_RESPONSE` : Réponse invalide
- `UNKNOWN_ERROR` : Erreur inconnue

#### Mécanisme de Retry
- Configuration :
  - Maximum 3 tentatives
  - Délai de 1 seconde entre les tentatives
  - Timeout de 10 secondes par requête
- Erreurs retentées :
  - Erreurs réseau
  - Code 429 (Rate Limit)
  - Codes 503/504 (Service Unavailable)

#### Validation des Données
- Vérification de la structure de réponse
- Validation des champs obligatoires
- Transformation sécurisée des données

### Architecture des Composants
#### GeologicalPeriods
- Gestion de l'état global
- Coordination des sous-composants
- Gestion des données et des erreurs
- Affichage conditionnel des états

#### GeologicalPeriodCard
- Affichage d'une période
- Gestion des interactions
- Styles isolés
- Émission d'événements

#### BackButton
- Navigation retour
- Affichage conditionnel
- Styles isolés
- Émission d'événements

#### LanguageSelector
- Sélection de langue
- Support v-model
- Styles isolés
- Gestion des événements

### Tests
#### Tests Unitaires du Service
- Test du pattern Singleton
- Test des requêtes avec options par défaut
- Test des requêtes avec options personnalisées
- Tests de gestion des erreurs :
  - Erreurs HTTP (429, 503, 504)
  - Erreurs de validation des données
  - Mécanisme de retry
  - Timeouts
  - Erreurs réseau
- Mock des appels API avec Vitest

#### Tests des Composants
- Test de l'état de chargement initial
- Test de l'affichage des données
- Tests de gestion des erreurs :
  - Affichage des messages d'erreur
  - Fonctionnement du bouton de retry
  - États d'erreur spécifiques
  - Transitions d'état
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

2. Système de Cache
   - Cache en mémoire avec Map
   - Durée de vie configurable (5 minutes par défaut)
   - Clé de cache basée sur les paramètres de requête
   - Invalidation automatique des entrées expirées
   - Cache distinct pour chaque combinaison d'options
   - Réduction des appels API redondants

3. Limites de l'API
   - Pagination côté serveur (20 éléments par page)
   - Gestion des timeouts
   - Cache des requêtes

4. Validation des données
   - Typage strict avec TypeScript
   - Vérification des données reçues
   - Formatage des dates

5. Performance
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
   - Composants réutilisables
   - Styles isolés

3. UI/UX
   - Design responsive
   - États de chargement
   - Messages d'erreur clairs
   - Navigation intuitive
   - Transitions fluides
   - Hiérarchie visuelle claire

## Requêtes SPARQL

### Structure Principale
```sparql
SELECT DISTINCT ?item ?itemLabel ?startDate ?endDate ?location ?locationLabel
WHERE {
  # Filtre parent ou éons principaux
  OPTIONAL { ?item wdt:P580 ?startDate. }
  OPTIONAL { ?item wdt:P582 ?endDate. }
  OPTIONAL { ?item wdt:P706 ?location. }
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "fr,en".
  }
}
```

## Cache

### Système de Cache
- Clé: Combinaison des paramètres de requête
- Durée: 5 minutes
- Invalidation automatique
- Structure Map en mémoire

## Problèmes Connus et Solutions

### Localisation
- Problème: Difficulté à identifier la bonne propriété Wikidata
- Solution temporaire: Affichage "Toute la Terre" par défaut
- Investigation en cours sur les propriétés P276 et P706

### Dates
- Format: ISO 8601 avec support des dates négatives
- Conversion en format lisible avec unités géologiques
- Gestion des différentes précisions (année, mois, jour) 