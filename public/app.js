const API_URL = "/api/turnos";

const tbody = document.getElementById("tbody-turnos");
const mensaje = document.getElementById("mensaje");

// Mostrar mensaje
function showMsg(text, type = "success") {
  mensaje.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${text}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

// Cargar turnos
async function cargarTurnos() {
  try {
    const res = await fetch(API_URL);
    const turnos = await res.json();

    tbody.innerHTML = "";

    turnos.forEach(t => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${t.id}</td>

        <td>
          <select class="form-select form-select-sm">
            <option value="presencial" ${t.tipo === "presencial" ? "selected" : ""}>Presencial</option>
            <option value="virtual" ${t.tipo === "virtual" ? "selected" : ""}>Virtual</option>
          </select>
        </td>

        <td><input class="form-control form-control-sm" value="${t.paciente}"></td>
        <td><input type="date" class="form-control form-control-sm" value="${t.fecha}"></td>
        <td><input type="time" class="form-control form-control-sm" value="${t.hora}"></td>

        <td class="text-center">
          <button class="btn btn-sm btn-success me-2 btn-guardar">Guardar</button>
          <button class="btn btn-sm btn-danger btn-borrar">Borrar</button>
        </td>
      `;

      // GUARDAR CAMBIOS
      tr.querySelector(".btn-guardar").addEventListener("click", async () => {
        const tipo = tr.querySelector("select").value;
        const [paciente, fecha, hora] = tr.querySelectorAll("input");

        const body = {
          tipo,
          paciente: paciente.value,
          fecha: fecha.value,
          hora: hora.value
        };

        await fetch(`${API_URL}/${t.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        showMsg("Turno actualizado");
        cargarTurnos();
      });

      // BORRAR
      tr.querySelector(".btn-borrar").addEventListener("click", async () => {
        if (!confirm("¿Eliminar turno?")) return;

        await fetch(`${API_URL}/${t.id}`, {
          method: "DELETE"
        });

        showMsg("Turno eliminado");
        cargarTurnos();
      });

      tbody.appendChild(tr);
    });

  } catch (error) {
    showMsg("Error al cargar turnos", "danger");
  }
}

// AGREGAR NUEVO
document.getElementById("form-turno").addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    tipo: document.getElementById("tipo").value,
    paciente: document.getElementById("paciente").value,
    fecha: document.getElementById("fecha").value,
    hora: document.getElementById("hora").value
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  showMsg("Turno agregado");
  cargarTurnos();
  e.target.reset();
});

// RECARGAR MANUAL
document.getElementById("reload").addEventListener("click", cargarTurnos);

// INICIAL
cargarTurnos();
