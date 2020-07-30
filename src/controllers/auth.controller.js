const passport = require('passport');

exports.mostrarLogin = (req, res) => {
	res.render('auth/login', {
		titulo: 'Iniciar sesión | FastShopping',
	});
};

exports.mostrarRegistro = (req, res) => {
	let usuario = req.flash('usuario');
	let nombre = '',
		apellido = '',
		email = '',
		telefono = '';
	usuario = usuario.length > 0 ? usuario[0] : null;
	if (usuario) {
		nombre = usuario.nombre;
		apellido = usuario.apellido;
		email = usuario.email === '@' ? '' : usuario.email;
		telefono = usuario.telefono;
	}
	res.render('auth/register', {
		titulo: 'Registro | FastShopping',
		nombre,
		apellido,
		email,
		telefono,
	});
};

exports.iniciarSesion = passport.authenticate('local', {
	failureRedirect: '/login',
	successRedirect: '/usuarios',
	failureFlash: true,
});

exports.cerrarSesion = (req, res) => {
	req.logout();
	req.flash('feedbackExito', 'Se ha cerrado sesión');
	res.redirect('/login');
};
