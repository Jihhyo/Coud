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





// Route pour l'authentification
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Pseudo et mot de passe sont obligatoires.' });
    }

    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password])
        .then(([results]) => {
            if (results.length === 0) {
                return res.status(401).json({ message: 'Pseudo ou mot de passe incorrect.' });
            }
            res.status(200).json({ message: 'Connexion réussie !', user: results[0] });
        })
        .catch(err => {
            console.error('Erreur de requête SQL:', err);
            res.status(500).json({ message: 'Erreur serveur.' });
        });
});


// Test de connexion à la base de données
db.getConnection()
    .then(() => console.log('Connexion réussie à la base de données'))
    .catch(err => console.error('Erreur de connexion à la base de données:', err));


    //demarre le serveur 
const PORT = 4002;
app.listen(PORT, () => {
    console.log(`Service Auth écoute sur le port ${PORT}`);
});










