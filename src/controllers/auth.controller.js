const passport = require('passport');

exports.mostrarLogin = (req, res) => {
	res.render('auth/login', {
		titulo: 'Iniciar sesión | FastShopping',
	});
};

exports.mostrarRegistro = (req, res) => {
	res.render('auth/register', {
		titulo: 'Registro | FastShopping',
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
