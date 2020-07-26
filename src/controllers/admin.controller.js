exports.mostrarLoginAdmin = (req, res) => {
	res.render('auth/admin-login', {
		titulo: 'Iniciar sesión',
	});
};
