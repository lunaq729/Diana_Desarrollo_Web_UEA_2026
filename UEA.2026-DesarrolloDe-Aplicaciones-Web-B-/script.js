document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // --- Bootstrap: refs compartidas para UI (alert/spinner/modal) ---
    // =========================================================================
    const alertHost = document.getElementById('bootstrapAlertHost');
    const spinnerEl = document.getElementById('submitSpinner');
    const spinnerContainer = document.getElementById('submitSpinnerContainer');
    const modalElement = document.getElementById('modalConfirmacion');

    const mostrarSpinner = () => {
        if (spinnerEl) spinnerEl.classList.remove('d-none');
        if (spinnerContainer) spinnerContainer.classList.remove('d-none');
    };

    const ocultarSpinner = () => {
        if (spinnerEl) spinnerEl.classList.add('d-none');
        if (spinnerContainer) spinnerContainer.classList.add('d-none');
    };

    const showBootstrapAlert = (type, html) => {
        if (!alertHost) return;
        const icon = type === 'success' ? 'fa-check-circle' : type === 'danger' ? 'fa-circle-xmark' : 'fa-triangle-exclamation';
        alertHost.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="fa-solid ${icon} me-2"></i>${html}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
            </div>
        `;
    };

    // =========================================================================
    // --- 0. REQUERIMIENTO: Mensaje de Bienvenida MODERNO (Modal Bootstrap) ---
    // =========================================================================
    const modalWelcomeEl = document.getElementById('modalBienvenida');
    if (modalWelcomeEl && window.bootstrap) {
        const modalWelcome = new bootstrap.Modal(modalWelcomeEl);
        setTimeout(() => {
            modalWelcome.show();
        }, 500);
    }

    // =========================================================================
    // --- 1. Lógica de Registro de Usuario (Validación en Tiempo Real) ---
    // =========================================================================
    const formRegistro = document.getElementById('form-registro');
    
    const validarRealTime = (input, regex, msgError, msgExito) => {
        const errorDiv = document.getElementById(`error-${input.id}`);
        const esValido = input.value !== "" && regex.test(input.value);
        
        if (input.value === "") {
            input.classList.remove('is-valid', 'is-invalid');
            if (errorDiv) errorDiv.textContent = "";
        } else {
            if (errorDiv) {
                errorDiv.textContent = esValido ? msgExito : msgError;
                errorDiv.style.color = esValido ? '#2ecc71' : '#ff4757';
            }
            input.classList.toggle('is-valid', esValido);
            input.classList.toggle('is-invalid', !esValido);
        }
        return esValido;
    };

    const nombreInput = document.getElementById('nombre-usuario');
    const emailInput = document.getElementById('email-usuario');
    const claveInput = document.getElementById('clave-usuario');

    if(nombreInput) {
        nombreInput.addEventListener('input', () =>
            validarRealTime(nombreInput, /^[A-ZÁÉÍÓÚÑ][a-zA-ZáéíóúñÁÉÍÓÚÑ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-zA-ZáéíóúñÁÉÍÓÚÑ]+)+$/, "Debe ser: Nombre Apellido (Iniciales Mayúsculas)", "✓ Correcto")
        );
    }

    if(emailInput) {
        emailInput.addEventListener('input', () =>
            validarRealTime(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Correo electrónico inválido", "✓ Correcto")
        );
    }

    if(claveInput) {
        claveInput.addEventListener('input', () =>
            validarRealTime(claveInput, /^(?=.*[A-Z])(?=.*\*).+$/, "Debe incluir al menos una Mayúscula y un asterisco (*)", "✓ Clave segura")
        );
    }

    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();

            mostrarSpinner();
            setTimeout(() => {
                ocultarSpinner();
                showBootstrapAlert('success', '¡Usuario registrado con éxito en el sistema!');

                formRegistro.reset();
                [nombreInput, emailInput, claveInput].forEach(inp => {
                    if(inp) inp.classList.remove('is-valid', 'is-invalid');
                });
            }, 800);
        });
    }

    // =========================================================================
    // --- 2. LÓGICA DINÁMICA DE RESERVAS CON ARREGLOS Y OBJETOS ---
    // =========================================================================
    let baseDatosReservas = [
        { id: 1, nombre: "Carlos Mendoza", descripcion: "Corte degradado con diseño clásico", categoria: "Corte" },
        { id: 2, nombre: "Juan Pérez", descripcion: "Afeitado completo y perfilado de barba", categoria: "Afeitado" }
    ];

    const formReserva = document.getElementById('form-reserva');
    const lista = document.getElementById('lista-reservas');
    const contador = document.getElementById('contador');

    const renderizarReservas = () => {
        if (!lista) return;
        
        lista.innerHTML = '';
        if(contador) contador.textContent = baseDatosReservas.length;

        if (baseDatosReservas.length === 0) {
            lista.innerHTML = `
                <div class="col-12 text-center py-4">
                    <div class="alert alert-dark border-secondary text-white-50" role="alert">
                        <i class="fa-solid fa-calendar-xmark fs-4 mb-2 d-block text-warning"></i>
                        No hay turnos registrados por el momento. ¡Sé el primero en reservar!
                    </div>
                </div>
            `;
            return;
        }

        baseDatosReservas.forEach((reserva, index) => {
            const colDiv = document.createElement('div');
            colDiv.className = "col-md-6 col-lg-4";
            
            colDiv.innerHTML = `
                <div class="card bg-dark border-secondary border-opacity-50 p-3 h-100 d-flex flex-column justify-content-between shadow">
                    <div>
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="text-warning mb-0 fw-bold">${reserva.nombre}</h5>
                            <span class="badge bg-warning text-dark fw-bold">${reserva.categoria}</span>
                        </div>
                        <p class="small text-white-50 mb-3">${reserva.descripcion}</p>
                    </div>
                    <div class="text-end pt-2 border-top border-secondary border-opacity-25">
                        <button class="btn btn-sm btn-outline-danger" onclick="prepararConfirmacionCancelar(${index})">
                            <i class="fa-solid fa-trash me-1"></i>Cancelar
                        </button>
                    </div>
                </div>
            `;
            lista.appendChild(colDiv);
        });
    };

    // Mantener función global (Semana 7) pero ahora el borrado se confirma por modal
    window.eliminarReserva = (index) => {
        baseDatosReservas.splice(index, 1);
        renderizarReservas();
        showBootstrapAlert('success', 'Reserva cancelada correctamente.');
    };

    // Modal confirmación cancelar
    let reservaIndexPendiente = null;
    window.prepararConfirmacionCancelar = (index) => {
        reservaIndexPendiente = index;
        if (!modalElement || !window.bootstrap) {
            window.eliminarReserva(index);
            return;
        }

        const body = document.getElementById('modalConfirmacionBody');
        const title = document.getElementById('modalConfirmacionTitle');
        if (body) body.textContent = '¿Seguro que deseas cancelar esta reserva?';
        if (title) title.textContent = 'Confirmar cancelación';

        const btnConfirmar = document.getElementById('btnConfirmarCancelar');
        if (btnConfirmar) {
            btnConfirmar.onclick = () => {
                const idx = reservaIndexPendiente;
                reservaIndexPendiente = null;
                const m = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                m.hide();

                mostrarSpinner();
                setTimeout(() => {
                    ocultarSpinner();
                    window.eliminarReserva(idx);
                }, 600);
            };
        }

        const m = bootstrap.Modal.getOrCreateInstance(modalElement);
        m.show();
    };

    const aplicarEstilo = (input, esValido) => {
        input.classList.toggle('is-valid', esValido);
        input.classList.toggle('is-invalid', !esValido && input.value !== "");
    };

    const inputNombreReserva = document.getElementById('nombre');
    const inputDescripcion = document.getElementById('descripcion');
    const inputCategoria = document.getElementById('categoria');

    if (inputNombreReserva) inputNombreReserva.addEventListener('input', () => aplicarEstilo(inputNombreReserva, inputNombreReserva.value.trim().length >= 3));
    if (inputDescripcion) inputDescripcion.addEventListener('input', () => aplicarEstilo(inputDescripcion, inputDescripcion.value.trim() !== ""));
    if (inputCategoria) inputCategoria.addEventListener('input', () => aplicarEstilo(inputCategoria, inputCategoria.value !== ""));

    if (formReserva) {
        formReserva.addEventListener('submit', (e) => {
            e.preventDefault();

            mostrarSpinner();

            setTimeout(() => {
                const v1 = inputNombreReserva && inputNombreReserva.value.trim().length >= 3;
                const v2 = inputDescripcion && inputDescripcion.value.trim() !== "";
                const v3 = inputCategoria && inputCategoria.value !== "";

                ocultarSpinner();

                if (v1 && v2 && v3) {
                    const nuevaReserva = {
                        id: Date.now(),
                        nombre: inputNombreReserva.value.trim(),
                        descripcion: inputDescripcion.value.trim(),
                        categoria: inputCategoria.value
                    };

                    baseDatosReservas.push(nuevaReserva);
                    renderizarReservas();

                    formReserva.reset();
                    [inputNombreReserva, inputDescripcion, inputCategoria].forEach(c => {
                        if (c) c.classList.remove('is-valid');
                    });

                    showBootstrapAlert('success', 'Reserva registrada exitosamente.');
                } else {
                    showBootstrapAlert('warning', 'Por favor, completa correctamente todos los campos del turno.');
                }
            }, 800);
        });
    }
    
    // Llamada inicial para pintar las reservas de muestra
    renderizarReservas();

    // =========================================================================
    // --- 3. PANTALLA DE BIENVENIDA (Ocultar al hacer clic en el botón) ---
    // =========================================================================
    const btnEntrar = document.getElementById("btnEntrar");
    const pantallaBienvenida = document.getElementById("pantallaBienvenida");

    if (btnEntrar && pantallaBienvenida) {
        btnEntrar.addEventListener("click", function(){
            pantallaBienvenida.style.display = "none";
        });
    }
});

