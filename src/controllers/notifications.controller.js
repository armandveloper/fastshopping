const webpush = require('../config/webpush');
const Suscripcion = require('../models/Subscription');

exports.enviarNotificacion = async (idUsuario, notificacion) => {
	try {
		const suscripciones = await Suscripcion.findAll({
			where: {
				idUsuario,
			},
		});
		suscripciones.forEach(async (datosSuscripcion) => {
			const suscripcion = {
				endpoint: datosSuscripcion.endpoint,
				keys: {
					auth: datosSuscripcion.auth,
					p256dh: datosSuscripcion.p256dh,
				},
			};
			console.log(suscripcion);
			await webpush.sendNotification(
				suscripcion,
				JSON.stringify(notificacion)
			);
		});
	} catch (err) {
		// Elimina suscripcion inválida
		if (err.statusCode === 410) {
			console.log('error en push nserver');
			// Suscripcion.destroy({ where: { idUsuario } });
		} else {
			console.log('Error en db');
		}
	}
};
