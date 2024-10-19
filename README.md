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

## Générer les clés JWT : 
```
docker exec -it sae-backend /bin/bash
```
Dans le conteneur docker : 
```
php bin/console lexik:jwt:generate-keypair
```

## Liens
- Frontend : [http://localhost:8090](http://localhost:8090)
- Backend : [http://localhost:8080](http://localhost:8080)
- phpMyAdmin : [http://localhost:8070](http://localhost:8070)
