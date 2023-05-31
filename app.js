const express = require('express');
const db = require('./db/db');
const app = express();
const userHandler = require('./routes/userHandler')
const homeHandler = require('./routes/homeHandler');
const inboxHandler = require('./routes/inboxHandler');
const jobHandler = require('./routes/jobHandler');
const port = 3000;

// SET ENGINE EJS
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.static("vendor"));

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
app.get("/login", userHandler.userLogin); // Login
app.post("/login", userHandler.userLogin);

app.get("/logout", userHandler.userLogout); // logout

app.get("/register", userHandler.userRegister); // register awal
app.post("/register", userHandler.userRegister);

app.get("/register/hrd/:id", userHandler.regisHRD); // register sebagai hrd
app.post("/register/hrd/:id", userHandler.regisHRD); 

app.get("/register/js/:id", userHandler.regisJS); // register jobseeker
app.post("/register/js/:id", userHandler.regisJS);

app.get("/home", homeHandler.home); // load home / dashboard
app.post("/home", homeHandler.home);

app.post("/home/search", homeHandler.home); // menampilkan jobs tersedia

app.get("/home/profile", homeHandler.profil); // edit profile js /hrd
app.post("/home/profile", homeHandler.profil);

app.get("/home/inbox", inboxHandler.inbox); // inbox hrd / lamaran yang diterima hrd
app.post("/home/inbox", inboxHandler.inbox);

app.get("/home/myApply", inboxHandler.myApply); // daftar lamaran (js)

app.get("/home/myJobs", jobHandler.myJobs); // loker yang dibuat hrd
app.post("/home/myJobs", jobHandler.myJobs);

app.get("/home/addJobs", jobHandler.addJob); // menambah loker
app.post("/home/addJobs", jobHandler.addJob);

app.post("/home/addApp", jobHandler.addApp); // membuat lamaran (js)

app.post("/home/acceptApp", jobHandler.acceptApp); // menerima / menolak lamaran

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

module.exports = app;
