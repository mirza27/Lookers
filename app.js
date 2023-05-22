const express = require('express');
const router = express.Router();
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

const { Pool } = require('pg');

// Configure the database connection parameters
const pool = new Pool({
    user: 'postgres',
    host: 'containers-us-west-187.railway.app',
    database: 'railway',
    password: 'q1tXYJw2zY5aXZVh9NQW',
    port: 7572,
});

(async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to database');
    //client.release();
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1); // Keluar dari aplikasi dengan status error
  }
})();

app.use(express.static("public"));

const loginRouter = require("./routes/login");
const homeRouter = require("./routes/home");

app.use("/login", loginRouter);
app.use("/home", homeRouter);

module.exports = pool;

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

module.exports = app;
