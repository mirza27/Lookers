const express = require('express');
const router = express.Router();
const app = express();

// Konfigurasi koneksi PostgreSQL
const pool = require('./app');
const port = 3000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');

// Halaman Home
app.get('/home', (req, res) => {
    // Query untuk mengambil nilai dari kolom "nama" dalam tabel "job"
    const query = 'SELECT tittle FROM jobs';
    
    // Melakukan query ke database
    pool.query(query, (err, results) => {
        if (err) throw err;

        // Mengirimkan data hasil query ke template EJS
        res.render('home', { jobs: results });
    });
    
});

// Halaman Search
app.get('/search', (req, res) => {
    // Query untuk mengambil nilai dari kolom "nama" dalam tabel "job"
    let query = 'SELECT tittle FROM jobs';
    
    // Mengambil nilai dari parameter "search" pada query string
    const search = req.query.search || '';

    // Menambahkan kondisi WHERE pada query untuk mencocokkan kolom "nama" dengan nilai "search"
    query += ` WHERE tittle LIKE '%${search}%'`;
    // Melakukan query ke database
    pool.query(query, (err, results) => {
        if (err) throw err;

        // Mengirimkan data hasil query ke template EJS
        res.render('home', { jobs: results });
    });
    
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
