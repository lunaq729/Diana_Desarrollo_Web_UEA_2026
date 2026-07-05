document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const listaProductos = document.getElementById('lista-productos');
    const totalRegistros = document.getElementById('total-registros');
    const alertContainer = document.getElementById('alert-container');
    
    let contadorProductos = 0;

    if (productForm) {
        productForm.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const nombre = document.getElementById('prod-nombre').value.trim();
            const categoria = document.getElementById('prod-categoria').value;
            const descripcion = document.getElementById('prod-descripcion').value.trim();

            if (nombre === '' || categoria === '' || descripcion === '') {
                mostrarAlerta('Por favor, complete todos los campos del formulario.', 'danger');
                return;
            }

            mostrarAlerta('¡Producto registrado con éxito!', 'success');

            // Crear columnas adaptables (1 columna en celular, 2 en tablets/PC)
            const colDiv = document.createElement('div');
            colDiv.className = 'col-12 col-md-6';

            const cardDiv = document.createElement('div');
            cardDiv.className = 'card h-100 shadow-sm border-light';

            // Usar 'div' estándar para el cuerpo de la tarjeta de Bootstrap
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body p-3';

            const cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title h6 text-uppercase fw-bold text-dark mb-1';
            cardTitle.textContent = nombre;

            const cardBadge = document.createElement('span');
            cardBadge.className = 'badge bg-secondary mb-2 d-inline-block';
            cardBadge.textContent = categoria;

            const cardText = document.createElement('p');
            cardText.className = 'card-text small text-muted mb-3';
            cardText.textContent = descripcion;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-outline-danger btn-sm w-100';
            deleteBtn.textContent = 'Eliminar Registro';

            deleteBtn.addEventListener('click', () => {
                colDiv.remove();
                contadorProductos--;
                actualizarContador();
                mostrarAlerta('Producto eliminado del inventario.', 'warning');
            });

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardBadge);
            cardBody.appendChild(cardText);
            cardBody.appendChild(deleteBtn);
            cardDiv.appendChild(cardBody);
            colDiv.appendChild(cardDiv);
            
            listaProductos.appendChild(colDiv);

            contadorProductos++;
            actualizarContador();
            productForm.reset();
        });
    }

    function actualizarContador() {
        totalRegistros.textContent = `Total: ${contadorProductos}`;
    }

    function mostrarAlerta(mensaje, tipo) {
        alertContainer.innerHTML = '';
        const alerta = document.createElement('div');
        alerta.className = `alert alert-${tipo} alert-dismissible fade show p-2 small mb-3`;
        alerta.setAttribute('role', 'alert');
        alerta.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close p-2" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        alertContainer.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 4000);
    }
});