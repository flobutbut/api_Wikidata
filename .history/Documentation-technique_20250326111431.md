# Documentation Technique - API Wikidata - Périodes Géologiques

## Description du Projet
Ce projet vise à tester la connexion et l'utilisation de l'API Wikidata pour récupérer des informations sur les périodes géologiques.

## Technologies Utilisées
- Node.js
- API Wikidata (SPARQL)
- Yarn (gestionnaire de paquets)

## Structure du Projet
```
api_Wikidata/
├── Documentation-technique.md
├── Documentation-status.md
├── Documentation-fonctionnelle.md
├── README.md
└── src/
    └── index.js
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
Le projet utilisera l'API SPARQL de Wikidata pour interroger la base de données. Les requêtes seront construites pour extraire spécifiquement les informations sur les périodes géologiques.

## Points d'Attention
- Gestion des erreurs de connexion à l'API
- Limitation des requêtes API
- Format des données retournées
- Validation des données 