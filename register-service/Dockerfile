# Utiliser une image de base Node.js
FROM node:14

# Installer netcat
RUN apt-get update && apt-get install -y netcat

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du code source
COPY . .

# Copier le script d'attente pour la base de données
COPY wait-for-db.sh /app/wait-for-db.sh
RUN chmod +x /app/wait-for-db.sh

# Copier le fichier .env dans le conteneur
COPY .env ./

# Exposer le port utilisé par le service
EXPOSE 4001

# Démarrer l'application après que la base de données soit prête
CMD ["/app/wait-for-db.sh", "node", "index.js"]
