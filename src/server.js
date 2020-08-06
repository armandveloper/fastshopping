const path = require('path');
const express = require('express');
const multer = require('multer');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const { nanoid } = require('nanoid');

const app = express();
const servidor = require('http').createServer(app);

require('./config/passport');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const almacen = multer.diskStorage({
	destination: path.join(__dirname, 'public', 'uploads'),
	filename: (req, archivo, cb) => {
		cb(null, nanoid() + path.extname(archivo.originalname));
	},
});
app.use(multer({ storage: almacen }).single('imagen'));
const sessionMiddleware = session({
	secret: 'clave_secreta',
	resave: false,
	saveUninitialized: false,
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
	res.locals.feedbackExito = req.flash('feedbackExito');
	res.locals.feedbackError = req.flash('feedbackError');
	res.locals.error = req.flash('error');
	res.locals.usuario = req.user || null;
	next();
});
app.use(require('./routes/index.routes'));

const io = require('socket.io')(servidor);

const workspaces = io.of(/^\/\w+$/);

const wrap = (middleware) => (socket, next) =>
	middleware(socket.request, {}, next);

workspaces.use(wrap(sessionMiddleware));
workspaces.use(wrap(passport.initialize()));
workspaces.use(wrap(passport.session()));

workspaces.use((socket, next) => {
	if (socket.request.user || socket.nsp.name === '/nodejs') {
		next();
	} else {
		next(new Error('No autorizado'));
	}
});
workspaces.on('connection', (socket) => {
	const workspace = socket.nsp;
	console.log('Nueva conexión');
	console.log(workspace.name);
	// Eventos de repartidores
	socket.on('nuevoPedido', (datos) => {
		console.log('Se creó un pedido');
		console.log(datos);
		io.of('/repartidores').emit('nuevoPedido', datos);
	});
	socket.on('yaFueAtendido', (idPedido) => {
		io.of('/repartidores').emit('yaFueAtendido', idPedido);
	});

	// Eventos de clientes
	socket.on('pedidoEnProceso', (datos) => {
		console.log('Su pedido está siendo atendido');
		console.log(datos);
		io.of('/' + datos.idCliente).emit('pedidoEnProceso', datos);
	});
	socket.on('pagoActualizado', (datos) => {
		console.log(socket.nsp.name);
		console.log(datos);
		io.of('/' + datos.idCliente).emit('pagoActualizado', datos);
	});
	socket.on('pedidoEntregado', (datos) => {
		console.log('Su pedido ha sido entregado');
		console.log(datos);
		io.of('/' + datos.idCliente).emit('pedidoEntregado', datos);
	});
});

require('./realtime/client');

module.exports = servidor;
