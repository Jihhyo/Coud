# backend/Dockerfile

# Utiliser une image officielle de Node.js
FROM node:14

# Mettre à jour et installer netcat (nc)
RUN apt-get update && apt-get install -y netcat

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le code de l'application
COPY . .

# Copier le script d'attente pour la base de données
COPY wait-for-db.sh /app/wait-for-db.sh
RUN chmod +x /app/wait-for-db.sh

# Exposer le port sur lequel le backend écoute
EXPOSE 5000

# Démarrer l'application après que la base de données soit prête
CMD ["/app/wait-for-db.sh", "npm", "start"]
