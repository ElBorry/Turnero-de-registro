// Variables
let registros = [];

// Obtener registros almacenados en el almacenamiento local
function obtenerRegistrosAlmacenados() {
    const registrosJSON = localStorage.getItem('registros');
    if (registrosJSON) {
        registros = JSON.parse(registrosJSON);
        mostrarRegistros();
    }
}

// Guardar los registros en el almacenamiento local
function guardarRegistrosEnAlmacenamiento() {
    const registrosJSON = JSON.stringify(registros);
    localStorage.setItem('registros', registrosJSON);
}

// Mostrar los registros en la página
function mostrarRegistros() {
    const registrosContainer = document.getElementById('registrosContainer');
    registrosContainer.innerHTML = ''; // Limpiar el contenido anterior

    for (let i = 0; i < registros.length; i++) {
        const registro = registros[i];
        const registroElement = document.createElement('p');
        registroElement.textContent = registro;
        registrosContainer.appendChild(registroElement);
    }
}

// Función para registrar un turno
function registrarTurno(turno, persona) {
    const registro = `DNI: ${persona.dni}, Edad: ${persona.edad}, Género: ${persona.genero}, Turno: ${turno}`;
    registros.push(registro);
    guardarRegistrosEnAlmacenamiento();
    mostrarRegistros();
}

// Llamada a función para obtener los registros almacenados al cargar la página
document.addEventListener('DOMContentLoaded', obtenerRegistrosAlmacenados);
