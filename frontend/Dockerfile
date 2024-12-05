# frontend/Dockerfile

# Étape de construction
FROM node:14 as build

# Définir le répertoire de travail pour la construction
WORKDIR /app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le code source et construire l'application
COPY . .
RUN npm run build

# Étape de déploiement Nginx
FROM nginx:alpine

# Copier les fichiers de construction dans Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
