const { DataTypes, Model, literal } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./User');

class Notificacion extends Model {}

Notificacion.init(
	{
		idNotificacion: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		titulo: DataTypes.STRING(60),
		contenido: DataTypes.STRING,
		leido: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		creadoEl: {
			type: DataTypes.DATE,
			defaultValue: literal('CURRENT_TIMESTAMP'),
		},
	},
	{
		sequelize,
		modelName: 'Notificacion',
		tableName: 'notificaciones',
		timestamps: false,
	}
);

Notificacion.belongsTo(Usuario, {
	foreignKey: 'idUsuario',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

module.exports = Notificacion;
