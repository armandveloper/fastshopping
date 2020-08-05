const moment = require('moment');
const webpush = require('../config/webpush');
const Suscripcion = require('../models/Subscription');
const Notificacion = require('../models/Notification');

moment.locale('es');

exports.enviarNotificacion = async (idUsuario, notificacion) => {
	try {
		const notificacionDB = await Notificacion.create({
			titulo: notificacion.titulo,
			contenido: notificacion.texto,
			idUsuario,
		});
		console.log('Saved notification');
		console.log(notificacionDB);
		const suscripciones = await Suscripcion.findAll({
			where: {
				idUsuario,
			},
		});
		suscripciones.forEach((datosSuscripcion) => {
			const suscripcion = {
				endpoint: datosSuscripcion.endpoint,
				keys: {
					auth: datosSuscripcion.auth,
					p256dh: datosSuscripcion.p256dh,
				},
			};
			console.log('Subscription data');
			console.log(suscripcion);
			webpush
				.sendNotification(suscripcion, JSON.stringify(notificacion))
				.then(() => console.log('Notification sent successfully'))
				.catch((err) => {
					// Elimina suscripcion inválida
					console.log(err);

					if (err.statusCode === 410) {
						console.log('error en push nserver');
						datosSuscripcion.destroy();
					}
				});
		});
		return notificacionDB.idNotificacion;
	} catch (err) {
		console.log('Error en db');
	}
};

exports.obtenerNotificaciones = async (idUsuario) => {
	try {
		let notificaciones = await Notificacion.findAll({
			where: { idUsuario, leido: false },
		});
		return notificaciones.map((notificacion) => ({
			notificacion,
			creadoEl: moment(notificacion.creadoEl, 'YYYYMMDD').fromNow(),
		}));
	} catch (err) {
		throw new Error('Error al obtener las notificaciones');
	}
};

exports.descartarNotificacion = async (req, res) => {
	const { id } = req.params;
	try {
		const notificacion = await Notificacion.destroy({
			where: { idNotificacion: id },
		});
		res.json({ ok: true, notificacion });
	} catch (err) {
		console.log(err);
		res.json({ ok: false, mensaje: 'Error al descartar notificacion' });
	}
};
