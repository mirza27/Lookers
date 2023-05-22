const express = require('express');
const router = express.Router();
const app = express();
const db =  require('../db/db');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Halaman register
router.get('/', (req, res) => {
    res.render("register.ejs");
});

// Proses register
router.post('/', (req, res) => {
    const { id, username, email, password, jenis } = req.body;
    let isEmployee = false; // Variable to store the converted jenis value

    if (jenis === 'employee') {
        isEmployee = true;
    }

    // Periksa apakah username sudah ada di database
    db.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
        if (err) {
            console.log(err);
            res.send('Terjadi kesalahan saat melakukan register.');
        } else {
            if (result.rowCount === 0) {
                // Tambahkan user baru ke database
                pool.query('INSERT INTO users VALUES ($1, $2, $3, $4, $5)', [id, username, email, password, isEmployee], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.send('Terjadi kesalahan saat melakukan register.');
                    } else {
                        res.send('Registrasi berhasil!');
                    }
                });
            } else {
                res.send('Username sudah terdaftar.');
            }
        }
    });
});

module.exports = router;
