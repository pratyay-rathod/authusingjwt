const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routers/authRouts');
const cookie = require("cookie-parser");
const requireAuth = require("./middleware/authMiddleware");

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookie());
app.use(authRoutes);

// view engine
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;
// database connection
const dbURI = 'mongodb://127.0.0.1/AuthDemo';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

// routes
app.get("*",requireAuth.checkCurrentUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth.requireAuth);

