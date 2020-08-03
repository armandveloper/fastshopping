const io = require('socket.io-client');

const socket = io.connect(`http://localhost:${process.env.PORT}/nodejs`, {
	reconnection: true,
});

socket.on('connect', () => {
	console.log('Servidor de nodejs conectado a websocket server');
});

module.exports = socket;
