# Documentation Fonctionnelle

## Fonctionnalités

### Navigation des Périodes Géologiques
- Affichage hiérarchique des périodes géologiques
- Navigation entre les différentes époques
- Affichage des dates de début et de fin de chaque période
- Support multilingue (français, anglais, espagnol)

### Explorateur de Propriétés Wikidata
- Interface de recherche par ID Wikidata
- Affichage catégorisé des propriétés :
  - Propriétés temporelles (dates de début, fin, etc.)
  - Propriétés de localisation (pays, région, etc.)
  - Propriétés de type (instance de, nature, etc.)
  - Propriétés de relation (fait partie de, contient, etc.)
  - Autres propriétés
- Affichage détaillé pour chaque propriété :
  - ID de la propriété
  - Nom en français
  - Valeur
  - Type de donnée

### Affichage des Dates
- Format adapté à la géologie :
  - Dates en années avant le présent
  - Unités adaptées à l'échelle :
    - Ga (Giga-années) pour les dates ≥ 1 000 000 000 ans
    - Ma (Méga-années) pour les dates ≥ 1 000 000 ans
    - ans pour les dates < 1 000 000 ans
- Exemple d'affichage :
  - "2.50 Ga" pour 2 500 000 000 ans
  - "538.80 Ma" pour 538 800 000 ans
  - "66.0 Ma" pour 66 000 000 ans

### Sélection de la Langue
- Changement dynamique de la langue d'affichage
- Persistance de la sélection de langue
- Support des caractères spéciaux et accents

## Interface Utilisateur

### Composants
1. GeologicalPeriods
   - Liste principale des périodes
   - Navigation hiérarchique
   - Gestion des états de chargement

2. GeologicalPeriodCard
   - Affichage d'une période individuelle
   - Nom de la période
   - Dates de début et de fin
   - Indicateur de navigation

3. LanguageSelector
   - Sélection de la langue
   - Affichage des drapeaux
   - Changement dynamique

4. PropertyExplorer
   - Barre de recherche pour les IDs Wikidata
   - Groupement des propriétés par catégorie
   - Affichage en tableau des propriétés
   - Gestion des états de chargement et d'erreur

### États de l'Interface
- État de chargement initial
- État de chargement des sous-périodes
- État d'erreur
- État de navigation

## Navigation des Périodes Géologiques

### Vue d'ensemble

L'application permet de naviguer dans la hiérarchie des périodes géologiques, en commençant par les éons jusqu'aux sous-périodes.

### Fonctionnalités

#### 1. Navigation Hiérarchique

- **Premier niveau** : Affichage des quatre éons principaux
  - Hadéen
  - Archéen
  - Protérozoïque
  - Phanérozoïque

- **Niveaux suivants** : Affichage des sous-périodes pour chaque période sélectionnée

#### 2. Interface Utilisateur

- **Sélection de la langue** : 
  - Français (par défaut)
  - Anglais

- **Navigation** :
  - Cliquer sur une période pour voir ses sous-périodes
  - Bouton "Retour" visible uniquement en navigation profonde
  - Transitions fluides entre les niveaux

- **Affichage des périodes** :
  - Nom de la période avec typographie hiérarchique
  - Dates de début et de fin (si disponibles)
  - Indicateur visuel pour la navigation (flèche)
  - Effets de survol subtils
  - Alignement et espacement optimisés

### Données affichées

Pour chaque période :
- Label dans la langue sélectionnée
- Date de début (optionnelle)
- Date de fin (optionnelle)

### Source des données

Les données sont récupérées en temps réel depuis Wikidata via des requêtes SPARQL.

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

interface PropertyInfo {
  property: string;        // ID de la propriété (ex: P31)
  propertyLabel: string;   // Label de la propriété
  value: string;          // Valeur ou ID de l'objet lié
  valueLabel: string;     // Label de la valeur
  type: string;           // Type de valeur (date, item, string, etc.)
}
```

### Catégories de Propriétés
- **Temporelles** : P580, P582, P569, P570
- **Localisation** : P17, P131, P276, P706
- **Type** : P31, P279
- **Relation** : P361, P527, P156

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