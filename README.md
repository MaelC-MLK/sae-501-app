# SAÉ 501

## Installation

Il faut exécuter ces commandes :

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
Une fois dans le conteneur docker : 
```
php bin/console make:migration
```
```
php bin/console doctrine:migrations:migrate
```

### Générer les clés JWT : 
```
docker exec -it sae-backend /bin/bash
```
Une fois dans le conteneur docker : 
```
php bin/console lexik:jwt:generate-keypair
```

### Import de la table Event

[Export de la base](./Eventify.sql)<br/><br/>
Cette export contient un utilisateur et un administrateur :<br/>
ADMIN : 
email : admin@gmail.com <br/>
mot de passe : adminpassword<br/><br/>

UTILISATEUR : 
email : user@gmail.com <br/>
mot de passe : userpassword
<br/>
Et des événements publics visibles sur la page d'accueil.
<br/>

### Si problème d'upload d'image : 

Il se peut que le dossier qui reçoit l'upload des images n'ait pas de permissions par défaut, dans ce cas effectuer cette commande à la racine du projet :
```
sudo chmod 777 -R ./backend/public/uploads
```

L'installation de l'application est terminé.

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










