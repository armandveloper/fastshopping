function validarInput() {
	const importe = document.getElementById('importe').value;
	if (!importe.trim()) {
		return false;
	}
	return importe;
}

function actualizarImporte() {
	const importe = validarInput();
	if (!importe) {
		Swal.fire({
			icon: 'error',
			title: 'Campo obligatorio',
			text: 'Ingrese el importe del pedido para continuar',
		});
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
				Swal.fire(
					'¡Bien Hecho!',
					'Se ha actualizado el importe',
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
	});
}

const botonActualizarImporte = document.getElementById(
	'boton-actualizar-importe'
);

if (botonActualizarImporte) {
	botonActualizarImporte.addEventListener('click', actualizarImporte);
}
