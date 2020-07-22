const Articulo = require('../models/Item');
const Pedido = require('../models/Order');

exports.crearPedido = async (req, res) => {
	// En el cuerpo de la petición debe recibir las propiedades
	// articulos[]
	// infoPedido: {
	//  notas:
	//  idCliente,
	//
	// }
	const { articulos, infoPedido } = req.body;
	try {
		const pedidoDB = await Pedido.create({
			...infoPedido,
			comision: 20,
		});
		const articulos2 = articulos.map((articulo) => ({
			...articulo,
			idPedido: pedidoDB.idPedido,
		}));
		const articulosDB = await Articulo.bulkCreate(articulos2);
		res.json({
			ok: true,
			pedidoDB,
			articulosDB,
		});
	} catch (err) {
		console.log(err);
		res.json({
			error: err,
		});
	}
};
