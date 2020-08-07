async function eliminarRepartidor(e) {
	e.target.disabled = true;
	let resultado = await Swal.fire({
		title: '¿Desea eliminar esta cuenta?',
		text: 'Esta acción no es reversible',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Sí Eliminar',
		cancelButtonText: 'Cancelar',
	});
	if (!resultado.value) {
		e.target.disabled = false;
		return;
	}
	try {
		const respuesta = await fetch('/repartidores', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id: e.target.value }),
		});
		const datos = await respuesta.json();
		if (!datos.ok) {
			throw new Error('Error al eliminar cuenta');
		}
		Swal.fire(
			'¡Cuenta eliminada!',
			'¡Se ha eliminada la cuenta!',
			'success'
		).then(() => (location.href = '/admin/plantilla-repartidores'));
	} catch (err) {
		console.error(err);
		Swal.fire({
			title: 'Algo salió mal',
			text:
				'Ocurrió un error al eliminar la cuenta. Por favor intente de nuevo',
			icon: 'error',
		});
		e.target.disabled = false;
	}
}

document.addEventListener('DOMContentLoaded', function () {
	var elems = document.querySelectorAll('.sidenav');
	M.Sidenav.init(elems);
	var collapsibleElem = document.querySelector('.collapsible');
	M.Collapsible.init(collapsibleElem);
});

const botonEliminarRepartidor = document.getElementById(
	'boton-eliminar-repartidor'
);

if (botonEliminarRepartidor) {
	botonEliminarRepartidor.addEventListener('click', eliminarRepartidor);
}
