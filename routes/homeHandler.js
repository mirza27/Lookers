const express = require('express');
const app = express();
const router = express.Router();
const db = require('../db/db');
app.set('view engine', 'ejs');


const home = async (req, res) => {
  if (req.method === 'GET' && !req.session.userId) {
    return res.redirect('/login'); // jika belum login, redirect ke halaman login

  } else{
    // JIKA SEBAGAI JOB SEEKER
    if (req.method === 'GET' && !req.session.roleHRD){  // load home sebagai jobseeker
      console.log(req.session.userId); // cetak id siapa yang login.
      res.render('home.ejs'); // render tampilan home.ejs jika sudah login

    } else if (req.method === 'POST' && !req.session.roleHRD){
      try {
    const searchTerm = req.query.keyword; // Kata yang diinputkan

    const query = `
      SELECT * FROM jobs
      WHERE name LIKE '%${searchTerm}%'
    `;

    const results = await new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.render('home', { jobs: results });
  } catch (err) {
    console.error('Error dalam melakukan query: ', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat melakukan query' });
  }
      }
    }

    // JIKA SEBAGAI HRD
    if (req.method === 'GET' && req.session.roleHRD){ // load home sebagai hrd
      console.log(req.session.userId); // cetak id siapa yang login.
      res.render('home.ejs'); // render tampilan home.ejs jika sudah login
    }else if (req.method === 'POST' && req.session.roleHRD){
      try {
    const searchTerm = req.query.keyword; // Kata yang diinputkan

    const query = `
      SELECT * FROM jobs
      WHERE name LIKE '%${searchTerm}%'
    `;

    const results = await new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.render('home', { jobs: results });
  } catch (err) {
    console.error('Error dalam melakukan query: ', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat melakukan query' });
  }
    }

  }


const inbox = async (req, res) => {
  try {
    // Menjalankan query untuk mendapatkan daftar pelamar
    const query = 'SELECT * FROM applicants';
    const { rows } = await pool.query(query);

    res.render('inbox', { applicants: rows });
  } catch (err) {
    console.error('Error dalam melakukan query: ', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pelamar' });
  }
}
module.exports = {
  home
}
