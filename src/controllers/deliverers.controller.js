exports.mostrarInicio = (req, res) => {
	res.render('deliverers/index', {
		titulo: 'Repartidores FastShopping',
	});
};
