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
      res.send(`
              <script>alert('Username sudah terdaftar.');</script>
            `);
      res.redirect('/register');
    }else{
      try{
        // Tambahkan user baru ke database
        await db.query('INSERT INTO users(username, email, password, is_employers) VALUES ($1, $2, $3, $4)', [username, email, password, role]);
        const user_id = await db.oneOrNone('SELECT user_id FROM users WHERE username = $1', [username]);
       
        var id = parseInt(user_id.user_id); // id sebagai param
        
        // generate url dengan param
        if(role == true){ // jika sebagai hrd
          var pathredirect = '/register/hrd/' + id;
        }else{ // jika sebagai jobseeker
          var pathredirect = '/register/js/' + id;
        }
        
        res.redirect(pathredirect);
        
      }catch (err){
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
const id = parseInt(req.params.id); // ambil param

  if(req.method === 'GET'){
    res.render('regisJobseeker.ejs');

  }else if(req.method === 'POST'){

    const { nama, contact,address, experience, gender, education, exp} = req.body;
    
    // generate kolom is_female true or false
    let genders = false;
    if (gender === 'perempuan')
        genders = true;

    try{
      // insert data ke tabel jobseekers dan jobseeker_detail
      var sql = `
      INSERT INTO jobseekers VALUES ($1, $2, $3, $4, $5);
      INSERT INTO jobseeker_detail VALUES ($6, $7, $8, $9);
      `
      await db.query(sql, 
      [id, nama, contact, address, genders, id, experience, education, exp]);

    }
    
    catch (err){ // jika ada error
      console.log(err);
      res.send(`
            <script>alert('Terjadi kesalahan saat melakukan register.');</script>
          `);
    }
    res.redirect('/login');
  }
}

// REGISTRASI SEBAGAI HRD
const regisHRD = async (req, res) => {
const id = parseInt(req.params.id); // ambil param
  if(req.method === 'GET'){
    res.render('regisHRD.ejs');

  }else if(req.method === 'POST'){
    const {companyName, contact, address, companyDesc} = req.body;

    try{
      // insert data ke tabel jobseekers dan jobseeker_detail
      var sql = `
      INSERT INTO employers VALUES ($1, $2, $3, $4, $5)
      `
      await db.query(sql, [id, companyName, contact, address, companyDesc]);

    }
    
    catch (err){ // jika ada error
      console.log(err);
      res.send(`
      <script>alert('Terjadi kesalahan saat melakukan register.');</script>
      `); 
    }
    res.redirect('/login');
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
