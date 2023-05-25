const express = require('express');
const app = express();
const router = express.Router();
const db = require('../db/db');
app.set('view engine', 'ejs');

const inbox = async (req, res) => {
    if (req.method === 'GET' && req.session.roleHRD) {
        try {
            const id = req.params.id;
            // Menjalankan query untuk mendapatkan daftar pelamar
            const sql = `SELECT * FROM employers JOIN jobs ON employers.employer_Id = jobs.job_Id JOIN applications ON jobs.job_Id = applications.application_Id WHERE employers.employer_id ='%${id}%'`
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
            const id = req.params.id;
            // Menjalankan query untuk mendapatkan daftar pelamar
            const sql = 'SELECT ${id} FROM jobseekers JOIN applications ON jobseekers.jobseeker_Id = applications.application_Id JOIN jobs ON applications.application_Id = jobs.job_Id';
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
