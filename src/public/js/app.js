let productos = [];

// Función para verificar si existe un usuario según el email
// Usada para la opción que cambia el receptor
async function buscarUsuario() {
	const email = document.getElementById('campo-correo').value;
	if (email.trim() === '') {
		Swal.fire('Ingrese el correo del usuario que recibirá el pedido');
		return;
	}
	try {
		const respuesta = await fetch(`/usuarios/${email}`);
		const datos = await respuesta.json();
		if (!datos.ok) {
			throw new Error(datos.mensaje);
		}
		const { nombre, apellido } = datos.usuario;
		const recibeElem = document.createElement('p'),
			confirmarReceptorContenedor = document.createElement('p');
		confirmarReceptorContenedor.innerHTML = `
			<label>
				<input type="checkbox" class="filled-in" />
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
		console.log(datos.usuario);
	} catch (err) {
		Swal.fire({
			icon: 'error',
			title: 'Algo salió mal',
			text: err.message,
		});
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
async function enviarPedido() {
	try {
		const respuesta = await fetch('/pedidos', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				articulos: productos,
				infoPedido: {
					idCliente: document.getElementById('id-usuario').value,
					notas: document.getElementById('notas').value,
				},
			}),
		});
		const datos = await respuesta.json();
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
			'Pedido recibido',
			'Hemos recibido su pedido, en breve lo atenderemos',
			'success'
		);
		productosFormulario.reset();
		document.getElementById('notas').value = '';
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
const productosFormulario = document.getElementById('productos-formulario');
const botonEnviarPedido = document.getElementById('boton-enviar-pedido');
const cambioEnvioCheckbox = document.getElementById('cambio-envio-checkbox');
if (productosFormulario) {
	productosFormulario.addEventListener('submit', agregarProducto);
	alternarBotonPedido();
}
if (botonEnviarPedido) {
	botonEnviarPedido.addEventListener('click', enviarPedido);
}
// Elemento para cambiar receptor de pedido
if (cambioEnvioCheckbox) {
	cambioEnvioCheckbox.addEventListener('change', () => {
		console.log(cambioEnvioCheckbox.checked);
		if (cambioEnvioCheckbox.checked) {
			mostrarNuevaDireccion();
		} else {
			ocultarNuevaDireccion();
		}
	});
}
