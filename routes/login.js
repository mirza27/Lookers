const express = require('express');
const router = express.Router();
const app = express();
const db =  require('../db/db');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Halaman login
router.get('/', (req, res) => {
    res.render("login.ejs");
});

// Proses login
router.post('/', (req, res) => {
    const { username, password } = req.body;

    // Periksa kecocokan data login dengan data di database
    db.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (err, result) => {
        if (err) {
            console.log(err);
            res.send('Terjadi kesalahan saat melakukan login.');
        } else {
            if (result.rowCount === 1) {
                res.send('Login berhasil!');
            } else {
                res.send('Username atau password salah.');
            }
        }
    });
});

module.exports = router;
