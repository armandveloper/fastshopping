let productos = [];

function ocultarNuevaDireccion() {
	document.getElementById('fila-campo-correo').remove();
}

function mostrarNuevaDireccion() {
	const fila = document.createElement('div'),
		campoCorreoDiv = document.createElement('div'),
		campoCorreo = document.createElement('input'),
		labelCorreo = document.createElement('label');
	fila.id = 'fila-campo-correo';
	fila.className = 'row fila-campo-correo';
	campoCorreoDiv.className = 'input-field col s12 m8';
	campoCorreo.className = 'validate';
	campoCorreo.type = 'email';
	campoCorreo.id = 'campo-correo';
	labelCorreo.htmlFor = 'campo-correo';
	labelCorreo.innerText = 'Correo de quien recibe';
	campoCorreoDiv.appendChild(campoCorreo);
	campoCorreoDiv.appendChild(labelCorreo);
	fila.appendChild(campoCorreoDiv);
	document
		.getElementById('cambio-envio-contenedor')
		.insertAdjacentElement('afterend', fila);
}

async function enviarPedido() {
	const respuesta = await fetch('/pedidos', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			articulos: productos,
			infoPedido: {
				idCliente: 1,
			},
		}),
	});
	console.log(respuesta.status);
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
	}
	console.log(datos);
}

function eliminarProducto(item, productosLista, idProducto) {
	// Busca el producto con el id y lo elimina del arreglo
	productos = productos.filter((producto) => producto.id !== idProducto);
	item.parentElement.remove();
	alternarBotonPedido(productosLista);
}

function alternarBotonPedido() {
	const botonEnviarPedido = document.getElementById('boton-enviar-pedido');
	productos.length > 0
		? (botonEnviarPedido.disabled = false)
		: (botonEnviarPedido.disabled = true);
}

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
