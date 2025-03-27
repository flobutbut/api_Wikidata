# Documentation Fonctionnelle

## Présentation

Application web permettant d'explorer les périodes géologiques de manière hiérarchique. Les données sont récupérées en temps réel depuis Wikidata.

## Fonctionnalités

### 1. Navigation Hiérarchique

#### Vue Principale
- Affichage des éons principaux (Hadéen, Archéen, Protérozoïque, Phanérozoïque)
- Cartes cliquables pour accéder aux sous-périodes
- Bouton de retour pour remonter dans la hiérarchie

#### Informations Affichées
- Nom de la période
- Dates de début et de fin (en format géologique)
- Localisation géographique (si disponible)

### 2. Sélection de la Langue

- Support du français et de l'anglais
- Changement dynamique de la langue
- Conservation des données lors du changement de langue

### 3. Gestion des Données

#### Source des Données
- Connexion à Wikidata via l'API SPARQL
- Mise à jour en temps réel
- Cache local pour optimiser les performances

#### Format des Dates
- Conversion automatique en format géologique
- Support des dates négatives
- Affichage adapté selon la précision disponible

### 4. Interface Utilisateur

#### Design Responsive
- Adaptation à différentes tailles d'écran
- Grille dynamique des périodes
- Navigation tactile sur mobile

#### Retours Visuels
- États de chargement
- Animations de transition
- Indicateurs de navigation

## Cas d'Utilisation

### 1. Navigation dans les Périodes

1. L'utilisateur arrive sur la page d'accueil
2. Les quatre éons principaux sont affichés
3. L'utilisateur clique sur un éon
4. Les sous-périodes de l'éon s'affichent
5. L'utilisateur peut continuer à naviguer ou revenir en arrière

### 2. Changement de Langue

1. L'utilisateur clique sur le sélecteur de langue
2. La nouvelle langue est appliquée
3. Les données sont rechargées dans la langue sélectionnée

## Limitations Connues

### 1. Localisation
- Certaines périodes n'ont pas de localisation définie
- Affichage par défaut "Toute la Terre"
- Investigation en cours pour améliorer la précision

### 2. Données
- Dépendance aux données disponibles sur Wikidata
- Possibles incohérences dans les dates très anciennes
- Certaines périodes peuvent manquer de détails

## Évolutions Futures

### 1. Améliorations Prévues
- Ajout d'un fil d'Ariane (breadcrumb)
- Visualisation chronologique
- Mode sombre
- Filtres de recherche

### 2. Optimisations
- Amélioration du cache
- Réduction des temps de chargement
- Optimisation des requêtes SPARQL

### 3. Nouvelles Fonctionnalités
- Support de langues supplémentaires
- Intégration de médias (images, schémas)
- Export des données
- Mode hors ligne

## Spécifications Techniques

### API Wikidata
- Utilisation de l'API REST Wikidata
- Endpoint : `/api/wikidata/w/api.php`
- Paramètres :
  - `action`: wbsearchentities
  - `search`: "période géologique"
  - `language`: fr/en
  - `format`: json
  - `type`: item
  - `limit`: 20
  - `continue`: offset

### Structure des Données
```typescript
interface GeologicalPeriod {
  id: string;
  label: string;
  description?: string;
}
```

### Cache
- Durée de validité : 5 minutes
- Clé de cache : combinaison de limit/offset/language
- Invalidation automatique

### Pagination
- 20 éléments par page
- Navigation Précédent/Suivant
- Désactivation des boutons aux limites

## Limitations
- Pas de recherche en temps réel
- Données limitées aux informations de base
- Pas de filtrage avancé
- Pas de tri personnalisé

## Améliorations Futures
1. Ajout d'une barre de recherche
2. Filtres avancés
3. Tri personnalisé
4. Plus d'informations par période
5. Visualisation temporelle
6. Export des données
7. Mode sombre
8. Historique de navigation
9. Breadcrumb pour la navigation 