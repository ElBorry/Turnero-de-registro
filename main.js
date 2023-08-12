// Variables
let turnos = [];
const canvasGeneros = d3.select('#estadisticasChart');
const turnosEnEsperaContainer = document.getElementById('turnosEnEspera');

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

      // Mostrar la sección con el mensaje y número de turno
    const turnoInfoSection = document.getElementById('turnoInfo');
    turnoInfoSection.style.display = 'block';

    // Mostrar mensaje y número de turno
    document.getElementById('mensajeTurno').textContent = 'Su turno fue generado y debe aguardar a ser llamado.';
    document.getElementById('numeroTurno').textContent = turno;

    // Establecer el temporizador para ocultar la sección después de 10 segundos
    setTimeout(() => {
        turnoInfoSection.style.display = 'none';
    }, 10000);

      guardarTurnosEnAlmacenamiento();
      mostrarTurnos();
      registrarTurno(turno, persona);
    }
  }
}

let contadorTurnoP = 1;
let contadorTurnoF = 1;
let contadorTurnoM = 1;

function generarTurnoCondicional(persona) {
  let turno = '';

  const genero = persona.genero.toUpperCase();
  const edad = persona.edad;

  switch (genero) {
    case 'M':
      if (edad <= 50) {
        turno = `M-${contadorTurnoM}`;
        contadorTurnoM++;
      } else {
        turno = `P-${contadorTurnoP}`;
        contadorTurnoP++;
      }
      break;
    case 'F':
      if (edad <= 50) {
        turno = `F-${contadorTurnoF}`;
        contadorTurnoF++;
      } else {
        turno = `P-${contadorTurnoP}`;
        contadorTurnoP++;
      }
      break;
    default:
      // No se genera un turno en caso de "Otro"
      return null;
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

// Guardar los turnos en el almacenamiento local
function guardarTurnosEnAlmacenamiento() {
  const turnosJSON = JSON.stringify(turnos);
  localStorage.setItem('turnos', turnosJSON);
}

// Función para obtener turnos almacenados en el almacenamiento local
function obtenerTurnosAlmacenados() {
  const turnosJSON = localStorage.getItem('turnos');
  if (turnosJSON) {
    turnos = JSON.parse(turnosJSON);
    mostrarTurnos();
  }
}

// Función para mostrar los turnos en la página
function mostrarTurnos() {
  const turnosContainer = document.getElementById('turnosContainer');
  turnosContainer.innerHTML = '';

  for (let i = 0; i < turnos.length; i++) {
    const turno = turnos[i];
    const turnoElement = document.createElement('p');
    turnoElement.textContent = turno;
    turnosContainer.appendChild(turnoElement);
  }
  mostrarEstadisticas(turnos);
  mostrarTurnosEnEspera();
}

// Función para llamar al siguiente turno
//function llamarSiguienteTurno() {
//  if (turnos.length > 0) {
//    const turnoPrioridad = turnos.find(turno => turno.includes('P'));
//    if (turnoPrioridad) {
//      alert('Llamando al siguiente turno con prioridad: ' + turnoPrioridad);
//      turnos = turnos.filter(turno => turno !== turnoPrioridad);
//    } else {
//      const siguienteTurno = turnos[0];
//      alert('Llamando al siguiente turno: ' + siguienteTurno);
//      turnos.shift();
//    }

//    guardarTurnosEnAlmacenamiento();
//    mostrarTurnos();
//    mostrarTurnosEnEspera();
//  } else {
//    alert('No hay más turnos en espera.');
//  }
//}
function llamarSiguienteTurno() {
  const turnoLlamadoElement = document.getElementById('turnoLlamado');
  
  if (turnos.length > 0) {
    const turnoPrioridad = turnos.find(turno => turno.includes('-P'));
    if (turnoPrioridad) {
      turnoLlamadoElement.textContent = 'Turno con prioridad: ' + turnoPrioridad;
      turnos = turnos.filter(turno => turno !== turnoPrioridad);
    } else {
      const siguienteTurno = turnos[0];
      turnoLlamadoElement.textContent = 'Turno: ' + siguienteTurno;
      turnos.shift();
    }

    guardarTurnosEnAlmacenamiento();
    mostrarTurnos();
    mostrarTurnosEnEspera();
  } else {
    turnoLlamadoElement.textContent = 'No hay más turnos en espera.';
  }
}


// Función para mostrar gráfico de géneros
function mostrarGraficoGeneros(turno) {
  const canvasGeneros = d3.select('#estadisticasChart');
}
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
  crearGraficoTorta(turnos);
}
// Borrar los turnos almacenados
function borrarTurnos() {
  turnos = [];
  guardarTurnosEnAlmacenamiento();
  mostrarTurnos();
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

let graficoCreado = false;
function crearGrafico() {
    if (!graficoCreado) {
    const totalTurnos = turnos.length;
    const turnosPrioritarios = turnos.filter(turno => turno.includes('P')).length;
    const turnosNormales = totalTurnos - turnosPrioritarios;

    const datos = [
        { label: 'Prioritarios', value: (turnosPrioritarios / totalTurnos) * 100 },
        { label: 'Normales', value: (turnosNormales / totalTurnos) * 100 }
    ];

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select('#graficoContainer')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(datos.map(d => d.label))
        .range(d3.schemeCategory10);

    const pie = d3.pie()
        .value(d => d.value);

    const arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    const pieData = pie(datos);

    const g = svg.selectAll('.arc')
        .data(pieData)
        .enter().append('g')
        .attr('class', 'arc');

    g.append('path')
        .attr('d', arc)
        .style('fill', d => color(d.data.label));

    g.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .text(d => `${d.data.label}: ${d.data.value.toFixed(2)}%`);
    graficoCreado = true;
  }
}

// Resto del código de funciones...

// Llamada a función para obtener los turnos almacenados al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  obtenerTurnosAlmacenados();
  mostrarTurnos();
});

// Agregar el evento "storage" para detectar cambios en el LocalStorage
window.addEventListener('storage', (event) => {
  if (event.key === 'turnos') {
    turnos = JSON.parse(event.newValue);
    mostrarTurnos();
  }
});

// Event Listener para llamador
document.getElementById('siguienteTurnoBtn').addEventListener('click', llamarSiguienteTurno);
document.getElementById('borrarTurnosBtn').addEventListener('click', borrarTurnos);
document.getElementById('turnoForm').addEventListener('submit', solicitarTurno);
// Event Listener para el botón de crear gráfico
document.getElementById('crearGraficoBtn').addEventListener('click', () => {
  crearGraficoTorta(turnos);
});

document.getElementById('numeroTurno').textContent = turno;
document.getElementById('numeroTurno').classList.add('turno-resaltado');

// Después de 5 segundos, quitar la clase resaltada
setTimeout(() => {
  document.getElementById('numeroTurno').classList.remove('turno-resaltado');
}, 5000); // 5000 milisegundos = 5 segundos
