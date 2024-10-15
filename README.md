# Configuration Docker avec Symphony et Next.js

## Installation

Il faut ensuite exécuter ces commandes :

### Installe les dépendances pour le frontend
```
docker-compose run --rm frontend npm install
```
### Installe les dépendances pour le backend
```
docker-compose run --rm backend composer install
```

## Lancer l'environnement
```
docker-compose up -d
```
### Lance les migrations pour avoir une base de données fonctionnelle
```
docker-compose run --rm backend php bin/console doctrine:migrations:migrate --no-interaction
```

## Executer des commandes dans les conteneurs docker : 
```
docker exec -it sae-backend /bin/bash
```
```
docker exec -it sae-frontend /bin/bash
```
## Liens
- Frontend : [http://localhost:8090](http://localhost:8090)
- Backend : [http://localhost:8080](http://localhost:8080)
- phpMyAdmin : [http://localhost:8070](http://localhost:8070)

## Structure Composants
/components
│
├── ui/               // Composants UI génériques (boutons, cartes, formulaires, etc.)
│   ├── button.jsx    // Bouton générique basé sur Shadcn UI
│   ├── card.jsx      // Composant de carte générique
│   ├── modal.jsx     // Modale générique
│   └── ...           // Autres composants UI réutilisables
│
├── layout/           // Composants liés à la mise en page (header, footer, sidebar)
│   ├── header.jsx
│   ├── footer.jsx
│   ├── sidebar.jsx
│   └── ... 
│
├── sections/         // Sections réutilisables de pages (hero, features, testimonials)
│   ├── hero.jsx
│   ├── features.jsx
│   └── ...
│
├── forms/            // Composants liés aux formulaires (inputs, checkboxes, etc.)
│   ├── text-input.jsx
│   ├── checkbox.jsx
│   ├── form.jsx
│   └── ...
│
├── cards/            // Composants de cartes spécifiques (cartes d'événements, profils, etc.)
│   ├── event-card.jsx
│   ├── profile-card.jsx
│   └── ...
│
├── modals/           // Modales spécifiques (confirmation, formulaire de connexion, etc.)
│   ├── login-modal.jsx
│   ├── confirm-modal.jsx
│   └── ...
│
└── navigation/       // Composants liés à la navigation (menus, breadcrumbs)
    ├── navbar.jsx
    ├── breadcrumbs.jsx
    └── ...
