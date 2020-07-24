const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Pedido = require('./Order');

class Articulo extends Model {}

Articulo.init(
	{
		idArticulo: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		descripcion: DataTypes.STRING(40),
		cantidad: DataTypes.INTEGER,
	},
	{
		sequelize,
		modelName: 'Articulo',
		tableName: 'articulos',
		timestamps: false,
	}
);

Articulo.belongsTo(Pedido, {
	foreignKey: 'idPedido',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

module.exports = Articulo;
