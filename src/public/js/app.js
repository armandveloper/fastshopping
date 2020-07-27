const productos = [];

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
	console.log(datos);
}

function eliminarProducto(item, productosLista) {
	item.parentElement.remove();
	alternarBotonPedido(productosLista);
}

function alternarBotonPedido(productosLista) {
	const botonEnviarPedido = document.getElementById('boton-enviar-pedido');
	productosLista.children.length > 0
		? (botonEnviarPedido.disabled = false)
		: (botonEnviarPedido.disabled = true);
}

function agregarProducto(e) {
	e.preventDefault();
	const productosLista = document.getElementById('productos-lista'),
		productoNombre = document.getElementById('articulo').value,
		productoCantidad = document.getElementById('cantidad').value;
	productos.push({ descripcion: productoNombre, cantidad: productoCantidad });
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
		eliminarProducto(e.target, productosLista)
	);
	alternarBotonPedido(productosLista);
}
const productosFormulario = document.getElementById('productos-formulario');
const botonEnviarPedido = document.getElementById('boton-enviar-pedido');
if (productosFormulario) {
	productosFormulario.addEventListener('submit', agregarProducto);
	alternarBotonPedido(document.getElementById('productos-lista'));
}
if (botonEnviarPedido) {
	botonEnviarPedido.addEventListener('click', enviarPedido);
}
