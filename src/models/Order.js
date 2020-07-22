const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Pedido extends Model {}

Pedido.init(
	{
		idPedido: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		importe: DataTypes.DECIMAL(2),
		comision: DataTypes.INTEGER(2),
		total: DataTypes.DECIMAL(2),
		notas: DataTypes.STRING(100),
		entregado: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		idCliente: DataTypes.INTEGER,
	},
	{
		sequelize,
		modelName: 'Pedido',
		tableName: 'pedidos',
	}
);

module.exports = Pedido;
