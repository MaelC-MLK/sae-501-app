# Utilise l'image Node.js
FROM node:18-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de l'application Next.js
COPY ./frontend/package*.json ./
COPY ./frontend/ ./

# Installe les dépendances
RUN npm install

# Expose le port sur lequel Next.js sera lancé
EXPOSE 5173

# Démarre Next.js en mode développement
CMD ["npm", "run", "dev"]
