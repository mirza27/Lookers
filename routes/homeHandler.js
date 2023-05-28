const express = require('express');
const app = express();
const router = express.Router();
const db = require('../db/db');
app.set('view engine', 'ejs');

// HALAMAN HOME
const home = async (req, res) => {
  const searchTerm = req.body.search; // Kata yang diinputkan
  if (req.method === 'GET' && !req.session.userId) {
  return res.redirect('/login'); // jika belum login, redirect ke halaman login

  } else{
    // --------------JIKA SEBAGAI JOB SEEKER --------------
    if (req.method === 'GET' && !req.session.roleHRD) {  // load home sebagai jobseeker
      console.log(req.session.userId); // cetak id siapa yang login.
      try {
        // Lakukan query ke database untuk mendapatkan data card
        const jobs = await db.any(`SELECT * FROM jobs
        JOIN employers ON employers.employer_id = jobs.employer_id WHERE is_done = 'false' ORDER BY job_id LIMIT 4`);
        jobs.sessionUser = req.session.userName; // menambah data session ke ejs
        jobs.role = req.session.roleHRD;

        // query untuk ambil data nama lengkap
        var user = await db.oneOrNone(`SELECT name FROM jobseekers WHERE jobseeker_id = $1`, [req.session.userId]);
        jobs.fullName  = user.name

        // Render file EJS 'cards.ejs' dan kirimkan data dari query
        res.render('homeJS.ejs', { jobs: jobs });


      } catch (err) {
        console.error('Error dalam melakukan query: ', err);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data jobs' });
      }

    } else if (req.method === 'POST' && !req.session.roleHRD) { // post di search
      
      try {

        // Lakukan query ke database untuk mendapatkan data card
        const jobs = await db.any(`
        SELECT job_id, employers.company_name, jobs.location, tittle,  salary_min, salary_max , category_id, jobs.desc FROM jobs 
        JOIN employers ON employers.employer_id = jobs.employer_id
          WHERE is_done = false AND (tittle ILIKE '%${searchTerm}%' OR jobs.location ILIKE '%${searchTerm}%'); 
          `);
        

       
        // Render file EJS 'cards.ejs' dan kirimkan data dari query
        res.render('searchJS.ejs', { jobs: jobs });

      } catch (err) {
        console.error('Error dalam melakukan query: ', err);
        res.status(500).json({ error: 'Terjadi kesalahan saat melakukan query' });
      }
    }
    

    //-------------- JIKA SEBAGAI HRD--------------
    if (req.method === 'GET' && req.session.roleHRD) {  // load home sebagai jobseeker
      console.log(req.session.userId); // cetak id siapa yang login.
      try {
        // Lakukan query ke database untuk mendapatkan data card
        const jobs = await db.any(`SELECT * FROM jobs WHERE employer_id = ${req.session.userId} LIMIT 4`);
        jobs.sessionUser = req.session.userName; // menambah data session ke ejs
        
        // query untuk ambil data nama lengkap
        var company = await db.oneOrNone(`SELECT company_name FROM employers WHERE employer_id = $1`, [req.session.userId]);
        jobs.company  = company.company_name

        // Render file EJS 'cards.ejs' dan kirimkan data dari query
        res.render('homeHRD.ejs', { jobs: jobs });


      } catch (err) {
        console.error('Error dalam melakukan query: ', err);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data jobs' });
      }

    } else if (req.method === 'POST' && req.session.roleHRD) { // post di search
      
      try {

        // Lakukan query ke database untuk mendapatkan data card
        const jobs = await db.any(`
        SELECT job_id, employers.company_name, jobs.location, tittle,  salary_min, salary_max , category_id, jobs.desc FROM jobs 
        JOIN employers ON employers.employer_id = jobs.employer_id
          WHERE is_done = false AND (tittle ILIKE '%${searchTerm}%' OR jobs.location ILIKE '%${searchTerm}%'); 
          `);
          jobs.isHrd = req.session.roleHRD
        
        // Render file EJS 'cards.ejs' dan kirimkan data dari query
        res.render('searchHRD.ejs', { jobs: jobs });

      } catch (err) {
        console.error('Error dalam melakukan query: ', err);
        res.status(500).json({ error: 'Terjadi kesalahan saat melakukan query' });
      }
    }
  }
}  


const profil = async (req, res) => {
  if (req.method === 'GET' && !req.session.roleHRD) {
    try {
      // Menjalankan query untuk mendapatkan daftar pelamar
      const query = `SELECT * FROM users JOIN jobseekers ON users.user_id = jobseekers.jobseeker_id JOIN jobseekers_detail ON jobseekers.jobseeker_id = jobseekers.jobseeker_id WHERE jobseeker_id = ${req.session.userId}`;
      const profil = await db.query(query);

      res.render('profile.ejs', { profil });
    } catch (err) {
      console.error('Error dalam melakukan query: ', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pelamar' });
    }
  } else if (req.method === 'POST' && !req.session.roleHRD) {
    
  } else if (req.method === 'GET' && !req.session.roleHRD) {

  }
}


module.exports = {
  home,
  profil
}
