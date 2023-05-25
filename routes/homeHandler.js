const express = require('express');
const app = express();
const router = express.Router();
const db = require('../db/db');
app.set('view engine', 'ejs');


const home = async (req, res) => {
  const searchTerm = req.body.search; // Kata yang diinputkan
  if (req.method === 'GET' && !req.session.userId) {
  return res.redirect('/login'); // jika belum login, redirect ke halaman login

  } else{
  // JIKA SEBAGAI JOB SEEKER
  if (req.method === 'GET' && !req.session.roleHRD) {  // load home sebagai jobseeker
    console.log(req.session.userId); // cetak id siapa yang login.
    try {
      // Lakukan query ke database untuk mendapatkan data card
      const jobs = await db.any('SELECT * FROM jobs');

      // Render file EJS 'cards.ejs' dan kirimkan data dari query
      res.render('home.ejs', { jobs: jobs });
    } catch (err) {
      console.error('Error dalam melakukan query: ', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data jobs' });
    }

  } else if (req.method === 'POST' && !req.session.roleHRD) {
    console.log('seacrh' + searchTerm);
    try {

      // Lakukan query ke database untuk mendapatkan data card
      const query = await db.any(`
          SELECT * FROM jobs
          WHERE tittle ILIKE '%${searchTerm}%'
        `);

      console.log('hasil' + query);
      // Render file EJS 'cards.ejs' dan kirimkan data dari query
      res.render('search.ejs', { jobs: query });

    } catch (err) {
      console.error('Error dalam melakukan query: ', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat melakukan query' });
    }
  }

  // JIKA SEBAGAI HRD
  if (req.method === 'GET' && req.session.roleHRD) { // load home sebagai hrd
    console.log(req.session.userId); // cetak id siapa yang login.
    try {
      // Lakukan query ke database untuk mendapatkan data jobs
      const jobs = await db.any('SELECT * FROM jobs');

      // Render file EJS 'home.ejs' dan kirimkan data dari query
      res.render('home.ejs', { jobs: jobs });
    } catch (err) {
      console.error('Error dalam melakukan query: ', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data jobs' });
    }
  } else if (req.method === 'POST' && req.session.roleHRD) {
    try {
      const searchTerm = req.body.search; // Kata yang diinputkan
      console.log('seacrh' + searchTerm);

      // Lakukan query ke database untuk mendapatkan data card
      const query = await db.any(`
          SELECT * FROM jobs
          WHERE tittle ILIKE '%${searchTerm}%'
        `);

      console.log('hasil' + query);
      // Render file EJS 'cards.ejs' dan kirimkan data dari query
      res.render('search.ejs', { jobs: query });

    } catch (err) {
      console.error('Error dalam melakukan query: ', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat melakukan query' });
    }
  }

}
}

const search = async (req, res) => {
  if (req.method === 'GET') {
    try {
      // Lakukan query ke database untuk mendapatkan data jobs
      const jobs = await db.any('SELECT * FROM jobs');

      // Render file EJS 'home.ejs' dan kirimkan data dari query
      res.render('search.ejs', { jobs: jobs });
    } catch (err) {
      console.error('Error dalam melakukan query: ', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data jobs' });
    }
  } else if (req.method === 'POST') {
    try {
      const searchTerm = req.body.search; // Kata yang diinputkan
      console.log('seacrh' + searchTerm);

      // Lakukan query ke database untuk mendapatkan data card
      const query = await db.any(`
          SELECT * FROM jobs
          WHERE tittle ILIKE '%${searchTerm}%'
        `);

      console.log('hasil' + query);
      // Render file EJS 'cards.ejs' dan kirimkan data dari query
      res.render('search.ejs', { jobs: query });

    } catch (err) {
      console.error('Error dalam melakukan query: ', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat melakukan query' });
    }
  }
}

const inbox = async (req, res) => {
  if (req.method === 'GET' && req.session.roleHRD) {
    try {
      // Menjalankan query untuk mendapatkan daftar pelamar
      const query = 'SELECT * FROM applications';
      const { rows } = await db.query(query);

      res.render('inbox.ejs', { applicants: rows });
    } catch (err) {
      console.error('Error dalam melakukan query: ', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pelamar' });
    }
  } else if (req.method === 'POST' && req.session.roleHRD) {
    const status = req.body.status;
    await db.query('UPDATE applications SET status = ${status} WHERE application_Id = ${rows.application_Id}');
    res.render('inbox.ejs');
  } else if (req.method === 'GET' && !req.session.roleHRD) {

  }
}

module.exports = {
  home,
  search
}
