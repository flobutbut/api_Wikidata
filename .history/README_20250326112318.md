# Test API Wikidata - Périodes Géologiques

Ce projet est une application web moderne utilisant Vue 3 et TypeScript pour récupérer et visualiser des informations sur les périodes géologiques via l'API Wikidata.

## Description
Ce projet vise à créer une interface utilisateur interactive permettant de tester la connexion avec l'API Wikidata et de récupérer des informations sur les périodes géologiques, notamment leurs dates de début et de fin.

## Technologies
- Vue 3 (Composition API)
- TypeScript
- Vite
- API Wikidata (SPARQL)
- Yarn

## Installation

```bash
# Cloner le projet
git clone [URL_DU_REPO]

# Installer les dépendances
yarn install
```

## Développement

```bash
# Lancer le serveur de développement
yarn dev

# Build pour la production
yarn build

# Prévisualiser le build
yarn preview
```

## Fonctionnalités
- Affichage des périodes géologiques
- Dates de début et de fin
- Descriptions détaillées
- Relations entre les périodes
- Interface utilisateur responsive
- Gestion des erreurs

## Documentation
- [Documentation Technique](Documentation-technique.md)
- [Documentation d'État](Documentation-status.md)
- [Documentation Fonctionnelle](Documentation-fonctionnelle.md)

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

## Contribution
Les contributions sont les bienvenues. N'hésitez pas à ouvrir une issue ou à soumettre une pull request.
