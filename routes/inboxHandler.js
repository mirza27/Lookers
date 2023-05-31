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
                    const results = await db.any( `SELECT jobs.tittle, jobseekers.jobseeker_id, jobseekers.name, applications.application_id, jobseeker_detail."exp", experience, education FROM jobseeker_detail
                    JOIN jobseekers ON jobseekers.jobseeker_id =  jobseeker_detail.jobseeker_id
                    JOIN applications ON jobseekers.jobseeker_id = applications.jobseeker_id 
                    JOIN jobs ON applications.job_id = jobs.job_id
                    JOIN employers ON jobs.employer_id = employers.employer_id 
                    WHERE employers.employer_id = ${req.session.userId} AND applications.status = 'waiting'`);
                    results.sessionUser = req.session.userName; // menambah data session ke ejs 
                   
                    var company = await db.oneOrNone(`SELECT company_name FROM employers WHERE employer_id = $1`, [req.session.userId]);
                    results.company  = company.company_name

                    res.render('inbox.ejs', { applicants: results });
        
                } catch (err) {
                    console.error('Error dalam melakukan query: ', err);
                    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pelamar' });
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
                applicants.sessionUser = req.session.userName;
    
                res.render('myApply.ejs', { applicants: applicants });
            } catch (err) {
                console.error('Error dalam melakukan query: ', err);
                res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pelamar' });
            }
        }
}

const delApp = async (req, res) => {
    if (req.method === 'GET' && !req.session.userId) {
        return res.redirect('/login'); // jika belum login, redirect ke halaman login
    }else{
        const { app_id } = req.body;

        try{
            await db.query(`DELETE FROM applications WHERE application_id = ($1)`, [app_id])
        } 
        catch (err) {
            console.error('Error dalam fungsi addApp: ', err);
            res.status(500).json({ error: 'Terjadi kesalahan saat menghapus lamaran' });
        }

        res.redirect("/home/myApply") // load ulang halaman
    }
}


module.exports = {
    inbox,
    myApply,
    delApp
}
