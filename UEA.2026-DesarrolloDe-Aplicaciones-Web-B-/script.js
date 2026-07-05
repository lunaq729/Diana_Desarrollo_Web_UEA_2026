document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECTORES DE ELEMENTOS
    const productForm = document.getElementById('product-form');
    const listaProductos = document.getElementById('lista-productos');
    const totalRegistros = document.getElementById('total-registros');

    // Campos del Formulario
    const productName = document.getElementById('product-name');
    const productCategory = document.getElementById('product-category');
    const productDesc = document.getElementById('product-desc');

    // Contador global dinámico
    let contadorProductos = 0;

    // 2. FUNCIONES REUTILIZABLES DE VALIDACIÓN (Bordes y mensajes de Bootstrap)
    const aplicarError = (campo) => {
        campo.classList.remove('is-valid');
        campo.classList.add('is-invalid');
    };

    const aplicarExito = (campo) => {
        campo.classList.remove('is-invalid');
        campo.classList.add('is-valid');
    };

    // Validar Nombre (Mínimo 4 caracteres)
    const validarNombre = () => {
        const valor = productName.value.trim();
        if (valor === '' || valor.length < 4) {
            aplicarError(productName);
            return false;
        }
        aplicarExito(productName);
        return true;
    };

    // Validar Categoría
    const validarCategoria = () => {
        const valor = productCategory.value;
        if (valor === '' || valor === null) {
            aplicarError(productCategory);
            return false;
        }
        aplicarExito(productCategory);
        return true;
    };

    // Validar Descripción (Mínimo 15 caracteres)
    const validarDescripcion = () => {
        const valor = productDesc.value.trim();
        if (valor === '' || valor.length < 15) {
            aplicarError(productDesc);
            return false;
        }
        aplicarExito(productDesc);
        return true;
    };

    // 3. ASIGNACIÓN DE EVENTOS EN TIEMPO REAL (addEventListener)
    [productName, productCategory, productDesc].forEach(campo => {
        let funcionValidar;
        if (campo === productName) funcionValidar = validarNombre;
        if (campo === productCategory) funcionValidar = validarCategoria;
        if (campo === productDesc) funcionValidar = validarDescripcion;

        campo.addEventListener('input', funcionValidar);
        campo.addEventListener('blur', funcionValidar);
    });

    // 4. GESTIÓN DINÁMICA DE REGISTROS (Crear, Mostrar, Contar y Eliminar)
    const actualizarContador = () => {
        totalRegistros.textContent = contadorProductos;
    };

    const mostrarMensajeAlerta = (claseBootstrap, texto) => {
        // Eliminar alertas viejas antes de poner una nueva
        const alertaVieja = productForm.querySelector('.alert');
        if (alertaVieja) alertaVieja.remove();

        const alerta = document.createElement('div');
        alerta.className = `alert ${claseBootstrap} mt-3 text-center fw-bold`;
        alerta.textContent = texto;
        productForm.appendChild(alerta);

        // Se borra automáticamente después de 3 segundos
        setTimeout(() => alerta.remove(), 3000);
    };

    const agregarProductoALista = (nombre, categoria, descripcion) => {
        contadorProductos++;
        actualizarContador();

        // Crear columna contenedora adaptable
        const col = document.createElement('div');
        col.className = 'col-12 mb-2 item-producto';
        
        // Estructura interna de la tarjeta del producto
        col.innerHTML = `
            <div class="card bg-secondary bg-opacity-10 border-start border-3 border-danger shadow-sm">
                <div class="card-body p-3 d-flex justify-content-between align-items-center">
                    <div class="text-truncate me-2">
                        <span class="badge bg-danger mb-1">${categoria}</span>
                        <h6 class="card-title mb-1 text-dark text-truncate fw-bold">${nombre}</h6>
                        <p class="card-text text-muted small mb-0 text-truncate" style="max-width: 250px;">${descripcion}</p>
                    </div>
                    <button class="btn btn-sm btn-outline-danger btn-eliminar-registro" title="Eliminar Producto">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;

        // ESCUCHAR EL EVENTO CLICK DEL BOTÓN ELIMINAR DINÁMICO
        col.querySelector('.btn-eliminar-registro').addEventListener('click', () => {
            col.remove();
            contadorProductos--;
            actualizarContador();
        });

        listaProductos.appendChild(col);
    };

    // 5. MANEJO DEL EVENTO SUBMIT DEL FORMULARIO
    productForm.addEventListener('submit', (evento) => {
        evento.preventDefault(); // Evita recarga de página

        // Obliga a validar todo antes de registrar
        const esNombreValido = validarNombre();
        const esCategoriaValida = validarCategoria();
        const esDescripcionValida = validarDescripcion();

        // PERMITE REGISTRAR ÚNICAMENTE CUANDO TODAS SEAN CORRECTAS
        if (esNombreValido && esCategoriaValida && esDescripcionValida) {
            
            // Llama a la función de creación
            agregarProductoALista(productName.value.trim(), productCategory.value, productDesc.value.trim());

            // Muestra mensaje de Éxito global (alert-success)
            mostrarMensajeAlerta('alert-success', '¡Producto guardado exitosamente en el inventario!');

            // Limpiar formulario y resetear estados verdes de Bootstrap
            productForm.reset();
            [productName, productCategory, productDesc].forEach(campo => campo.classList.remove('is-valid'));

        } else {
            // Muestra mensaje de Error global (alert-danger)
            mostrarMensajeAlerta('alert-danger', 'Error: Corrige los campos vacíos o incorrectos marcados en rojo.');
        }
    });
});