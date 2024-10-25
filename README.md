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
- Pouvoir supprimer un compte

## Vidéo test de l'application
[https://youtu.be/jY8JQVgqcpE](https://youtu.be/jY8JQVgqcpE)

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










