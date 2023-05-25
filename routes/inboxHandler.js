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

            res.render('inbox.ejs', { applicants: applicants });
        } catch (err) {
            console.error('Error dalam melakukan query: ', err);
            res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pelamar' });
        }
    } else if (req.method === 'POST' && req.session.roleHRD) {
        const status = req.body.status;
        await db.query('UPDATE applications SET status = ${status} WHERE application_Id = ${rows.application_Id}');
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

module.exports = {
    inbox
}
