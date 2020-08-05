let swRegistro;
let productos = [];
let cambiarReceptorEnvio = false,
	confirmarReceptorEnvio = false,
	receptorEsValido = false,
	idReceptor = document.getElementById('usuario-clave').value;

// Función para verificar si existe un usuario según el email
// Usada para la opción que cambia el receptor
async function buscarUsuario() {
	const email = document.getElementById('campo-correo').value;
	if (email.trim() === '') {
		Swal.fire('Ingrese el correo del usuario que recibirá el pedido');
		return;
	}
	try {
		const respuesta = await fetch(`/usuarios/${email}`, {
			method: 'GET',
			headers: {
				idUsuarioEmisor: document.getElementById('usuario-clave').value,
			},
		});
		const datos = await respuesta.json();
		console.log(datos);
		if (!datos.ok) {
			throw new Error(datos.mensaje);
		}
		receptorEsValido = true;
		idReceptor = datos.usuario.idUsuario;
		const { nombre, apellido } = datos.usuario;
		const recibeElem = document.createElement('p'),
			confirmarReceptorContenedor = document.createElement('p');
		confirmarReceptorContenedor.id = 'confirmar-receptor-contenedor';
		recibeElem.id = 'datos-receptor';
		confirmarReceptorContenedor.innerHTML = `
			<label>
				<input id="checkbox-confirmar-receptor" type="checkbox" class="filled-in" />
				<span>Confirmar Receptor</span>
			</label>
		`;
		recibeElem.innerText = `El pedido será enviado a ${nombre} ${apellido}`;
		document
			.getElementById('fila-campo-correo')
			.insertAdjacentElement('afterend', recibeElem);
		recibeElem.insertAdjacentElement(
			'afterend',
			confirmarReceptorContenedor
		);
		document
			.getElementById('checkbox-confirmar-receptor')
			.addEventListener('input', (e) => {
				confirmarReceptorEnvio = e.target.checked;
			});
		console.log(datos.usuario);
	} catch (err) {
		console.log(err);
		Swal.fire({
			icon: 'error',
			title: 'Algo salió mal',
			text: err.message,
		});
		receptorEsValido = false;
		idReceptor = document.getElementById('usuario-clave').value;
	}
}

// Oculta campo que obtiene el correo del usuario a recibir el pedido
function ocultarNuevaDireccion() {
	document.getElementById('fila-campo-correo').remove();
}

// Muestra toda la interfaz relacionada con la opción de cambiar el receptor del pedido
function mostrarNuevaDireccion() {
	const fila = document.createElement('div'),
		campoCorreoDiv = document.createElement('div'),
		campoCorreo = document.createElement('input'),
		labelCorreo = document.createElement('label'),
		contenedorBotonBuscar = document.createElement('div');
	botonBuscarUsuario = document.createElement('button');
	fila.id = 'fila-campo-correo';
	fila.className = 'row fila-campo-correo';
	campoCorreoDiv.className = 'input-field col s12 m8';
	campoCorreo.className = 'validate';
	campoCorreo.type = 'email';
	campoCorreo.id = 'campo-correo';
	campoCorreo.required = true;
	labelCorreo.htmlFor = 'campo-correo';
	labelCorreo.innerText = 'Correo de quien recibe';
	campoCorreoDiv.appendChild(campoCorreo);
	campoCorreoDiv.appendChild(labelCorreo);
	contenedorBotonBuscar.className = 'col s12 m4';
	botonBuscarUsuario.type = 'button';
	botonBuscarUsuario.className =
		'btn waves-effect waves-light green accent-4"';
	botonBuscarUsuario.innerText = 'Buscar';
	contenedorBotonBuscar.appendChild(botonBuscarUsuario);
	fila.appendChild(campoCorreoDiv);
	fila.appendChild(contenedorBotonBuscar);
	document
		.getElementById('cambio-envio-contenedor')
		.insertAdjacentElement('afterend', fila);
	botonBuscarUsuario.addEventListener('click', buscarUsuario);
}

