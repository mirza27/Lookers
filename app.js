const express = require('express');
const db = require('./db/db');
const app = express();
const userHandler = require('./routes/userHandler')
const homeHandler = require('./routes/homeHandler');
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
  cookie: { maxAge:1000 * 60 * 60 } // expire 1 jam
}));
app.use(cookieParser());


// PATH ENDPOINT
app.get("/login", userHandler.userLogin); 
app.post("/login", userHandler.userLogin);

app.get("/logout", userHandler.userLogout);

app.get("/register", userHandler.userRegister);
app.post("/register", userHandler.userRegister);

app.get("/register/hrd/:id", userHandler.regisHRD);
app.post("/register/hrd/:id", userHandler.regisHRD);

app.get("/register/js/:id", userHandler.regisJS);
app.post("/register/js/:id", userHandler.regisJS);

app.get("/home", homeHandler.home);
app.post("/home", homeHandler.home);

app.get("/search", homeHandler.search);
app.post("/search", homeHandler.search);


// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

module.exports = app;
