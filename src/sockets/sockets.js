const { io } = require('../server');

function notificarPago(socket) {
	io.to(socket.id).emit('notificarPago');
	socket.emit('notificarPago');
}

io.on('connect', (socket) => {
	console.log(`new connection ${socket.id}`);
	const session = socket.request.session;
	console.log(`saving sid ${socket.id} in session ${session.id}`);
	session.socketId = socket.id;
	session.save();
	const { user: usuario } = socket.request;
	console.log(usuario);
});

module.exports = {
	notificarPago,
};
