const express = require('express');
const router = express.Router();
const app = express();
const db = require('../db/db');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Halaman Home
router.get('/', (req, res) => {
    res.render('home.ejs');

    
});

// Halaman Search
router.get('/search', (req, res) => {
    // Query untuk mengambil nilai dari kolom "nama" dalam tabel "job"
    let query = 'SELECT tittle FROM jobs';
    
    // Mengambil nilai dari parameter "search" pada query string
    const search = req.query.search || '';

    // Menambahkan kondisi WHERE pada query untuk mencocokkan kolom "nama" dengan nilai "search"
    query += ` WHERE tittle LIKE '%${search}%'`;
    // Melakukan query ke database
    db.query(query, (err, results) => {
        if (err) throw err;

        // Mengirimkan data hasil query ke template EJS
        res.render('home', { jobs: results });
    });
    
});

module.exports = router;