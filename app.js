const express = require('express');
const router = express.Router();
const db = require('./db/db');
const app = express();
const port = 3000;

// SET ENGINE EJS
app.set('view engine', 'ejs');
app.use(express.static("public"));

// SET PARSER JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// LOGIN SESSION
const session = require('express-session');
const cookieParser = require("cookie-parser");
app.use(session({
  secret: 'Lookers123', // key utama session
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge:1000 * 60 * 60 * 24}
}));
app.use(cookieParser());


// AMBIL PATH ROUTING
const loginRouter = require("./routes/login");
const homeRouter = require("./routes/home");
const regisRouter = require("./routes/register");

app.use("/login", loginRouter);
app.use("/register", regisRouter);
app.use("/home", homeRouter);


// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

module.exports = app;
