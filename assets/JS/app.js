// Datos iniciales
let pacientes = [];
let citas = [];
let medicamentos = [];

// Referencias al DOM
const citasSection = document.getElementById("citas-section");
const pacientesSection = document.getElementById("pacientes-section");
const modalMedicamentos = document.getElementById("modal-medicamentos");
const modalHistoriaClinica = document.getElementById("modal-historia-clinica");
const pacientesList = document.getElementById("pacientes-list");
const citasList = document.getElementById("citas-list");
const medicamentosList = document.getElementById("medicamentos-list");
const cerrarModal = document.getElementById("cerrar-modal");
const cerrarHistoriaModal = document.getElementById("cerrar-historia-modal");
const historiaClinicaTexto = document.getElementById("historia-clinica-texto");
let pacienteSeleccionadoId = null; // Para saber qué paciente está siendo editado

// Navegación entre secciones
document.getElementById("btn-citas").addEventListener("click", () => {
  citasSection.classList.remove("hidden");
  pacientesSection.classList.add("hidden");
});

document.getElementById("btn-pacientes").addEventListener("click", () => {
  pacientesSection.classList.remove("hidden");
  citasSection.classList.add("hidden");
});

// Redirigir al calendario
document.getElementById("btn-calendario").addEventListener("click", () => {
    window.location.href = "calendar.html";  // Cambia a la ruta correcta de tu calendario
  });
  
// Botones para cerrar modales
cerrarModal.addEventListener("click", () => {
  modalMedicamentos.classList.add("hidden");
  pacienteSeleccionadoId = null;
});

cerrarHistoriaModal.addEventListener("click", () => {
  modalHistoriaClinica.classList.add("hidden");
  pacienteSeleccionadoId = null;
});

// Agregar paciente
document.getElementById("btn-agregar-paciente").addEventListener("click", () => {
  const nombre = prompt("Ingrese el nombre del paciente:");
  const edad = prompt("Ingrese la edad del paciente:");
  const genero = prompt("Ingrese el género del paciente (M/F):");
  const identificacion = prompt("Ingrese el número de identificación del paciente:");
  if (nombre && edad && genero && identificacion) {
    pacientes.push({
      id: Date.now(),
      nombre,
      edad,
      genero,
      identificacion,
      historiaClinica: "",
    });
    renderPacientes();
  }
});

// Agregar cita
document.getElementById("btn-agregar-cita").addEventListener("click", () => {
    const pacienteNombre = prompt("Nombre del paciente para la cita:");
    const paciente = pacientes.find((p) => p.nombre === pacienteNombre);
    if (paciente) {
      const fecha = prompt("Fecha de la cita (YYYY-MM-DD):");
      const hora = prompt("Hora de la cita (HH:MM):");
      const motivo = prompt("Motivo de la cita:");
      if (fecha && hora && motivo) {
        citas.push({ id: Date.now(), paciente: paciente.nombre, fecha, hora, motivo });
        renderCitas();
      }
    } else {
      alert("Paciente no encontrado.");
    }
  });

// Renderizar pacientes
function renderPacientes() {
    pacientesList.innerHTML = "";
    pacientes.forEach((paciente) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${paciente.nombre}</td>
        <td>${paciente.edad}</td>
        <td>${paciente.genero}</td>
        <td>${paciente.identificacion}</td>
        <td>
          <button onclick="verMedicamentos(${paciente.id})">Medicamentos</button>
          <button onclick="verHistoriaClinica(${paciente.id})">Historia Clínica</button>
          <button onclick="eliminarPaciente(${paciente.id})" class="btn-eliminar">Eliminar</button>
        </td>
      `;
      pacientesList.appendChild(tr);
    });
  }
  
  // Eliminar paciente
  function eliminarPaciente(pacienteId) {
    // Confirmación antes de eliminar
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este paciente?");
    if (confirmar) {
      // Filtrar pacientes para eliminar el seleccionado
      pacientes = pacientes.filter((paciente) => paciente.id !== pacienteId);
      // Actualizar la tabla
      renderPacientes();
      alert("Paciente eliminado con éxito.");
    }
  }

// Renderizar citas
function renderCitas() {
    citasList.innerHTML = "";
    citas.forEach((cita) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${cita.paciente}</td>
        <td>${cita.fecha}</td>
        <td>${cita.hora}</td>
        <td>${cita.motivo}</td>
        <td><button onclick="eliminarCita(${cita.id})" class="btn-eliminar">Eliminar</button></td>
      `;
      citasList.appendChild(tr);
    });
  }

// Eliminar cita
function eliminarCita(citaId) {
  citas = citas.filter((cita) => cita.id !== citaId);
  renderCitas();
}

// Ver medicamentos de un paciente
function verMedicamentos(pacienteId) {
  modalMedicamentos.classList.remove("hidden");
  pacienteSeleccionadoId = pacienteId;
  renderMedicamentos();
}

// Renderizar medicamentos
function renderMedicamentos() {
    medicamentosList.innerHTML = "";
    const medicamentosPaciente = medicamentos.filter((med) => med.pacienteId === pacienteSeleccionadoId);
    medicamentosPaciente.forEach((med) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${med.nombre}</td>
        <td>${med.dosis}</td>
        <td>${med.hora}</td>
        <td>${med.duracion} días</td>
        <td>${med.frecuencia}</td>
        <td><button onclick="eliminarMedicamento(${med.id})" class="btn-eliminar">Eliminar</button></td>
      `;
      medicamentosList.appendChild(tr);
    });
  }

// Eliminar medicamento
function eliminarMedicamento(medId) {
  medicamentos = medicamentos.filter((med) => med.id !== medId);
  renderMedicamentos();
}

// Agregar medicamento
document.getElementById("medicamentos-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("medicamento-nombre").value;
    const dosis = document.getElementById("medicamento-dosis").value;
    const hora = document.getElementById("medicamento-hora").value;
    const duracion = document.getElementById("medicamento-duracion").value;
    const frecuencia = document.getElementById("medicamento-frecuencia").value;

    if (nombre && dosis && hora && duracion && frecuencia && pacienteSeleccionadoId) {
      medicamentos.push({
        id: Date.now(),
        pacienteId: pacienteSeleccionadoId,
        nombre,
        dosis,
        hora,
        duracion,
        frecuencia,
      });
      renderMedicamentos();
      document.getElementById("medicamentos-form").reset();
    }
  });

// Ver historia clínica
function verHistoriaClinica(pacienteId) {
  pacienteSeleccionadoId = pacienteId;
  const paciente = pacientes.find((p) => p.id === pacienteId);
  historiaClinicaTexto.value = paciente.historiaClinica || "";
  modalHistoriaClinica.classList.remove("hidden");
}

// Guardar historia clínica
document.getElementById("guardar-historia").addEventListener("click", () => {
  const paciente = pacientes.find((p) => p.id === pacienteSeleccionadoId);
  paciente.historiaClinica = historiaClinicaTexto.value;
  alert("Historia clínica guardada exitosamente.");
  modalHistoriaClinica.classList.add("hidden");
});