// Realiza la petición al backend para crear un nuevo pedido
async function solicitarPedido() {
	if (cambiarReceptorEnvio && !receptorEsValido) {
		Swal.fire(
			'Para realizar el pedido, elija un receptor válido o desmarque la opción'
		);
		return;
	}
	if (cambiarReceptorEnvio && receptorEsValido && !confirmarReceptorEnvio) {
		Swal.fire('Confirme que alguien más recibira el pedido');
		return;
	}
	try {
		let idCliente = document.getElementById('usuario-clave').value;
		const respuesta = await fetch('/pedidos', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				articulos: productos,
				infoPedido: {
					idUsuario: idCliente,
					idReceptor,
					notas: document.getElementById('notas').value,
				},
			}),
		});
		const datos = await respuesta.json();
		console.log(datos);
		if (!datos.ok) {
			const refContenido = document.getElementById('contenido');
			datos.errores.forEach((error) => {
				const alerta = document.createElement('div');
				alerta.className = 'alerta alerta-error';
				alerta.innerText = error;
				document.body.insertBefore(alerta, refContenido);
				setTimeout(() => {
					alerta.remove();
				}, 3000);
			});
			return;
		}
		// El pedido se crea, y limpia el formulario así como elimina el carrito
		Swal.fire(
			'Pedido realizado',
			'Hemos recibido su solicitud de pedido, en breve lo atenderemos',
			'success'
		);
		productosFormulario.reset();
		document.getElementById('notas').value = '';
		productos = [];
		const campoCorreo = document.getElementById('fila-campo-correo');
		if (campoCorreo) {
			campoCorreo.remove();
		}
		const confirmarReceptorContenedor = document.getElementById(
			'confirmar-receptor-contenedor'
		);
		if (confirmarReceptorContenedor) {
			confirmarReceptorContenedor.remove();
		}
		const recibeElem = document.getElementById('datos-receptor');
		if (recibeElem) {
			recibeElem.remove();
		}
		const productosLista = document.getElementById('productos-lista');
		while (productosLista.lastChild) {
			productosLista.removeChild(productosLista.lastChild);
		}
		// Reestablecer variables de control de receptor
		cambiarReceptorEnvio = false;
		confirmarReceptorEnvio = false;
		receptorEsValido = false;
		idReceptor = idCliente;
		alternarBotonPedido();
	} catch (err) {
		Swal.fire({
			icon: 'error',
			title: 'Algo salió mal',
			text:
				'Tuvimos un error al procesar su pedido, por favor intente de nuevo',
		});
	}
}

// Elimina el producto de memoria y del dom
function eliminarProducto(item, productosLista, idProducto) {
	// Busca el producto con el id y lo elimina del arreglo
	productos = productos.filter((producto) => producto.id !== idProducto);
	item.parentElement.remove();
	alternarBotonPedido(productosLista);
}

// Deshabilita el boton para enviar cuando no hay articulos en el carrito
function alternarBotonPedido() {
	const botonEnviarPedido = document.getElementById('boton-enviar-pedido');
	productos.length > 0
		? (botonEnviarPedido.disabled = false)
		: (botonEnviarPedido.disabled = true);
}

// Agrega un articulo a la lista tanto en memoria como en el dom
function agregarProducto(e) {
	e.preventDefault();
	const productosLista = document.getElementById('productos-lista'),
		productoNombre = document.getElementById('articulo').value,
		productoCantidad = document.getElementById('cantidad').value;
	let idProducto = uuidv4();
	productos.push({
		id: idProducto,
		descripcion: productoNombre,
		cantidad: productoCantidad,
	});
	const productoElem = document.createElement('li'),
		productoInfo = document.createElement('span'),
		productoCantidadElem = document.createElement('span'),
		trashElem = document.createElement('i');

	productoElem.className = 'producto';
	productoCantidadElem.className =
		'badge badge-pill blue darken-3 white-text';
	productoCantidadElem.innerText = productoCantidad;
	productoInfo.className = 'producto-info';
	productoInfo.innerText = productoNombre;
	productoInfo.appendChild(productoCantidadElem);
	trashElem.className = 'material-icons boton-eliminar-producto';
	trashElem.title = 'Eliminar Producto';
	trashElem.innerText = 'delete';
	productoElem.appendChild(productoInfo);
	productoElem.appendChild(trashElem);
	productosLista.appendChild(productoElem);
	trashElem.addEventListener('click', (e) =>
		eliminarProducto(e.target, productosLista, idProducto)
	);
	alternarBotonPedido();
}

async function actualizarImagenPerfil() {
	const formData = new FormData();
	formData.append('imagen', editarAvatarInput.files[0]);
	formData.append(
		'idUsuario',
		document.getElementById('usuario-clave').value
	);
	try {
		const avatar = document.getElementById('avatar'),
			spinner = document.getElementById('spinner');
		avatar.classList.add('ocultar');
		spinner.classList.add('mostrar');
		const respuesta = await fetch('/usuarios/avatar', {
			method: 'PUT',
			body: formData,
		});
		const datos = await respuesta.json();
		if (!datos.ok) {
			throw new Error(datos.error);
		}
		const imagen = new Image(200, 200);
		imagen.onload = () => {
			avatar.src = imagen.src;
			spinner.classList.remove('mostrar');
			avatar.classList.remove('ocultar');
		};
		imagen.src = datos.urlImagen;
	} catch (err) {
		console.log(err);
		Swal.fire({
			icon: 'error',
			title: 'Algo salió mal',
			text:
				'Ocurrió un problema al actualizar su perfil. Por favor intente más tarde',
		});
		spinner.classList.remove('mostrar');
		avatar.classList.remove('ocultar');
	}
}

