const express = require('express');
const app = express();
const db = require('../db/db');
app.set('view engine', 'ejs');

const inbox = async (req, res) => {
    if (req.method === 'GET' && !req.session.userId) {
        return res.redirect('/login'); // jika belum login, redirect ke halaman login
      
        } else{
            if (req.method === 'GET' && req.session.roleHRD) {
                try {
                    
                    // Menjalankan query untuk mendapatkan daftar pelamar
        
                    const results = await db.any( `SELECT jobs.tittle, jobseekers.jobseeker_id, jobseekers.name,  jobseeker_detail."exp", experience, education FROM jobseeker_detail
                    JOIN jobseekers ON jobseekers.jobseeker_id =  jobseeker_detail.jobseeker_id
                    JOIN applications ON jobseekers.jobseeker_id = applications.jobseeker_id 
                    JOIN jobs ON applications.job_id = jobs.job_id
                    JOIN employers ON jobs.employer_id = employers.employer_id 
                    WHERE employers.employer_id = ${req.session.userId} `);
                    //applicants.sessionUser = req.session.userName; // menambah data session ke ejs 
                   
                    res.render('inbox.ejs', { applicants: results });
        
                } catch (err) {
                    console.error('Error dalam melakukan query: ', err);
                    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pelamar' });
                }
            } else if (req.method === 'POST' && req.session.roleHRD) {
                const { sAcc, sRej } = req.body;
        
                if (sAcc && parseInt(sAcc)) {
                    const userId = parseInt(sAcc);
                    // Perform the database update code to set Accept
                    db.query(`UPDATE applications SET status = "Accept" WHERE jobseeker_id = ${userId}`);
                }
                if (sRej && parseInt(sRej)) {
                    const userId = parseInt(sRej);
                    // Perform the database update code to set Reject
                    db.query(`UPDATE applications SET status = "Reject" WHERE jobseeker_id = ${userId}`);
                }
                res.render('inbox.ejs');
            } else if (req.method === 'GET' && !req.session.roleHRD) {
                try {
                    const id = req.session.userId;
                    // Menjalankan query untuk mendapatkan daftar pelamar
                    const sql = `SELECT jobs.job_id, 'jobs.tittle', status FROM applications
                    JOIN jobs ON applications.application_id = jobs.job_id
                    WHERE applications.jobseeker_id ='${id}'`;
                    const { applicants } = await db.query(sql);
        
                    res.render('inbox.ejs', { applicants: applicants });
                } catch (err) {
                    console.error('Error dalam melakukan query: ', err);
                    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pelamar' });
                }
            }
        }
    
}

const myJobs = async (req, res) => {
    if (req.method === 'GET' && !req.session.userId) {
        return res.redirect('/login'); // jika belum login, redirect ke halaman login
      
        } else{
            if(req.method === 'GET'){
                try{
                    const jobs = await db.any(`SELECT jobs.job_id, jobs.tittle, jobs.desc, jobs.salary_min, jobs.salary_max, jobs.location, jobs.exp, categories.name
                    FROM categories
                    JOIN jobs ON categories.category_id = jobs.category_id
                    WHERE jobs.employer_id = ${req.session.userId};`);
                    res.render(`myJobs.ejs`, { jobs: jobs });
                }catch(err){
                    console.error('Error dalam melakukan query: ', err);
                    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pekerjaan' });
                }
            }else if(req.method==='POST'){
                try{
                    await db.query(`UPDATE jobs SET is_done = true WHERE job_id = ${req.body.is_done}`);
                    res.redirect(`/home/myJobs`);
                }catch(err){
                    console.error('Error dalam melakukan query: ', err);
                    res.status(500).json({ error: 'Terjadi kesalahan saat mengubah data pekerjaan' });
                }
            }
        }
   
}

module.exports = {
    inbox,
    myJobs
}
