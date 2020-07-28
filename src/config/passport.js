const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Usuario = require('../models/User');

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		async (email, password, terminar) => {
			try {
				const usuario = await Usuario.findOne({
					where: { email },
				});
				if (!usuario) {
					return terminar(null, false, {
						message: 'Usuario o contraseña incorrectos',
					});
				}
				if (!(await bcrypt.compare(password, usuario.password))) {
					return terminar(null, false, {
						message: 'Usuario o contraseña incorrectos',
					});
				}
				return terminar(null, usuario);
			} catch (err) {
				console.log(err);
				return terminar(err);
			}
		}
	)
);

passport.serializeUser((usuario, terminar) => {
	terminar(null, usuario.idUsuario);
});

passport.deserializeUser(async (id, terminar) => {
	try {
		const usuario = await Usuario.findByPk(id, {
			attributes: {
				exclude: ['password'],
			},
		});
		terminar(null, usuario);
	} catch (err) {
		terminar(err);
	}
});

module.exports = passport;
