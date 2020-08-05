self.addEventListener('install', (e) => {
	console.log('Service worker instalado');
});

self.addEventListener('push', (event) => {
	console.log('[Service Worker] Push Received.');
	console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

	const title = 'Push Codelab';
	const options = {
		body: 'Yay it works.',
		icon: 'images/icon.png',
		badge: 'images/badge.png',
	};
	console.log(self.registration);
	event.waitUntil(self.registration.showNotification(title, options));
	// console.log(e);
	// let datos = e.data.text();
	// datos = JSON.parse(datos);
	// console.log(datos);
	// console.log('Configurando noti');
	// e.waitUntil(
	// 	self.registration.showNotification(datos.titulo, {
	// 		body: datos.texto,
	// 		icon: '/static/img/favicons/android-chrome-192x192.png',
	// 		badge: '/static/img/favicons/favicon.ico',
	// 		vibrate: [
	// 			125,
	// 			75,
	// 			125,
	// 			275,
	// 			200,
	// 			275,
	// 			125,
	// 			75,
	// 			125,
	// 			275,
	// 			200,
	// 			600,
	// 			200,
	// 			600,
	// 		],
	// 		openUrl: '/usuarios/notificaciones',
	// 		data: {
	// 			url: '/usuarios/notificaciones',
	// 		},
	// 	})
	// );
	// console.log('Notification Showed');
});

// self.addEventListener('notificationclick', (e) => {
// 	const notificacion = e.notification;
// 	console.log(notificacion);
// 	const respuesta = clients.matchAll().then((tabs) => {
// 		let tab = tabs.find((tab) => {
// 			const url = new URL(tab.url);
// 			console.log(url.pathname);
// 			if (url.pathname === notificacion.data.url) {
// 				return tab;
// 			}
// 			return undefined;
// 		});
// 		if (tab) {
// 			tab.navigate(notificacion.data.url);
// 			tab.focus();
// 		} else {
// 			clients.openWindow(notificacion.data.url);
// 		}
// 		return notificacion.close();
// 	});
// 	e.waitUntil(respuesta);
// });
