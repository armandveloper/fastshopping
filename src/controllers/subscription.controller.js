const URLSafeBase64 = require('urlsafe-base64');
const webpush = require('../config/webpush');
const Suscripcion = require('../models/Subscription');

const codificarClave = () => URLSafeBase64.decode(process.env.PUBLIC_VAPID_KEY);

exports.obtenerClave = (req, res) => {
	const clave = codificarClave();
	res.send(clave);
};

exports.suscribir = async (req, res) => {
	console.log('susbcribing');
	const { endpoint, keys } = req.body;
	const idUsuario = req.get('idUsuario');
	try {
		const suscripcion = await Suscripcion.create({
			endpoint,
			auth: keys.auth,
			p256dh: keys.p256dh,
			idUsuario,
		});
		res.json({ ok: true, suscripcion });
	} catch (err) {
		console.log(err);
		res.json({
			ok: false,
			mensaje:
				'Ocurrió un error en la suscripción. Por favor intente de nuevo',
		});
	}
};
