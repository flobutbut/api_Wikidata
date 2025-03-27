# Documentation des propriétés Wikidata

## Propriétés principales

### Identification et classification
- `P31` (instance of) : Type de période (ex: période archéologique, éon, ère, etc.)
- `P361` (part of) : Relation hiérarchique entre les périodes
- `P373` (Commons category) : Catégorie Commons associée
- `P646` (Freebase ID) : Identifiant Freebase

### Dates et chronologie
- `P580` (start time) : Date de début
- `P582` (end time) : Date de fin
- `P1269` (facet of) : Aspect spécifique de la période
- `P1417` (Encyclopædia Britannica Online ID) : Référence Britannica

### Localisation et contexte géographique
- `P276` (location) : Localisation géographique principale
- `P61` (discoverer or inventor) : Découvreur ou inventeur de la période
- `P155` (follows) : Période précédente
- `P156` (followed by) : Période suivante

### Description et documentation
- `P227` (GND ID) : Identifiant GND
- `P2581` (BabelNet ID) : Identifiant BabelNet
- `P18` (image) : Image représentative
- `P527` (has part(s)) : Sous-périodes ou éléments constitutifs

## Exemples d'utilisation

### Pour une période géologique
```sparql
?item wdt:P31 wd:Q1235409;  # instance of: période archéologique
    wdt:P580 ?startDate;     # date de début
    wdt:P582 ?endDate;       # date de fin
    wdt:P276 ?location;      # localisation
    wdt:P361 ?parentPeriod. # période parente
```

### Pour une période archéologique
```sparql
?item wdt:P31 wd:Q1235409;  # instance of: période archéologique
    wdt:P580 ?startDate;     # date de début
    wdt:P582 ?endDate;       # date de fin
    wdt:P276 ?location;      # localisation
    wdt:P61 ?discoverer;     # découvreur
    wdt:P155 ?previousPeriod; # période précédente
    wdt:P156 ?nextPeriod.    # période suivante
```

## Notes importantes

1. **Hiérarchie des périodes**
   - Les éons sont les plus grands intervalles de temps
   - Les ères sont des subdivisions des éons
   - Les périodes sont des subdivisions des ères
   - Les époques sont des subdivisions des périodes
   - Les âges sont des subdivisions des époques

2. **Localisation**
   - Pour les périodes globales (ex: éons), pas de localisation spécifique
   - Pour les périodes régionales (ex: âges du bronze), utiliser P276
   - Pour les périodes culturelles, utiliser P276 pour la région principale

3. **Dates**
   - Les dates sont stockées au format ISO 8601
   - Les dates négatives sont utilisées pour les dates avant notre ère
   - La précision peut varier (année, mois, jour)

4. **Relations entre périodes**
   - P361 (part of) pour la hiérarchie principale
   - P155/P156 pour la chronologie
   - P527 pour les éléments constitutifs

## Problèmes connus

1. **Localisation**
   - Certaines périodes peuvent avoir plusieurs localisations
   - La propriété P276 peut ne pas être définie pour les périodes globales
   - Besoin de gérer le cas "Toute la Terre" vs localisation spécifique

2. **Dates**
   - Certaines périodes peuvent avoir des dates approximatives
   - Les dates peuvent être exprimées en années avant notre ère
   - Besoin de gérer différents formats de dates

3. **Hiérarchie**
   - Certaines périodes peuvent appartenir à plusieurs catégories
   - Les relations parent/enfant peuvent être complexes
   - Besoin de gérer les cas de chevauchement temporel 