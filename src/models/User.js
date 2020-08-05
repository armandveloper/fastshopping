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
		codigoPostal: {
			type: DataTypes.CHAR(5),
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
			defaultValue: 1,
		},
		referencias: {
			type: DataTypes.STRING(60),
		},
		urlAvatar: {
			type: DataTypes.STRING,
			defaultValue:
				'https://res.cloudinary.com/dxmhr2agc/image/upload/v1596075793/fastshopping/profile/usuario_g6ovba.svg',
		},
		configuracionCompleta: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		rol: {
			type: DataTypes.STRING(15),
			defaultValue: 'cliente',
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
