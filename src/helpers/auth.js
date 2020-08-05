const helpers = {};

helpers.esCliente = (req, res, next) => {
	if (req.user.rol !== 'cliente') {
		return res.redirect('/login');
	}
	next();
};

helpers.esRepartidor = (req, res, next) => {
	if (req.user.rol !== 'repartidor') {
		return res.redirect('/repartidores/login');
	}
	next();
};

helpers.esAdmin = (req, res, next) => {
	if (req.user.rol !== 'admin') {
		return res.redirect('/admin/login');
	}
	next();
};

helpers.estaAutenticado = (req, res, next) => {
	let redireccionPath =
		req.baseUrl === '/repartidores'
			? '/repartidores/login'
			: req.baseUrl === '/admin'
			? '/admin/login'
			: '/login';
	if (!req.isAuthenticated()) {
		return res.redirect(redireccionPath);
	}
	next();
};

module.exports = helpers;
