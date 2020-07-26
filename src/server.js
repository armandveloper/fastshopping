const path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const app = express();

require('./config/passport');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	session({
		secret: 'clave_secreta',
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
	res.locals.feedbackExito = req.flash('feedbackExito');
	res.locals.feedbackError = req.flash('feedbackError');
	res.locals.error = req.flash('error');
	res.locals.usuario = req.user || null;
	next();
});
app.use(require('./routes/index.routes'));

module.exports = app;
