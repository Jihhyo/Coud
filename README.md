Projet Chat Dockerisé

Bienvenue dans le projet de chat dockerisé. Ce projet est une application web qui permet à des utilisateurs de se créer un compte, se connecter et discuter en temps réel dans un salon de discussion. L'application est entièrement conteneurisée avec Docker et comprend plusieurs services indépendants.
Architecture de l'application

L'application est composée des services suivants :
    Frontend (React) : Interface utilisateur.
    Backend : Service principal qui gère les communications du chat.
    Register Service : Gestion des enregistrements des utilisateurs.
    Login Service : Authentification des utilisateurs.
    Base de données (MySQL) : Stockage des informations des utilisateurs et des messages.

Prérequis:
    Docker et Docker Compose installés sur votre machine.

Installation et Lancement
Clonez ce dépôt :
      
    git clone <URL_DU_DEPOT>
    cd <NOM_DU_DEPOT>

Lancez tous les services avec Docker Compose :
            
    docker-compose up -d

Vérifiez que tous les conteneurs sont démarrés :

    docker ps 

Accédez à l'application :
    Ouvrez votre navigateur et allez à http://localhost:3000.

Scénario Utilisateur
Étape 1 : Création d'un compte
    Client 1 :
        Ouvrez http://localhost:3000.
        Cliquez sur S'inscrire.
        Remplissez le formulaire avec un nom d'utilisateur et un mot de passe.
        Soumettez le formulaire.
        Si tout se passe bien, un message confirme que le compte a été créé.    
    Client 2 :
        Répétez la même procédure que Client 1 mais avec un nom d'utilisateur différent.

Étape 2 : Connexion
    Client 1 :
        Revenez à la page de connexion.
        Saisissez le nom d'utilisateur et le mot de passe créés à l'étape précédente.
        Cliquez sur Se connecter pour accéder au chat.
    Client 2 :
        Faites la même chose en utilisant les identifiants créés à l'étape précédente.

Étape 3 : Discussion en temps réel
    Client 1 et Client 2 :
        Une fois connectés, les utilisateurs voient la liste des personnes en ligne.
        Les utilisateurs peuvent envoyer des messages dans le chat.
        Les messages envoyés par un utilisateur sont instantanément visibles par l'autre.

Fichiers et Répertoires Importants : 
    frontend/ : Contient le code React pour l'interface utilisateur.
    backend/ : Contient le service principal de chat.
    register-service/ : Contient le service d'enregistrement des utilisateurs.
    auth-service/ : Contient le service de connexion des utilisateurs.
    db/ : Contient les fichiers de configuration pour initialiser la base de données.
