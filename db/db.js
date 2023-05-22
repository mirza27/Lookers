const pgp = require("pg-promise")();

// load database
const connection = {
    host: "containers-us-west-187.railway.app",
    port: 7572,
    database: "railway",
    user: "postgres",
    password: "q1tXYJw2zY5aXZVh9NQW",
  };
  const db = pgp(connection);
  
  (async () => {
    try {
      const client = await db.connect();
      console.log("Connected to database");
      //client.release();
    } catch (error) {
      console.error("Error connecting to database:", error);
      process.exit(1); // Keluar dari aplikasi dengan status error
    }
  })();

module.exports = db;