# SAÉ 501

## Fonctionnalités testables

Actuellement, les fonctionnalités suivantes fonctionnent en environnement local, mais rencontrent des erreurs CORS sur Codespace, ce qui empêche leur bon fonctionnement dans cet environnement.

 Voici la liste des fonctionnalités disponibles :
- Register / Login
- Création d'un événement
- Système de brouillon lors de la création d'un événement
- Visualisation du calendrier
- Visualisation de la page d'accueil avec des données dynamiques ( Pas encore de base "par défaut" donc vide si vous n'avez pas crée d'événement public )
- Visualisation du calendrier en JOUR/SEMAINE/MOIS

Voici la liste des fonctionnalités disponibles (15/11/2024) :
- Pouvoir supprimer un compte dans le backoffice
- Backoffice administrateur : gestion des utilisateurs et des évenements
- Page profil et modification du profil
- Affichage des événéments dans le calendrier en fonction de l'utilisateur connecté
- Suppresion d'événément crée par un utilisateur dans la vu calendrier
- Upload des images à partir de la création d'événément ( upload sur le server )
- Récupérer les données de chaque évènement public et les afficher sur la page de détail de l'évènement
- Intégrer un footer à l'application
- Afficher des évènements publics dans les recommandations de la page d'accueil
- Pouvoir s'inscrire avec une adresse mail à un évènement public

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
docker exec -it sae-backend /bin/bash
```
Dans le conteneur docker : 
```
php bin/console doctrine:migrations:migrate
```

### Générer les clés JWT : 
```
docker exec -it sae-backend /bin/bash
```
Dans le conteneur docker : 
```
php bin/console lexik:jwt:generate-keypair
```

### Import de la table Event

[Export de la base](./SAE501.sql)
Cette export contient un utilisateur déjà inscrit à des événements :

email : demo@gmail.com
mot de passe : azertyuiop

Des événements publics visibles sur la page d'accueil.

### Si problème avec les migrations : 

- Supprimer toutes les migrations du projet dans les fichiers et sur phpMyAdmin

```
php bin/console make:migration
```
```
php bin/console doctrine:migrations:migrate
```

## Executer des commandes dans les conteneurs docker si besoin : 
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










