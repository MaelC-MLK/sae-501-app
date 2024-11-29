# SAÉ 501

## Fonctionnalités testables

Actuellement, les fonctionnalités suivantes fonctionnent en environnement local, mais rencontrent des erreurs CORS sur Codespace, ce qui empêche leur bon fonctionnement dans cet environnement.

Voici la liste des nouvelles fonctionnalités disponibles (29/11/2024) :
 - Améliorations graphiques
 - Pouvoir modifier la photo de profil
 - Pouvoir filtrer dans le calendrier entre les événement public ou privé
 - Pouvoir s'inscrire à un événement en tant qu'utilisateur inscrit
  
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
php bin/console make:migration
```
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

[Export de la base](./SAE501.sql)<br/><br/>
Cette export contient un utilisateur déjà inscrit à des événements :<br/>
email : test@gmail.com <br/>
mot de passe : azertyuiop
<br/><br/>
Et des événements publics visibles sur la page d'accueil.
<br/>

### Si roblème d'upload d'image : 

Il se peut que le dossier qui reçoit l'upload des images n'ait pas de permissions par défaut, dans ce cas effectuer cette commande à la racine du projet :
```
sudo chmod 777 -R ./backend/public/uploads
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










