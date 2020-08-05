exports.mostrarInicio = (req, res) => {
	res.render('admin/index', {
		titulo: 'Panel de administracion | FastShopping',
	});
};
