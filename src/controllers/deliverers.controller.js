const { obtenerPedidos, obtenerPedido } = require('./orders.controller');

exports.mostrarInicio = async (req, res) => {
	try {
		const pedidos = await obtenerPedidos();
		res.render('deliverers/index', {
			titulo: 'Atención de Pedidos | FastShopping',
			pedidos,
		});
	} catch (err) {
		console.log(object);
		res.render('/deliverers/index', {
			titulo: 'Atención de Pedidos | FastShopping',
			errorPedidos:
				'Ocurrió un error al cargar los Pedidos. Por favor recargue la página o inicie sesión de nuevo',
		});
	}
};

exports.mostrarDetallesPedido = async (req, res) => {
	const { id } = req.params;
	try {
		const pedido = await obtenerPedido(id);
		res.render('deliverers/details', {
			titulo: 'Detalles del Pedido',
			pedido,
		});
	} catch (err) {
		console.log(err);
		res.render('deliverers/details', {
			titulo: 'Detalles del Pedido',
			errorPedido:
				'Ocurrió un error al cargar los detales del pedido. Por favor recargue la página o inicie sesión de nuevo',
		});
	}
};
