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

app.post("/home/search", homeHandler.home); 

app.get("/home/inbox", inboxHandler.inbox);
app.post("/home/inbox", inboxHandler.inbox);

app.get("/home/myJobs", inboxHandler.myJobs);
app.post("/home/myJobs", inboxHandler.myJobs);

app.get("/home/addJobs", jobHandler.addJob);
app.post("/home/addJobs", jobHandler.addJob);

app.get("/home/addApp", jobHandler.addApp);
app.post("/home/addApp", jobHandler.addApp);

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

module.exports = app;
