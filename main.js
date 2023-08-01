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

  const genero = persona.genero.toUpperCase();
  const edad = persona.edad;

  switch (genero) {
    case 'M':
      if (edad <= 50) {
        turno = 'M';
      } else {
        turno = 'P';
      }
      break;
    case 'F':
      if (edad <= 50) {
        turno = 'F';
      } else {
        turno = 'P';
      }
      break;
    default:
      turno = 'Otro';
      break;
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

// Borrar los turnos almacenados
function borrarTurnos() {
  turnos = [];
  guardarTurnosEnAlmacenamiento();
  mostrarTurnos();
}

// Event Listener para el botón de borrar turnos
document.getElementById('borrarTurnosBtn').addEventListener('click', borrarTurnos);

// Event Listener para el formulario de solicitud de turno
document.getElementById('turnoForm').addEventListener('submit', solicitarTurno);


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
// Funciones para mostrar los gráficos con D3.js
function mostrarGraficoGeneros(generos) {
  const canvasGeneros = d3.select('#estadisticasChart');

    // Filtrar los turnos vacíos
    const generosData = Object.values(generos).filter(count => count > 0);
    const generosLabels = Object.keys(generos).filter(genero => generos[genero] > 0);

  const colorScale = d3.scaleOrdinal()
    .domain(generosLabels)
    .range(['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(255, 206, 86, 0.5)']);

  const width = 400;
  const height = 300;

  const svg = canvasGeneros.append('svg')
    .attr('width', width)
    .attr('height', height);

  const pie = d3.pie().value(d => d);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2 - 20);

  const arcs = svg.selectAll('arc')
    .data(pie(generosData))
    .enter()
    .append('g')
    .attr('class', 'arc')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  arcs.append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => colorScale(i))
    .attr('stroke', '#fff')
    .attr('stroke-width', '2px');

  arcs.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .text(d => d.data)
    .style('font-size', '14px')
    .style('fill', '#000');
}

function mostrarGraficoEdades(edades) {
  // Código similar al gráfico de géneros, ajusta los detalles según tus necesidades
}

  mostrarGraficoGeneros(generos);
  mostrarGraficoEdades(edades);
}

// Llamada a función para obtener los turnos almacenados al cargar la página
document.addEventListener('DOMContentLoaded', obtenerTurnosAlmacenados);

// Llamada inicial para mostrar las estadísticas al cargar la página
mostrarEstadisticas(turnos);


// Mostrar los turnos en espera en la página "llamador.html"
function mostrarTurnosEnEspera() {
  const turnosEnEsperaContainer = document.getElementById('turnosEnEspera');
  turnosEnEsperaContainer.innerHTML = '';

  for (let i = 0; i < turnos.length; i++) {
    const turno = turnos[i];
    const turnoElement = document.createElement('p');
    turnoElement.textContent = turno;
    turnosEnEsperaContainer.appendChild(turnoElement);
  }
}

// Llamar al siguiente turno
function llamarSiguienteTurno() {
  if (turnos.length > 0) {
    // Prioridad: buscar turno con 'P'
    const turnoPrioridad = turnos.find(turno => turno.includes('-P'));
    if (turnoPrioridad) {
      // Llamar al turno con prioridad
      alert('Llamando al siguiente turno con prioridad: ' + turnoPrioridad);
      // Eliminar el turno de la lista de turnos
      turnos = turnos.filter(turno => turno !== turnoPrioridad);
    } else {
      // Si no hay turnos con prioridad, llamar al turno más antiguo
      const siguienteTurno = turnos[0];
      alert('Llamando al siguiente turno: ' + siguienteTurno);
      // Eliminar el turno de la lista de turnos
      turnos.shift();
    }

    // Actualizar la lista de turnos en espera
    guardarTurnosEnAlmacenamiento();
    mostrarTurnosEnEspera();
  } else {
    alert('No hay más turnos en espera.');
  }
}

// Asignar el evento de click al botón "Siguiente Turno"
document.getElementById('siguienteTurnoBtn').addEventListener('click', llamarSiguienteTurno);

// Mostrar los turnos en espera al cargar la página
mostrarTurnosEnEspera();