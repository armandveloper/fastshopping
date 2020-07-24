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
