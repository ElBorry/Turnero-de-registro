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
    const persona = { dni, edad, genero };

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
      registrarTurno(turno, persona);
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
  mostrarEstadisticas(turnos);
}

// Event Listener para el formulario de solicitud de turno
document.getElementById('turnoForm').addEventListener('submit', solicitarTurno);

// Llamada a función para obtener los turnos almacenados al cargar la página
document.addEventListener('DOMContentLoaded', obtenerTurnosAlmacenados);

// Estadisticas 
function mostrarEstadisticas(turnos) {
  const generos = {
    'M': 0,
    'F': 0,
    'Otro': 0,
  };

  const edades = {
    'Menor': 0,
    '1': 0,
    '2': 0,
  };

  turnos.forEach(turno => {
    const genero = turno.charAt(0);
    generos[genero]++;

    const edadIndex = turno.indexOf('-') + 1;
    const edad = turno.substring(edadIndex);
    edades[edad]++;
  });

  const generosData = Object.values(generos);
  const edadesData = Object.values(edades);

  const ctx = document.getElementById('estadisticasChart').getContext('2d');
  const estadisticasChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(generos),
      datasets: [
        {
          label: 'Género',
          data: generosData,
          backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(255, 206, 86, 0.5)'],
          borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  const ctx2 = document.getElementById('edadesChart').getContext('2d');
  const edadesChart = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: Object.keys(edades),
      datasets: [
        {
          label: 'Edades',
          data: edadesData,
          backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(153, 102, 255, 0.5)', 'rgba(255, 159, 64, 0.5)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
