document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-reserva');
    const lista = document.getElementById('lista-reservas');
    const contador = document.getElementById('contador');
    let total = 0;

    const validarCampo = (input, condicion, mensaje) => {
        const errorDiv = document.getElementById(`error-${input.id}`);
        if (condicion) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            return true;
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            errorDiv.textContent = mensaje;
            return false;
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre');
        const desc = document.getElementById('descripcion');
        const cat = document.getElementById('categoria');

        const v1 = validarCampo(nombre, nombre.value.length >= 3, "Mínimo 3 letras.");
        const v2 = validarCampo(desc, desc.value.length >= 10, "Mínimo 10 caracteres.");
        const v3 = validarCampo(cat, cat.value !== "", "Seleccione una opción.");

        if (v1 && v2 && v3) {
            // Crear elemento
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-3';
            card.innerHTML = `
                <div class="alert alert-success d-flex justify-content-between">
                    <div>
                        <strong>${nombre.value}</strong><br>
                        <small>${cat.value}: ${desc.value}</small>
                    </div>
                    <button class="btn btn-danger btn-sm btn-eliminar">x</button>
                </div>
            `;
            
            // Eliminar registro
            card.querySelector('.btn-eliminar').addEventListener('click', () => {
                card.remove();
                total--;
                contador.textContent = total;
            });

            lista.appendChild(card);
            total++;
            contador.textContent = total;
            form.reset();
            [nombre, desc, cat].forEach(el => el.classList.remove('is-valid'));
        }
    });
});