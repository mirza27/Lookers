const express = require('express');
const router = express.Router();
const db =  require('./db');
const app = require('./app');


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');
// Halaman login
app.get('/login', (req, res) => {
    res.render("login.ejs");
});

// Proses login
app.post('/login', (req, res) => {
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

// Halaman register
app.get('/register', (req, res) => {
    res.send(`
        <form method="POST" action="/register">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Register</button>
        </form>
    `);
});

// Halaman register
app.get('/register', (req, res) => {
    res.render("register.ejs");
});

// Proses register
app.post('/register', (req, res) => {
    const { id, username, email, password, jenis } = req.body;
    let isEmployee = false; // Variable to store the converted jenis value

    if (jenis === 'employee') {
        isEmployee = true;
    }

    // Periksa apakah username sudah ada di database
    pool.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
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

// Jalankan server
