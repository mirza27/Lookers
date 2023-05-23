const express = require('express');
const router = express.Router();
const db = require('../db/db');
const pgp = db.$config.pgp;

// Halaman login
router.get('/', (req, res) => {
    res.render('login.ejs');
});

// Proses login
router.post('/', (req, res) => {
    const { username, password } = req.body;

    // Periksa kecocokan data login dengan data di database
    db.query('SELECT is_employers FROM users WHERE username = $1 AND password = $2', [username, password], pgp.queryResult.one)
    .then(result => {
        res.redirect('/home/?name=' + encodeURIComponent(req.body.username));
    })
    .catch(error => {
        // Handle any errors
        console.error(error);
        res.send('Username atau password salah.');
    });
});

module.exports = router;
