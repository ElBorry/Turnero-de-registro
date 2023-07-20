// Objeto Persona
function Persona(dni, edad, genero) {
  this.dni = dni;
  this.edad = edad;
  this.genero = genero;
}

// Variables
let turnos = [];

// Obtener turnos almacenados en el almacenamiento local
function obtenerTurnosAlmacenados() {
  const turnosJSON = localStorage.getItem('turnos');
  if (turnosJSON) {
    turnos = JSON.parse(turnosJSON);
    mostrarTurnos();
  }
}

// Guardar los turnos en el almacenamiento local
function guardarTurnosEnAlmacenamiento() {
  const turnosJSON = JSON.stringify(turnos);
  localStorage.setItem('turnos', turnosJSON);
}
// Vaciar el localStorage
//localStorage.clear();

// Generar un turno condicional basado en la persona
function generarTurnoCondicional(persona) {
  let turno = '';

  if (persona.genero.toUpperCase() === 'M' && persona.edad <= 50) {
    turno = 'M';
  } else if (persona.genero.toUpperCase() === 'F' && persona.edad <= 50) {
    turno = 'F';
  } else if (persona.edad > 50) {
    turno = 'P';
  } else {
    turno = 'Otro';
  }

  if (persona.edad < 18) {
    turno += '-Menor';
  } else if (persona.edad >= 18 && persona.edad <= 50) {
    turno += '-1';
  } else {
    turno += '-2';
  }

  // Obtener la hora actual
  const horaActual = new Date();
  const horaFormateada = horaActual.toLocaleTimeString();

  // Agregar la hora al turno
  turno += ` (${horaFormateada})`;

  return turno;
}

// Solicitar un turno
function solicitarTurno(event) {
  event.preventDefault();

  const dni = document.getElementById('dniInput').value.trim();
  const edad = parseInt(document.getElementById('edadInput').value);
  const genero = document.getElementById('generoInput').value.trim().toUpperCase();

  if (dni !== '') {
    const persona = new Persona(dni, edad, genero);

    if (persona.edad < 18) {
      document.getElementById('numeroTurno').textContent = '';
      document.getElementById('mensajeTurno').textContent = 'Eres menor de edad, no puedes solicitar turnos.';
    } else {
      const turno = generarTurnoCondicional(persona);
      turnos.push(turno);

      document.getElementById('numeroTurno').textContent = turno;
      document.getElementById('mensajeTurno').textContent = (persona.edad >= 18 && persona.edad <= 50) ? 'Su turno fue generado y debe aguardar a ser llamado.' : 'Su turno fue generado, a la brevedad será llamado.';

      guardarTurnosEnAlmacenamiento();
      mostrarTurnos();
    }
  }
}

// Mostrar los turnos en la página
function mostrarTurnos() {
  const turnosContainer = document.getElementById('turnosContainer');
  turnosContainer.innerHTML = ''; // Limpiar el contenido anterior

  for (let i = 0; i < turnos.length; i++) {
    const turno = turnos[i];
    const turnoElement = document.createElement('p');
    turnoElement.textContent = turno;
    turnosContainer.appendChild(turnoElement);
  }
}

// Event Listener para el formulario de solicitud de turno
document.getElementById('turnoForm').addEventListener('submit', solicitarTurno);

// Llamada a función para obtener los turnos almacenados al cargar la página
obtenerTurnosAlmacenados();
// Llamada a función para evitar el error  "Uncaught TypeError: Cannot set properties of null (setting 'innerHTML')"
document.addEventListener('DOMContentLoaded', obtenerTurnosAlmacenados);
