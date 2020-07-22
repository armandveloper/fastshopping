exports.mostrarLogin = (req, res) => {
	res.render('auth/login', {
		titulo: 'Iniciar sesión | FastShopping',
	});
};
