const express = require('express');
const app = express();
const router = express.Router();
const db = require('../db/db');
app.set('view engine', 'ejs');

const addJob = async (req, res) => {
    if(req.method === 'GET'){
        res.render(`addJob.ejs`);
    } else if (req.method === 'POST') {
        const { id, tittle, category, desc, salary_min, salary_max, location, exp } = req.body;
        let category_id = 0;
        if(category==='full-time'){
            category_id=1;
        }else if(category==='part-time'){
            category_id=2;
        }else if(category==='harian'){
            category_id=3;
        }else if(category==='remote'){
            category_id=4;
        }
        
        try {
            const is_done = false;
            await db.query(`INSERT INTO jobs VALUES (${id}, ${category_id}, ${req.session.userId}, '${tittle}', '${desc}', ${salary_min}, ${salary_max}, '${location}', ${exp}, '${is_done}')`);
            //res.send(`<script>alert('Add Job Berhasil!.');</script>`);
            res.redirect(`/home/`);
        } catch (err) {
            console.error('Error dalam fungsi addJob: ', err);
            res.status(500).json({ error: 'Terjadi kesalahan saat menambah job' });
        }
    }
}

const addApp = async (req, res) => {
    if(req.method === 'GET'){
        res.render(`addApp.ejs`);
    } else if(req.method === 'POST') {
        const status = false;
        try {
            await db.query(`INSERT INTO applications VALUES (${req.session.userId}, ${req.body.job_id}, ${status})`);
            res.redirect(`/home`);
            //res.send(`<script>alert('Add Aplicant Berhasil!.');</script>`);
        } catch (err) {
            console.error('Error dalam fungsi addApp: ', err);
            res.status(500).json({ error: 'Terjadi kesalahan saat melamar job' });
        }
    }
}

module.exports = {
    addJob,
    addApp
}
