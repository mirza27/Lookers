const express = require('express');
const app = express();
const db = require('../db/db');
app.set('view engine', 'ejs');

const addJob = async (req, res) => {
    if (req.method === 'GET' && !req.session.userId) {
        return res.redirect('/login'); // jika belum login, redirect ke halaman login

    } else {
        if (req.method === 'GET') {
            res.render(`addJob.ejs`);
        } else if (req.method === 'POST') {
            const { id, tittle, category, desc, salary_min, salary_max, location, exp } = req.body;
            let category_id;
            switch (category) {
                case 'Teacher':
                    category_id = 1;
                    break;
                case 'Engineer':
                    category_id = 2;
                    break;
                case 'Chef':
                    category_id = 3;
                    break;
                case 'IT':
                    category_id = 4;
                    break;
                case 'Accountant':
                    category_id = 5;
                    break;
                default:
                    category_id = 0;
                    break;
            }

            try {
                const is_done = false;
                await db.query(`INSERT INTO jobs VALUES (${id}, ${category_id}, ${req.session.userId}, '${tittle}', '${desc}', ${salary_min}, ${salary_max}, '${location}', ${exp}, '${is_done}')`);
                // if(insert){
                //     const alert = 'Berhasil Menambahkan Job';
                //     res.render('homeHRD.ejs', {alert});
                // }
                res.redirect('/home');
            } catch (err) {
                console.error('Error dalam fungsi addJob: ', err);
                res.status(500).json({ error: 'Terjadi kesalahan saat menambah job' });
            }
        }
    }

}

const addApp = async (req, res) => {
    if (req.method === 'GET' && !req.session.userId) {
        return res.redirect('/login'); // jika belum login, redirect ke halaman login

    } else {
        if (req.method === 'GET') {
            //mengambil nilai job_id dari url sebagai parameter SELECT
            const jobId = req.query.job_id;
            const id = parseInt(jobId);
        try {
            //Mengambil semua data untuk ditampilkan dalam lamaran
            const job = await db.query(`SELECT * FROM jobs WHERE job_id = ${id}`);
            res.render(`addApp.ejs`, { job: job });
        } catch (err) {
            console.error('Error dalam fungsi addApp: ', err);
            res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data job' });
        }
    } else if (req.method === 'POST') {
        const status = false;
        try {
            await db.query(`INSERT INTO applications VALUES (${req.session.userId}, ${req.body.id}, ${status})`);
            // if(insert){
            //     const alert = 'Berhasil Menambahkan Job';
            //     res.render('addApp.ejs', {alert});
            // }
            res.redirect('/home');
        } catch (err) {
            console.error('Error dalam fungsi addApp: ', err);
            res.status(500).json({ error: 'Terjadi kesalahan saat melamar job' });
        }
    }
}

}

module.exports = {
    addJob,
    addApp
}
