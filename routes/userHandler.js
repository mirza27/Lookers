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
          res.redirect('/login');
          res.send(`
                  <script>alert('Username atau Password salah!');</script>
                `);
        }
    
        // Verifikasi password
        const isPasswordValid = await password == user.password;

        // Jika password tidak valid
        if (!isPasswordValid) {
          res.redirect('/login');
          res.send(`
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
const userRegister = async (req, res) => {
  if (req.method === 'GET'){
    res.render('register.ejs');
  } 
  else if (req.method === 'POST'){
    const { username, email, password, role } = req.body;

    // Periksa apakah username sudah ada di database
    const cek = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
    if (cek) {
      res.redirect('/register');
      res.send(`
              <script>alert('Username sudah terdaftar.');</script>
            `);
    }else{
      try{
        // Tambahkan user baru ke database
        await db.query('INSERT INTO users VALUES ($1, $2, $3, $4)', [username, email, password, isEmployee]);
        const user_id = await db.oneOrNone('SELECT user_id FROM users WHERE username = $1', [username]);

        setTimeout(() => {
          res.send('Registrasi berhasil!');
        }, 1000);

        if(role == true){ // jika sebagai hrd
          res.redirect('/register/hrd/${user_id}');
        }else{ // jika sebagai jobseeker
          res.redirect('/register/js/${user_id}');
        }

      }catch {
        console.log(err);
        return res.send(`
                    <script>alert('Terjadi kesalahan saat melakukan register.');</script>
                  `);
      } 
    }
  };
}

// REGISTRASI SEBAGAI JOBSEEKER
const regisJS = async (req, res) => {
  const user_id = req.params.user_id; // ambil param

  if(req.method === 'GET'){
    res.render('regisJobseeker.ejs');

  }else if(req.method === 'POST'){
    const { nama, contact,address, experience, gender, education, exp} = req.body;
    
    let genders = false;
    if (gender === 'perempuan')
        genders = true;

    var data_js = [user_id, nama, contact, address, gender];
    var data_jsd = [user_id, experience, education, exp];

    try{
      // insert data ke tabel jobseekers dan jobseeker_detail
      var sql = `
      INSERT INTO jobseekers VALUES (?);
      INSERT INTO jobseekers_detail VALUES (?);
      `
      await db.query(sql, 
      [data_js, data_jsd]);

      setTimeout(() => {res.send('Registrasi berhasil!');}, 1000);
        res.redirect('/login');
    }
    
    catch{ // jika ada error
      res.redirect('/register');
      res.send(`
            <script>alert('Terjadi kesalahan saat melakukan register.');</script>
          `);
    }
  }
}

// REGISTRASI SEBAGAI HRD
const regisHRD = async (req, res) => {
  const user_id = req.params.user_id; // ambil param

  if(req.method === 'GET'){
    res.render('regisHRD.ejs');

  }else if(req.method === 'POST'){
    const {companyName, contact, address, companyDesc} = req.body;

    var data_hrd = [user_id,nama, contact, address, gender];

    try{
      // insert data ke tabel jobseekers dan jobseeker_detail
      var sql = `
      INSERT INTO employers VALUES (?);
      `
      await db.query(sql, 
      [data_js]);

      setTimeout(() => {res.send('Registrasi berhasil!');}, 1000);
        res.redirect('/login');
    }
    
    catch{ // jika ada error
      res.redirect('/register');
      res.send(`
            <script>alert('Terjadi kesalahan saat melakukan register.');</script>
          `);
    }
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
  userRegister,
  regisJS,
  regisHRD
}
