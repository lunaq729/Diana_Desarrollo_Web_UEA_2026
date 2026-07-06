document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica de Reservas ---
    const form = document.getElementById('form-reserva');
    const lista = document.getElementById('lista-reservas');
    const contador = document.getElementById('contador');
    let total = 0;

    // --- Lógica de Validación de Usuario en Tiempo Real ---
    const validarRealTime = (input, regex, msgError, msgExito) => {
        const errorDiv = document.getElementById(`error-${input.id}`);
        const esValido = input.value !== "" && regex.test(input.value);
        
        errorDiv.textContent = input.value === "" ? "" : (esValido ? msgExito : msgError);
        errorDiv.style.color = esValido ? '#2ecc71' : '#ff4757';
        
        input.classList.toggle('is-valid', esValido);
        input.classList.toggle('is-invalid', input.value !== "" && !esValido);
        return esValido;
    };

    const nombreInput = document.getElementById('nombre-usuario');
    const emailInput = document.getElementById('email-usuario');
    const claveInput = document.getElementById('clave-usuario');

    // Validaciones en tiempo real
    nombreInput.addEventListener('input', () => 
        validarRealTime(nombreInput, /^[A-Z][a-z]+ [A-Z][a-z]+$/, 
        "Formato requerido: Nombre Apellido (Inicia con mayúsculas)", "✓ Nombre válido"));

    emailInput.addEventListener('input', () => 
        validarRealTime(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
        "El correo debe ser válido completo (ejemplo@dominio.com)", "✓ Correo correcto"));

    claveInput.addEventListener('input', () => 
        validarRealTime(claveInput, /^[A-Z](?=.*[*])(?=.*\d).{7,}$/, 
        "Mín 8 caracteres: Inicia con Mayúscula, contenga * y números", "✓ Clave segura"));

    // --- Función de validación individual para el formulario de reservas ---
    const validarCampo = (input, condicion, mensaje) => {
        const errorDiv = document.getElementById(`error-${input.id}`);
        if (condicion) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            if (errorDiv) errorDiv.textContent = "";
            return true;
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            if (errorDiv) errorDiv.textContent = mensaje;
            return false;
        }
    };

    // --- Evento Submit del Formulario (Botón Azul "+") ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener inputs de reserva
        const inputNombreReserva = document.getElementById('nombre');
        const inputDescripcion = document.getElementById('descripcion');
        const inputCategoria = document.getElementById('categoria');

        // Validar campos de reserva
        const v1 = validarCampo(inputNombreReserva, inputNombreReserva.value.trim().length >= 3, "El nombre debe tener mínimo 3 caracteres.");
        const v2 = validarCampo(inputDescripcion, inputDescripcion.value.trim() !== "", "La descripción no puede estar vacía.");
        const v3 = validarCampo(inputCategoria, inputCategoria.value !== "", "Debe seleccionar una categoría válida.");

        // Si todo es correcto, creamos el elemento visual
        if (v1 && v2 && v3) {
            total++;
            contador.textContent = total;

            // Crear la estructura de la tarjeta (Card) usando clases de Bootstrap
            const colDiv = document.createElement('div');
            colDiv.className = "col-md-6 col-lg-4";
            colDiv.innerHTML = `
                <div class="p-3 reserva-card text-white mb-2" style="background-color: #111; border: 1px solid #333; border-left: 5px solid #ff6600; border-radius: 8px;">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="text-warning mb-0"><i class="fa-solid fa-user me-2"></i>${inputNombreReserva.value.trim()}</h5>
                        <span class="badge bg-info text-dark fw-bold">${inputCategoria.value}</span>
                    </div>
                    <p class="small text-white-50 mb-0"><i class="fa-solid fa-file-lines me-2"></i>${inputDescripcion.value.trim()}</p>
                </div>
            `;

            // Agregar a la lista visual de forma consecutiva
            lista.appendChild(colDiv);

            // Limpiar formulario de texto base
            form.reset();

            // Forzamos la remoción de alertas de error y éxito de Bootstrap
            const campos = [inputNombreReserva, inputDescripcion, inputCategoria];
            campos.forEach(campo => {
                campo.classList.remove('is-valid', 'is-invalid'); // Borra bordes verdes y rojos
                const errorElemento = document.getElementById(`error-${campo.id}`);
                if (errorElemento) {
                    errorElemento.textContent = ""; // Borra los mensajes de texto rojos
                }
            });
        }
    });

    // =========================================================================
    // ✨ BOTÓN PARA VOLVER A DEJAR EL REGISTRO DE USUARIO EN BLANCO ✨
    // =========================================================================
    const contenedorUsuario = claveInput.closest('div').parentElement;

    const btnNuevoUsuario = document.createElement('button');
    btnNuevoUsuario.type = 'button';
    btnNuevoUsuario.className = 'btn btn-outline-warning w-100 mt-3 fw-bold';
    btnNuevoUsuario.innerHTML = '<i class="fa-solid fa-user-plus me-2"></i>Preparar para Nuevo Registro';
    
    contenedorUsuario.appendChild(btnNuevoUsuario);

    btnNuevoUsuario.addEventListener('click', () => {
        // Vacía las cajas de texto de arriba
        nombreInput.value = "";
        emailInput.value = "";
        claveInput.value = "";

        // Elimina los ganchos verdes y letras verdes de éxito
        const camposUsuario = [nombreInput, emailInput, claveInput];
        camposUsuario.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
            const errorDiv = document.getElementById(`error-${input.id}`);
            if (errorDiv) {
                errorDiv.textContent = "";
            }
        });
    });
});