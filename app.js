const express = require('express');
const router = express.Router();
const db = require('./db/db');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static("public"));

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
