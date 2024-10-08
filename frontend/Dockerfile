# Étape 1 : Utilisation d'une image Node.js officielle comme base
FROM node:18-alpine AS builder

# Définition du répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package.json pnpm-lock.yaml ./

# Installation de pnpm
RUN npm install -g pnpm

# Installation des dépendances
RUN pnpm install

# Copier le reste du projet
COPY . .

# Construction de l'application Next.js
RUN pnpm build

# Étape 2 : Utilisation d'une image plus légère pour servir l'application
FROM node:18-alpine AS runner

# Définition du répertoire de travail
WORKDIR /app

# Installation de pnpm dans l'image finale
RUN npm install -g pnpm

# Copier uniquement les fichiers de build depuis l'étape précédente
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# Exposer le port utilisé par l'application
EXPOSE 3000

# Lancement de l'application Next.js en utilisant pnpm
CMD ["pnpm", "start"]