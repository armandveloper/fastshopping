const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Deliverer extends Model {}

Deliverer.init(
	{
		idRepartidor: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		nombre: {
			type: DataTypes.STRING(40),
		},
		apellido: {
			type: DataTypes.STRING(45),
		},
		email: {
			type: DataTypes.STRING(60),
			unique: true,
		},
		password: {
			type: DataTypes.STRING(60),
		},
		telefono: {
			type: DataTypes.CHAR(10),
			unique: true,
		},
		urlAvatar: {
			type: DataTypes.STRING,
		},
		rol: {
			type: DataTypes.STRING(15),
			defaultValue: 'repartidor',
		},
	},
	{
		sequelize,
		modelName: 'Repartidor',
		tableName: 'repartidores',
		createdAt: 'creadoEl',
		updatedAt: 'actualizadoEl',
	}
);

module.exports = Deliverer;
