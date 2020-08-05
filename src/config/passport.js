const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Usuario = require('../models/User');
const Repartidor = require('../models/Deliverer');

passport.use(
	'user-local',
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

passport.use(
	'deliverer-local',
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		async (email, password, terminar) => {
			try {
				const repartidor = await Repartidor.findOne({
					where: { email },
				});
				if (!repartidor) {
					return terminar(null, false, {
						message: 'Usuario o contraseña incorrectos',
					});
				}
				if (!(await bcrypt.compare(password, repartidor.password))) {
					return terminar(null, false, {
						message: 'Usuario o contraseña incorrectos',
					});
				}
				return terminar(null, repartidor);
			} catch (err) {
				console.log(err);
				return terminar(err);
			}
		}
	)
);

passport.serializeUser((usuario, terminar) => {
	terminar(null, usuario);
});

passport.deserializeUser(async (usuario, terminar) => {
	try {
		let usuarioDB;
		if (usuario.rol === 'cliente') {
			usuarioDB = await Usuario.findByPk(usuario.idUsuario, {
				attributes: {
					exclude: ['password'],
				},
			});
		} else if (usuario.rol === 'repartidor') {
			usuarioDB = await Repartidor.findByPk(usuario.idRepartidor, {
				attributes: {
					exclude: ['password'],
				},
			});
		}
		terminar(null, usuarioDB);
	} catch (err) {
		terminar(err);
	}
});

module.exports = passport;
