const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Usuario extends Model {}

Usuario.init(
	{
		idUsuario: {
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
		colonia: {
			type: DataTypes.STRING(45),
		},
		calle: {
			type: DataTypes.STRING(45),
		},
		numExt: {
			type: DataTypes.INTEGER,
			allowNUll: false,
			defaultValue: 1,
		},
		numInt: {
			type: DataTypes.INTEGER,
		},
		referencias: {
			type: DataTypes.STRING(60),
		},
	},
	{
		sequelize,
		modelName: 'Usuario',
		tableName: 'usuarios',
		createdAt: 'creadoEl',
		updatedAt: 'actualizadoEl',
	}
);

module.exports = Usuario;
