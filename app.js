const express = require('express');
const app = express();


const pgp = require('pg-promise')();
const connection = {
  host: 'containers-us-west-187.railway.app',
  port: 7572,
  database: 'railway',
  user: 'postgres',
  password: 'q1tXYJw2zY5aXZVh9NQW'
};
const db = pgp(connection);

(async () => {
    try {
      const client = await db.connect();
      console.log('Connected to database');
      //client.release();
    } catch (error) {
      console.error('Error connecting to database:', error);
      process.exit(1); // Keluar dari aplikasi dengan status error
    }
  })();

module.exports = db

app.listen(3000, () => {
    console.log('Server running on port 3000');
});