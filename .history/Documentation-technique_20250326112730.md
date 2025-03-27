# Documentation Technique - API Wikidata - Périodes Géologiques

## Description du Projet
Ce projet vise à tester la connexion et l'utilisation de l'API Wikidata pour récupérer des informations sur les périodes géologiques.

## Technologies Utilisées
- Node.js
- TypeScript
- Vue 3 (Composition API)
- Vite (Build tool)
- API Wikidata (SPARQL)
- Yarn (gestionnaire de paquets)
- Axios (client HTTP)
- @vueuse/core (utilitaires Vue)

## Structure du Projet
```
api_Wikidata/
├── Documentation-technique.md
├── Documentation-status.md
├── Documentation-fonctionnelle.md
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.ts
    ├── App.vue
    ├── components/
    │   └── GeologicalPeriods.vue
    ├── types/
    │   └── geological.ts
    ├── services/
    │   └── wikidata.ts
    └── assets/
```

## Configuration Requise
- Node.js (version LTS recommandée)
- Yarn
- Accès Internet pour les requêtes API

## Installation
```bash
yarn install
```

## Architecture Technique
- Frontend : Vue 3 avec TypeScript
- Build Tool : Vite
- API : SPARQL de Wikidata
- State Management : Composition API de Vue 3
- Type Safety : TypeScript
- HTTP Client : Axios
- Pagination : Implémentée côté client et serveur
- Internationalisation : Support multilingue (FR/EN)

## Points d'Attention
- Gestion des erreurs de connexion à l'API
- Limitation des requêtes API
- Format des données retournées
- Validation des données
- Typage strict avec TypeScript
- Performance des composants Vue
- Optimisation des requêtes SPARQL
- Gestion de la pagination
- Support multilingue 