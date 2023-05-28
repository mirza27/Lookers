const express = require('express');
const app = express();
const db = require('../db/db');
app.set('view engine', 'ejs');

// Halaman inbox saya (hrd)
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
                    WHERE employers.employer_id = ${req.session.userId} AND applications.status = 'waiting';`);
                    //applicants.sessionUser = req.session.userName; // menambah data session ke ejs 
                   
                    res.render('inbox.ejs', { applicants: results });
        
                } catch (err) {
                    console.error('Error dalam melakukan query: ', err);
                    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pelamar' });
                }
            } else if (req.method === 'POST' && req.session.roleHRD) {
                const { sAcc, sRej } = req.body;
                

                // menerima / menolak lamaran
                if (sAcc && parseInt(sAcc)) {
                    const userId = parseInt(sAcc);
                    // Perform the database update code to set Accept
                    db.query(`UPDATE applications SET status = "accepted" WHERE jobseeker_id = ${userId}`);

                    res.redirect("/home/inbox") // load lagi halaman
                }
                if (sRej && parseInt(sRej)) {
                    const userId = parseInt(sRej);
                    // Perform the database update code to set Reject
                    db.query(`UPDATE applications SET status = "rejected" WHERE jobseeker_id = ${userId}`);

                    res.redirect("/home/inbox")  // load lagi halaman
                }
        }
}
}

// Halaman lamaran saya
const myApply = async (req, res) => {
    if (req.method === 'GET' && !req.session.userId) {
        return res.redirect('/login'); // jika belum login, redirect ke halaman login
      
        } else{
            try {
                const id = req.session.userId;
                // Menjalankan query untuk mendapatkan daftar pelamar
                const sql = `SELECT application_id, jobs.tittle, status, employers.company_name FROM applications
                JOIN jobs ON applications.job_id = jobs.job_id
                JOIN employers ON employers.employer_id = jobs.employer_id
                           WHERE applications.jobseeker_id = ${id}`;
                const applicants = await db.query(sql);
    
                res.render('myApply.ejs', { applicants: applicants });
            } catch (err) {
                console.error('Error dalam melakukan query: ', err);
                res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pelamar' });
            }
        }
}


module.exports = {
    inbox,
    myApply
}
