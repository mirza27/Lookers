const express = require('express');
const app = express();
const router = express.Router();
const db = require('../db/db');
app.set('view engine', 'ejs');

const inbox = async (req, res) => {
    if (req.method === 'GET' && req.session.roleHRD) {
        try {
            const id = req.session.userId;
            // Menjalankan query untuk mendapatkan daftar pelamar
            const sql = `SELECT jobseekers.jobseeker_id, jobseekers.name, 'exp', experience, education FROM jobseeker_detail
            JOIN jobseekers ON jobseekers.jobseeker_id =  jobseeker_detail.jobseeker_id
            JOIN applications ON jobseekers.jobseeker_id = applications.jobseeker_id 
            JOIN jobs ON applications.job_id = jobs.job_id
            JOIN employers ON jobs.employer_id = employers.employer_id 
            WHERE employers.employer_id ='${id}'`;

            const { applicants } = await db.query(sql);
            applicants.sessionUser = req.session.userName; // menambah data session ke ejs
            
            res.render('inbox.ejs', { applicants: applicants });

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

const myJobs = async (req, res) => {
    if(req.method === 'GET'){
        const jobs = await db.any(`SELECT * FROM jobs WHERE employer_id = ${req.session.userId}`);
        res.redirect(`myJobs.ejs`, { jobs: jobs });
    }
}

module.exports = {
    inbox,
    myJobs
}
