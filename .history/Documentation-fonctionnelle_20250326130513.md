# Documentation Fonctionnelle

## Vue d'ensemble
L'application permet d'afficher une liste des périodes géologiques depuis Wikidata, avec support multilingue et pagination.

## Fonctionnalités

### Affichage des Périodes Géologiques
- Liste des périodes géologiques avec :
  - Nom de la période
  - Description (si disponible)
- Pagination avec 20 éléments par page
- Support multilingue (Français/Anglais)
- État de chargement pendant le chargement des données
- Gestion des erreurs avec messages spécifiques

### Gestion des Erreurs
- Messages d'erreur contextuels selon le type d'erreur :
  - Trop de requêtes
  - Service indisponible
  - Erreur de communication
  - Données invalides
- Bouton de réessai en cas d'erreur
- Retry automatique pour les erreurs temporaires

### Performance
- Mise en cache des données pendant 5 minutes
- Pagination côté client
- Timeout des requêtes après 10 secondes
- Retry automatique avec délai de 1 seconde

### Interface Utilisateur
- Sélecteur de langue (FR/EN)
- Boutons de navigation (Précédent/Suivant)
- Indicateur de chargement
- Messages d'erreur formatés
- Design responsive

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