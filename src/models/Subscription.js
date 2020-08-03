const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./User');

class Suscripcion extends Model {}

Suscripcion.init(
	{
		idSuscripcion: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		endpoint: DataTypes.STRING,
		auth: DataTypes.STRING,
		p256dh: DataTypes.STRING,
	},
	{
		sequelize,
		modelName: 'Suscripcion',
		tableName: 'suscripciones',
		timestamps: false,
	}
);

Suscripcion.belongsTo(Usuario, {
	foreignKey: 'idUsuario',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

module.exports = Suscripcion;
