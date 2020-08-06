// Muestra un pedido entrante en tiempo real
function mostrarPedido({ articulos, info, creadoEl, cliente }) {
	let articulosMostrar =
		articulos.length > 3 ? articulos.slice(0, 3) : articulos;
	let plantillaArticulos = '';
	articulosMostrar.forEach((articulo) => {
		plantillaArticulos += `
      <li>${articulo.descripcion}. Cantidad: ${articulo.cantidad}</li>
    `;
	});
	let plantilla = `
  <div class="row">
    <div class="col s12">
      <p class="creado-hace">${creadoEl}</p>
    </div>
    <div class="col s12">
      <p class="direccion-pedido">Col. ${cliente.colonia} calle ${
		cliente.calle
	}</p>
    </div>
  </div>
  <div class="row valign-wrapper">
    <div class="col s10 htry-list">
      ${plantillaArticulos} 
      ${
			articulos.length > 3
				? `<span>${articulos.length - 3} artículos más</span>`
				: ''
		}
    </div>
    <div class="col s2">
      <i class="material-icons htry-icon-next">navigate_next</i>
    </div>
  </div>
  <div class="row">
    <div class="col s12">
      <a
      class="waves-effect waves-light btn blue darken-3"
      href="/repartidores/detalles/${info.idPedido}"
      target="_blank"
      rel="noopener noreferrer"
      >Atender pedido
      </a>
    </div>
  </div>
  `;
	const pedidoElem = document.createElement('div');
	pedidoElem.className = 'htry-select';
	pedidoElem.innerHTML = plantilla;
	const sinPedidosElem = document.getElementById('sin-pedidos');
	if (sinPedidosElem) {
		sinPedidosElem.remove();
	}
	// Muestra el pedido en la interfaz
	document
		.getElementById('contenido')
		.children[1].insertAdjacentElement('afterend', pedidoElem);
	pedidoElem.insertAdjacentElement('afterend', document.createElement('hr'));
}

function validarInput() {
	const importe = document.getElementById('importe').value;
	if (!importe.trim()) {
		return false;
	}
	return importe;
}

async function marcarPedidoComoEntregado() {
	const resultado = await Swal.fire({
		title: '¿Desea marcar el pedido como entregado?',
		text: 'Esta acción no es reversible',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Actualizar',
		cancelButtonText: 'Cancelar',
	});
	if (!resultado.value) {
		return;
	}
	// Se marcar como entregado
	const idPedido = document.getElementById('id-pedido').value;
	try {
		const respuesta = await fetch('/pedidos', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				idPedido,
				campoActualizar: 'entregado',
			}),
		});
		const datos = await respuesta.json();
		if (!datos.ok) {
			throw new Error(
				'Ocurrió un error al marcar el pedido como entregado. Por favor inténtelo de nuevo'
			);
		}
		botonPedidoEntregado.disabled = true;
		Swal.fire(
			'¡Bien Hecho!',
			'!Buen trabajo! Haz realizado otra entrega satisfactoriamente',
			'success'
		);
	} catch (err) {
		console.log(err);
		Swal.fire({
			title: 'Algo salió mal',
			text: err.message,
			icon: 'error',
		});
	}
}

function actualizarImporte(e) {
	e.target.disabled = true;
	const importe = validarInput();
	if (!importe) {
		Swal.fire({
			icon: 'error',
			title: 'Campo obligatorio',
			text: 'Ingrese el importe del pedido para continuar',
		});
		e.target.disabled = false;
		return;
	}
	Swal.fire({
		title: '¿Desea actualizar el importe?',
		text: 'Una vez actualizado el importe ya no se podrá cambiar',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Actualizar',
		cancelButtonText: 'Cancelar',
	}).then(async (resultado) => {
		if (resultado.value) {
			const idPedido = document.getElementById('id-pedido').value;
			try {
				const respuesta = await fetch('/pedidos', {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						idPedido,
						importe,
						campoActualizar: 'importe',
					}),
				});
				const datos = await respuesta.json();
				if (!datos.ok) {
					throw new Error(
						'Ocurrió un error al actualizar el importe. Por favor intente de nuevo'
					);
				}
				botonActualizarImporte.disabled = true;
				Swal.fire(
					'¡Bien Hecho!',
					'Se ha actualizado el importe',
					'success'
				);
				document.getElementById('importe').disabled = true;
			} catch (err) {
				console.log(err);
				Swal.fire({
					title: 'Algo salió mal',
					text: err.message,
					icon: 'error',
				});
				e.target.disabled = false;
			}
		} else {
			e.target.disabled = false;
		}
	});
}

const botonActualizarImporte = document.getElementById(
	'boton-actualizar-importe'
);

if (botonActualizarImporte) {
	botonActualizarImporte.addEventListener('click', actualizarImporte);
}

const botonPedidoEntregado = document.getElementById('boton-pedido-entregado');

if (botonPedidoEntregado) {
	botonPedidoEntregado.addEventListener('click', marcarPedidoComoEntregado);
}

// Socket io
if (window.io) {
	console.log('Attemting connect to websocket');
	const socket = io('/repartidores');
	console.log(socket);
	socket.on('nuevoPedido', (datos) => {
		console.log(datos);
		// if (!navigator.serviceWorker) {
		const audio = new Audio('/static/audio/notification.mp3');
		audio.play();
		mostrarPedido(datos);

		// mostrarNotificacion(datos);
		// }
		// document
		// 	.getElementById('tab-notificacion')
		// 	.classList.add('nueva-notificacion');
		// if (location.pathname.includes('notificaciones')) {
		// 	const sinNotificacionesTexto = document.getElementById(
		// 		'sin-notificaciones'
		// 	);
		// 	if (sinNotificacionesTexto) {
		// 		sinNotificacionesTexto.remove();
		// 	}
		// 	mostrarTarjetaNotificacion(datos);
		// }
	});
}
