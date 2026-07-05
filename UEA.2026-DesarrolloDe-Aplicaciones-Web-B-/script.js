document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECTORES AJUSTADOS A TU FORMULARIO ORIGINAL
    // Buscamos el formulario dentro de la sección de gestión
    const productForm = document.querySelector('#gestion-productos form') || document.getElementById('product-form');
    const listaProductos = document.getElementById('lista-productos') || document.querySelector('.row.g-2') || document.body;
    
    // Buscar los campos por su etiqueta o placeholder si cambiaron los IDs
    const productName = document.querySelector('input[placeholder*="Chaqueta"]') || document.getElementById('product-name');
    const productCategory = document.querySelector('select') || document.getElementById('product-category');
    const productDesc = document.querySelector('textarea') || document.getElementById('product-desc');
    const totalRegistros = document.querySelector('.badge.bg-danger') || document.getElementById('total-registros') || document.querySelector('[class*="Total"]');

    let contadorProductos = 0;

    // 2. REGLAS VISUALES (Si no encuentra el invalid-feedback, usa el borde de Bootstrap)
    const aplicarError = (campo) => {
        campo.classList.remove('is-valid');
        campo.classList.add('is-invalid');
    };

    const aplicarExito = (campo) => {
        campo.classList.remove('is-invalid');
        campo.classList.add('is-valid');
    };

    const validarNombre = () => {
        const valor = productName.value.trim();
        if (valor === '' || valor.length < 4) {
            aplicarError(productName);
            return false;
        }
        aplicarExito(productName);
        return true;
    };

    const validarCategoria = () => {
        const valor = productCategory.value;
        if (valor === '' || valor === null || valor.includes('Seleccione')) {
            aplicarError(productCategory);
            return false;
        }
        aplicarExito(productCategory);
        return true;
    };

    const validarDescripcion = () => {
        const valor = productDesc.value.trim();
        if (valor === '' || valor.length < 15) {
            aplicarError(productDesc);
            return false;
        }
        aplicarExito(productDesc);
        return true;
    };

    // 3. EVENTOS EN TIEMPO REAL
    if (productName && productCategory && productDesc) {
        [productName, productCategory, productDesc].forEach(campo => {
            let funcionValidar;
            if (campo === productName) funcionValidar = validarNombre;
            if (campo === productCategory) funcionValidar = validarCategoria;
            if (campo === productDesc) funcionValidar = validarDescripcion;

            campo.addEventListener('input', funcionValidar);
            campo.addEventListener('blur', funcionValidar);
        });
    }

    // 4. CREAR Y ELIMINAR REGISTROS
    const actualizarContador = () => {
        if (totalRegistros) {
            // Intenta actualizar el botón que dice "Total: 0"
            totalRegistros.textContent = `Total: ${contadorProductos}`;
        }
    };

    const agregarProductoALista = (nombre, categoria, descripcion) => {
        contadorProductos++;
        actualizarContador();

        const col = document.createElement('div');
        col.className = 'col-12 mb-2 p-2 bg-light border rounded shadow-sm d-flex justify-content-between align-items-center';
        col.innerHTML = `
            <div>
                <span class="badge bg-dark mb-1">${categoria}</span>
                <h6 class="mb-0 fw-bold text-dark">${nombre}</h6>
                <small class="text-muted d-block">${descripcion}</small>
            </div>
            <button class="btn btn-sm btn-danger btn-eliminar" type="button">🗑️</button>
        `;

        col.querySelector('.btn-eliminar').addEventListener('click', () => {
            col.remove();
            contadorProductos--;
            actualizarContador();
        });

        // Insertar debajo del título de Productos Registrados
        const tituloRegistrados = document.querySelector('[class*="Productos Registrados"]') || productForm;
        tituloRegistrados.after(col);
    };

    // 5. ESCUCHAR EL CLICK DEL BOTÓN REGISTRAR
    // Buscamos el botón negro de tu captura que dice "Registrar Producto"
    const botonRegistrar = document.querySelector('button[type="submit"]') || document.querySelector('input[type="submit"]') || document.querySelector('.btn-dark') || productForm?.querySelector('button') || document.querySelector('button');

    if (botonRegistrar) {
        // Nos aseguramos de que el botón sea de tipo submit para que dispare el formulario
        if (botonRegistrar.tagName === 'BUTTON' && !botonRegistrar.getAttribute('type')) {
            botonRegistrar.setAttribute('type', 'submit');
        }

        botonRegistrar.addEventListener('click', (evento) => {
            if (productForm) {
                // Si está dentro de un form, el evento submit lo maneja el form, si no, lo manejamos aquí
                const esForm = productForm.tagName === 'FORM';
                if (!esForm) evento.preventDefault();
            } else {
                evento.preventDefault();
            }

            const nOk = validarNombre();
            const cOk = validarCategoria();
            const dOk = validarDescripcion();

            if (nOk && cOk && dOk) {
                agregarProductoALista(productName.value, productCategory.value, productDesc.value);
                
                // Limpiar
                productName.value = '';
                productCategory.selectedIndex = 0;
                productDesc.value = '';
                
                [productName, productCategory, productDesc].forEach(c => c.classList.remove('is-valid'));
                alert('¡Producto registrado con éxito!');
            } else {
                alert('Por favor, llena los campos correctamente en rojo.');
            }
        });
    }

    if (productForm && productForm.tagName === 'FORM') {
        productForm.addEventListener('submit', (e) => e.preventDefault());
    }
});