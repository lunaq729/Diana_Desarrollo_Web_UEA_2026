// ============================================================================
// TEMPLATES.JS
// Simula un sistema de plantillas (herencia tipo base.html) en un proyecto
// HTML/CSS/JS puro, sin backend. Carga los fragmentos reutilizables
// (header, nav, footer) desde archivos separados en /templates/ y los
// inyecta en los contenedores <div id="...-placeholder"> del index.html.
//
// IMPORTANTE: fetch() no funciona abriendo el HTML directo con doble clic
// (protocolo file://) por restricciones CORS del navegador. Para probarlo
// en el computador usa la extensión "Live Server" de VS Code (clic derecho
// en index.html -> "Open with Live Server"). En GitHub Pages funcionará
// sin problema porque el sitio se sirve por HTTP real.
// ============================================================================

// Función genérica: trae un fragmento HTML y lo inserta en un contenedor
async function cargarFragmento(rutaArchivo, idContenedor) {
    try {
        const respuesta = await fetch(rutaArchivo);

        if (!respuesta.ok) {
            throw new Error(`No se pudo cargar ${rutaArchivo} (status ${respuesta.status})`);
        }

        const html = await respuesta.text();
        document.getElementById(idContenedor).innerHTML = html;
    } catch (error) {
        console.error('Error cargando plantilla:', error);
        document.getElementById(idContenedor).innerHTML =
            `<p class="text-danger small">No se pudo cargar ${rutaArchivo}</p>`;
    }
}

// Cargar los 3 fragmentos de plantilla en paralelo apenas el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    cargarFragmento('templates/header.html', 'header-placeholder');
    cargarFragmento('templates/nav.html', 'nav-placeholder');
    cargarFragmento('templates/footer.html', 'footer-placeholder');
});