const express = require('express');
const router = express.Router();
const app = express();
const db = require('../db/db');
const pgp = db.$config.pgp;

// Halaman login
router.get('/', (req, res) => {
    res.render('login.ejs');
});

// Proses login
router.post('/', async(req, res) => {
    const { username, password } = req.body;

    try {
        // Ambil data pengguna dari database berdasarkan username
        const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);

        // Jika pengguna tidak ditemukan
        if (!user) {
          return res.send('Username atau password salah!');
        }
    
        // Verifikasi password
        const isPasswordValid = await password == user.password;

        // Jika password tidak valid
        if (!isPasswordValid) {
          return res.send('Username atau password salah!');
        }
    
        // Simpan ID pengguna dalam sesi
        req.session.isLoggedIn = true; // Menandai bahwa pengguna telah berhasil login
        req.session.userId = user.user_id;
        req.session.userName = user.user_name; // 
        res.send('Anda Telah masuk  .');
    
      } catch (err) {
        console.error(err);
        res.send('Terjadi kesalahan');
      }
});

module.exports = router;
