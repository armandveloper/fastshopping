const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Articulo = require('./Item');

class Pedido extends Model {}

Pedido.init(
	{
		idPedido: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		importe: DataTypes.DECIMAL(10, 2),
		comision: DataTypes.INTEGER(2),
		total: DataTypes.DECIMAL(10, 2),
		notas: DataTypes.STRING(100),
		entregado: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		idCliente: DataTypes.INTEGER,
		idReceptor: DataTypes.INTEGER,
	},
	{
		sequelize,
		modelName: 'Pedido',
		tableName: 'pedidos',
		createdAt: 'creadoEl',
		updatedAt: 'actualizadoEl',
	}
);

Pedido.hasMany(Articulo, {
	foreignKey: 'idPedido',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

module.exports = Pedido;
