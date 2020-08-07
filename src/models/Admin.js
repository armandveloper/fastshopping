const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Admin extends Model {}

Admin.init(
	{
		idAdmin: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: DataTypes.STRING(30),
		apellido: DataTypes.STRING(40),
		email: {
			type: DataTypes.STRING(60),
			unique: true,
		},
		password: DataTypes.CHAR(60),
		urlAvatar: {
			type: DataTypes.STRING,
			defaultValue:
				'https://res.cloudinary.com/dxmhr2agc/image/upload/v1596075793/fastshopping/profile/usuario_g6ovba.svg',
		},
		rol: {
			type: DataTypes.STRING(60),
			defaultValue: 'admin',
		},
	},
	{
		sequelize,
		modelName: 'Admin',
		tableName: 'administradores',
		createdAt: 'actualizadoEl',
		updatedAt: 'creadoEl',
	}
);

module.exports = Admin;
