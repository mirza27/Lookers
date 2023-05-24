const express = require('express');
const app = express();
const db = require('../db/db');
const pgp = db.$config.pgp;

// UNTUK LOGIN
const userLogin = async (req, res) => {
  if (req.method === 'GET'){
    res.render('login.ejs');
  } 
  else if (req.method === 'POST'){
    const { username, password } = req.body;
      
    try {
        // Ambil data pengguna dari database berdasarkan username
        const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);

        // Jika pengguna tidak ditemukan
        if (!user) {
          return res.send(`
                  <script>alert('Username atau Password salah!');</script>
                `);
        }
    
        // Verifikasi password
        const isPasswordValid = await password == user.password;

        // Jika password tidak valid
        if (!isPasswordValid) {
          return res.send(`
                  <script>alert('Username atau Password salah!');</script>
                `);
        }
        
        console.log(user);
        // Simpan ID pengguna dalam sesi
        req.session.isLoggedIn = true; // Menandai bahwa pengguna telah berhasil login
        req.session.userId = user.user_id; // set user id
        req.session.userName = user.username; // set username user
        req.session.roleHRD = user.is_employers; // set role user
      

        console.log("login berhasil sebagai", req.session.userName);
        
        res.redirect('/home'); // jika jobseeker
        /*
        if (req.session.roleHRD){
          res.redirect('/homeHRD'); // jika hrd
        } else{
          res.redirect('/home'); // jika jobseeker
        }
        */
      } catch (err) {
        console.error(err);
        res.send('Terjadi kesalahan');
      }
  };
}

// UNTUK REGISTRASI
const userRegister = (req, res) => {
  if (req.method === 'GET'){
    res.render('register.ejs');
  } 
  else if (req.method === 'POST'){
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
  }
}

// UNTUK LOGOUT
const userLogout = async (req, res) => {
  // Hapus sesi pengguna
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    console.log("pengguna telah logout");
    res.redirect('/login');
    
  });
};

module.exports = {
  userLogin,
  userLogout,
  userRegister
}
