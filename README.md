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
docker exec -it sae-backend /bin/bash
```
```
php bin/console doctrine:migrations:migrate
```

## Générer les clés JWT : 
```
docker exec -it sae-backend /bin/bash
```
Dans le conteneur docker : 
```
php bin/console lexik:jwt:generate-keypair
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
