const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Assurez-vous que ce fichier existe et est correctement configuré.

const app = express();

//configuration du cors
app.use(cors({
    origin: 'http://localhost:3000', // Autorise uniquement le frontend
    methods: ['GET', 'POST'],
    credentials: true, // Si vous utilisez des cookies ou des sessions
    allowedHeaders: ['Content-Type']
}));


app.use(bodyParser.json());

// Route pour l'inscription
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    console.log("Requête reçue avec :", username, password);

    if (!username || !password) {
        console.log("Erreur : pseudo ou mot de passe manquant.");
        return res.status(400).json({ message: 'Pseudo et mot de passe sont obligatoires.' });
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const [existingUsers] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        console.log("Utilisateurs existants :", existingUsers);

        if (existingUsers.length > 0) {
            console.log("Erreur : pseudo déjà utilisé.");
            return res.status(400).json({ message: 'Ce pseudo est déjà utilisé.' });
        }

        // Créer un nouvel utilisateur
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        console.log("Utilisateur créé avec succès :", username);
        res.status(201).json({ message: 'Compte créé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la création du compte:', error);
        res.status(500).json({ message: 'Erreur lors de la création du compte.' });
    }
});


// Test de connexion à la base de données
db.getConnection()
    .then(() => console.log('Connexion réussie à la base de données'))
    .catch(err => console.error('Erreur de connexion à la base de données:', err));

// Démarrer le serveur
const PORT = 4001;
app.listen(PORT, () => {
    console.log(`Register service is running on port ${PORT}`);
});
