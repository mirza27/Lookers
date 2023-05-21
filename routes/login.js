const express = require('express');
const router = express.Router();
const db =  require('./db');



app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Halaman login
app.get('/login', (req, res) => {
    res.send(`
    <form method="POST" action="/login">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Login</button>
    </form>
    `);
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

// Proses register
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Periksa apakah username sudah ada di database
    db.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
        if (err) {
            console.log(err);
            res.send('Terjadi kesalahan saat melakukan register.');
        } else {
            if (result.rowCount === 0) {
                // Tambahkan user baru ke database
                pool.query('INSERT INTO users VALUES ($1, $2)', [username, password], (err, result) => {
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
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