async function obtenerColonias(codigoPostal) {
	const select = document.getElementById('colonia');
	var elems = document.querySelectorAll('select');
	try {
		const respuesta = await fetch(
			`https://api-sepomex.hckdrk.mx/query/get_colonia_por_cp/${codigoPostal}`
		);
		const datos = await respuesta.json();
		if (datos.error) {
			throw new Error(datos.error_message);
		}
		while (select.lastChild) {
			select.removeChild(select.lastChild);
		}
		const coloniaDB = document.getElementById('colonia-db').value;
		const opcionPredeterminada = document.createElement('option');
		opcionPredeterminada.value = '';
		opcionPredeterminada.innerText = 'elige una opción';
		select.appendChild(opcionPredeterminada);
		datos.response.colonia.forEach((colonia) => {
			const opcion = document.createElement('option');
			opcion.value = colonia;
			opcion.innerText = colonia;
			if (colonia === coloniaDB) {
				opcion.selected = true;
			}
			select.appendChild(opcion);
		});
		select.disabled = false;
		M.FormSelect.init(elems);
		console.log(datos);
	} catch (err) {
		Swal.fire({
			icon: 'error',
			title: 'Algo salió mal',
			text:
				'Tuvimos un problema al procesar el Código Postal. Por favor intente de nuevo',
		});
		select.disabled = true;
		M.FormSelect.init(elems);
	}
}

// Referencias del DOM

const productosFormulario = document.getElementById('productos-formulario');
const botonEnviarPedido = document.getElementById('boton-enviar-pedido');
const cambioEnvioCheckbox = document.getElementById('cambio-envio-checkbox');
if (productosFormulario) {
	productosFormulario.addEventListener('submit', agregarProducto);
	alternarBotonPedido();
}
if (botonEnviarPedido) {
	botonEnviarPedido.addEventListener('click', solicitarPedido);
}
// Elemento para cambiar receptor de pedido
if (cambioEnvioCheckbox) {
	cambioEnvioCheckbox.addEventListener('change', () => {
		if (cambioEnvioCheckbox.checked) {
			cambiarReceptorEnvio = true;
			mostrarNuevaDireccion();
		} else {
			cambiarReceptorEnvio = false;
			ocultarNuevaDireccion();
		}
	});
}

const editarAvatarInput = document.getElementById('editar-avatar');
if (editarAvatarInput) {
	editarAvatarInput.addEventListener('change', (e) => {
		let lector = new FileReader();
		lector.readAsDataURL(e.target.files[0]);
		lector.onload = () => {
			Swal.fire({
				text: 'Así se verá tu imagen de perfl',
				imageUrl: lector.result,
				imageWidth: 200,
				imageHeight: 200,
				imageAlt: 'Imagen de perfil',
				confirmButtonText: 'Establecer como imagen de perfil',
				confirmButtonColor: '#1565C0',
				showCloseButton: true,
			}).then((resultado) => {
				if (resultado.value) {
					actualizarImagenPerfil();
				}
			});
		};
	});
}

const codigoPostalInput = document.getElementById('cod-postal');
if (codigoPostalInput) {
	codigoPostalInput.addEventListener('change', (e) =>
		obtenerColonias(e.target.value)
	);
}

document.addEventListener('DOMContentLoaded', function () {
	var elems = document.querySelectorAll('select');
	M.FormSelect.init(elems);
	if (location.pathname.includes('configuracion')) {
		const codigoPostal = document.getElementById('cod-postal').value;
		if (codigoPostal) {
			obtenerColonias(codigoPostal);
		}
	}
	if (botonActivarNotificaciones) {
		if (Notification.permission === 'granted') {
			botonActivarNotificaciones.disabled = true;
		}
	}
});

