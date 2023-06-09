const express = require('express');
const app = express();
const router = express.Router();
const db = require('../db/db');
app.set('view engine', 'ejs');

// HALAMAN HOME
const home = async (req, res) => {
  const searchTerm = req.body.query; // Kata yang diinputkan
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
        SELECT job_id, employers.company_name, jobs.location, tittle,  salary_min, salary_max, exp, category_id, jobs.desc FROM jobs 
        JOIN employers ON employers.employer_id = jobs.employer_id
          WHERE is_done = false AND (tittle ILIKE '%${searchTerm}%' OR jobs.location ILIKE '%${searchTerm}%'); 
          `);
        
        jobs.sessionUser = req.session.userName;

        // Render file EJS 'cards.ejs' dan kirimkan data dari query
        res.render('searchJSfix.ejs', { jobs: jobs });

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
        SELECT job_id, employers.company_name, jobs.location, tittle,  salary_min, salary_max, exp, category_id, jobs.desc FROM jobs 
        JOIN employers ON employers.employer_id = jobs.employer_id
          WHERE is_done = false AND (tittle ILIKE '%${searchTerm}%' OR jobs.location ILIKE '%${searchTerm}%'); 
          `);
          jobs.isHrd = req.session.roleHRD


          console.log("company", jobs.company_name)
        // Render file EJS 'cards.ejs' dan kirimkan data dari query
        res.render('searchHRDfix.ejs', { jobs: jobs });

      } catch (err) {
        console.error('Error dalam melakukan query: ', err);
        res.status(500).json({ error: 'Terjadi kesalahan saat melakukan query' });
      }
    }
  }
}  


const profil = async (req, res) => {
  if (req.method === 'GET' && !req.session.userId) {
    return res.redirect('/login'); // jika belum login, redirect ke halaman login
  }else{
    //-------------- JIKA SEBAGAI JS--------------
    if (req.method === 'GET' && !req.session.roleHRD) {
    try {
      // Menjalankan query untuk mendapatkan daftar pelamar
      const query = await db.oneOrNone(`SELECT * FROM users 
      JOIN jobseekers ON users.user_id = jobseekers.jobseeker_id 
      JOIN jobseeker_detail ON jobseekers.jobseeker_id = jobseeker_detail.jobseeker_id 
      WHERE jobseekers.jobseeker_id = ${req.session.userId}`);

      query.sessionUser = req.session.userName;

      res.render('profiljs.ejs', { user : query });
    } catch (err) {
      console.error('Error dalam get profil: ', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pelamar' });
    }
  } else if (req.method === 'POST' && !req.session.roleHRD) {

    //mengolah input
    const { email, name, contact, address, experience, education, exp } = req.body;
    
    try{

      await db.query(`UPDATE users SET email = '${email}' WHERE user_id = ${req.session.userId}`)
      await db.query(`UPDATE jobseekers SET name = '${name}', contact_number = '${contact}', address = '${address}' WHERE jobseeker_id = ${req.session.userId}`);
      await db.query(`UPDATE jobseeker_detail SET experience = '${experience}', education = '${education}', exp = '${exp}' WHERE jobseeker_id = ${req.session.userId}`)
      

    }catch(err){
      console.error('Error dalam post profil: ', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengubah data pelamar' });
    }

    res.redirect("/home/profile")

    //-------------- JIKA SEBAGAI HRD--------------
  } else if (req.method === 'GET' && req.session.roleHRD) {
    try{
      const user = await db.oneOrNone(`SELECT * FROM users 
      JOIN employers ON users.user_id = employers.employer_id 
      WHERE employer_id = ${req.session.userId}`);

      res.render('profilhrd.ejs', {user:user});

    }catch(err){
      console.error('Error dalam get profil: ', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pekerja' });
    }
  } else if (req.method==='POST' && req.session.roleHRD) {
    const {email, name, contact, address, desc } = req.body; // ambil data dari form


    try{
      await db.query(`UPDATE employers SET company_name = '${name}', 
      contact_number = ${contact}, address = '${address}', 
      company_desc = '${desc}' WHERE employer_id = ${req.session.userId} ;
      
      UPDATE users SET email = '${email}' WHERE user_id = ${req.session.userId} ;`);


    }catch(err){
      console.error('Error dalam post profil: ', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengubah data pekerja' });
    }
    res.redirect("/home/profile");
  }
}
}
module.exports = {
  home,
  profil
}