// Notificaciones
const botonActivarNotificaciones = document.getElementById(
	'boton-habilitar-notificaciones'
);
if (botonActivarNotificaciones) {
	botonActivarNotificaciones.addEventListener('click', (e) => {
		Notification.requestPermission().then(async (resultado) => {
			if (resultado === 'granted') {
				if (!navigator.serviceWorker) {
					e.target.disabled = true;
					return;
				}
				const clave = await obtenerClaveSuscripcion();
				const suscripcionRespuesta = await swRegistro.pushManager.subscribe(
					{
						userVisibleOnly: true,
						applicationServerKey: clave,
					}
				);
				const suscripcion = await suscripcionRespuesta.toJSON();
				try {
					const respuesta = await fetch(
						'/api/subscription/subscribe',
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								idUsuario: idReceptor,
							},
							body: JSON.stringify(suscripcion),
						}
					);
					const datos = await respuesta.json();
					if (!datos.ok) {
						throw new Error(datos.mensaje);
					}
					Swal.fire(
						'Se ha suscrito a las notificaciones. Ahora podrá recibir alertas sobre el estado de su pedido'
					);
					e.target.disabled = true;
					console.log(datos.suscripcion);
				} catch (err) {
					console.log(err);
					Swal.fire({
						icon: 'error',
						title: 'Algo salió mal',
						text: err.message,
					});
				}
			}
		});
	});
}

const botonesDescartarNotificacion = document.querySelectorAll(
	'.boton-descartar-notificacion'
);
if (botonesDescartarNotificacion) {
	botonesDescartarNotificacion.forEach((boton) => {
		boton.addEventListener('click', descartarNotificacion);
	});
}

function verificarSuscripcion(estado) {
	console.log(estado);
}

// Socket.io
if (window.io) {
	const socket = io('/' + idReceptor);

	socket.on('pagoActualizado', (datos) => {
		console.log(datos);
		// if (!navigator.serviceWorker) {
		const audio = new Audio('/static/audio/notification.mp3');
		audio.play();
		mostrarNotificacion(datos);
		// }
		document
			.getElementById('tab-notificacion')
			.classList.add('nueva-notificacion');
		if (location.pathname.includes('notificaciones')) {
			const sinNotificacionesTexto = document.getElementById(
				'sin-notificaciones'
			);
			if (sinNotificacionesTexto) {
				sinNotificacionesTexto.remove();
			}
			mostrarTarjetaNotificacion(datos);
		}
	});
}

// Notificaciones

function mostrarNotificacion({ texto, titulo }) {
	new Notification(titulo, {
		body: texto,
		icon: '/static/img/favicons/favicon.ico',
	});
}

function mostrarTarjetaNotificacion({
	texto,
	titulo,
	actualizadoEl,
	idNotificacion,
}) {
	let claseIcono =
			titulo !== 'Pedido Entregado'
				? 'icon-check-progress'
				: 'icono-check',
		nombreIcono =
			claseIcono === 'icon-check-progress' ? 'cached' : 'verified',
		claseEncabezado =
			titulo !== 'Pedido Entregado'
				? 'content-encabezado-process'
				: 'content-encabezado-listo';

	const contenedorNotificacion = document.createElement('div');
	contenedorNotificacion.className = 'col m6 list-notification';
	contenedorNotificacion.innerHTML = `
  <input class="id-notificacion" type="hidden" value="${idNotificacion}">
  <div class="row valign-wrapper">
    <div class="col s2">
      <i class="material-icons ${claseIcono}">${nombreIcono}</i>
    </div>
    <div class="col s10">
      <div class="col s12 valign-wrapper">
        <p>${actualizadoEl}</p>
      </div>
      <div class="col s12 ${claseEncabezado}">
        <p>${titulo}</p>
      </div>
      <div class="col s12">
        <p class="content-pedido">${texto}</p>
      </div>
      <button class="boton-descartar-notificacion waves-effect waves-teal btn-flat red-text">Descartar</button>
    </div>
  </div>
  `;
	const listaNotificaciones = document.getElementById('lista-notificaciones');
	if (listaNotificaciones.childElementCount === 0) {
		listaNotificaciones.appendChild(contenedorNotificacion);
	} else {
		listaNotificaciones.children[0].insertAdjacentElement(
			'beforebegin',
			contenedorNotificacion
		);
	}
	document
		.querySelector('.boton-descartar-notificacion')
		.addEventListener('click', descartarNotificacion);
}

async function descartarNotificacion(e) {
	const idNotificacion =
		e.target.parentElement.parentElement.previousElementSibling.value;
	e.target.parentElement.parentElement.parentElement.remove();
	const respuesta = await fetch('/notificaciones/' + idNotificacion, {
		method: 'PUT',
	});
	const datos = await respuesta.json();
	console.log(datos);
}

async function obtenerClaveSuscripcion() {
	try {
		const respuesta = await fetch('/api/subscription/key');
		const clave = await respuesta.arrayBuffer();
		return new Uint8Array(clave);
	} catch (err) {
		console.log(err);
	}
}

if (navigator.serviceWorker) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/static/sw.js', {
				scope: '/static/',
			})
			.then((registro) => {
				swRegistro = registro;
				swRegistro.pushManager
					.getSubscription()
					.then(verificarSuscripcion);
			});
	});
}
