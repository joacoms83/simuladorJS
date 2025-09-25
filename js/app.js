'use strict';

let tasas = {}; 
let historial = recuperarHistorial();

// ---------------- MODELO ----------------
function Conversion(tipo, entrada, salida) {
  this.tipo = tipo;
  this.entrada = entrada;
  this.salida = salida;
  this.fecha = new Date().toLocaleString();
}

// ---------------- LOCALSTORAGE ----------------
function guardarHistorial() {
  localStorage.setItem("historial", JSON.stringify(historial));
}

function recuperarHistorial() {
  const data = localStorage.getItem("historial");
  return data ? JSON.parse(data) : [];
}

// ---------------- FUNCIONES DE CONVERSIÓN ----------------
function convertir(tipo, cantidad) {
  switch (tipo) {
    case "btc-usd": return cantidad * tasas.btc_usd;
    case "usd-btc": return cantidad / tasas.btc_usd;
    case "usd-eur": return cantidad * tasas.usd_eur;
    case "eur-usd": return cantidad * tasas.eur_usd;
    case "usd-ars": return cantidad * tasas.usd_ars;
    case "ars-usd": return cantidad * tasas.ars_usd;
    default: return 0;
  }
}

// ---------------- FUNCIONES DEL DOM ----------------
function mostrarHistorial() {
  const lista = document.getElementById("lista-historial");
  lista.innerHTML = "";

  historial.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.tipo}: ${item.entrada} → ${item.salida} | ${item.fecha}`;
    lista.appendChild(li);
  });
}

function mostrarResultado(texto) {
  document.getElementById("resultado").textContent = texto;
}

// ---------------- EVENTOS ----------------
document.getElementById("form-conversor").addEventListener("submit", e => {
  e.preventDefault();

  const tipo = document.getElementById("tipo").value;
  const cantidad = parseFloat(document.getElementById("cantidad").value);

  if (isNaN(cantidad) || cantidad <= 0) {
    mostrarResultado("⚠️ Ingresá un valor válido.");
    return;
  }

  const salida = convertir(tipo, cantidad);
  const conversion = new Conversion(tipo.toUpperCase(), cantidad, salida);

  let texto = "";
  switch (tipo) {
    case "btc-usd":
      texto = `${cantidad} BTC = $${salida.toFixed(2)} USD`;
      break;
    case "usd-btc":
      texto = `$${cantidad} USD = ${salida.toFixed(8)} BTC`;
      break;
    case "usd-eur":
      texto = `$${cantidad} USD = €${salida.toFixed(2)} EUR`;
      break;
    case "eur-usd":
      texto = `€${cantidad} EUR = $${salida.toFixed(2)} USD`;
      break;
    case "usd-ars":
      texto = `$${cantidad} USD = $${salida.toFixed(2)} ARS`;
      break;
    case "ars-usd":
      texto = `$${cantidad} ARS = $${salida.toFixed(2)} USD`;
      break;
  }

  mostrarResultado(texto);
  historial.push(conversion);
  guardarHistorial();
  mostrarHistorial();

  e.target.reset();
  document.getElementById("cantidad").value = 1;
});

document.getElementById("btn-limpiar").addEventListener("click", () => {
  Swal.fire({
    title: "¿Seguro?",
    text: "Esto eliminará todo el historial.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then(result => {
    if (result.isConfirmed) {
      historial = [];
      guardarHistorial();
      mostrarHistorial();
      mostrarResultado("📭 Historial eliminado.");
    }
  });
});

// ---------------- FETCH DEL JSON ----------------
async function cargarTasas() {
  try {
    const resp = await fetch("./data.json");
    if (!resp.ok) throw new Error("Error al cargar JSON");
    tasas = await resp.json();
    console.log("Tasas cargadas:", tasas);
  } catch (error) {
    console.error("No se pudo cargar JSON, revisa el archivo.", error);
  }
}

// ---------------- INICIALIZACIÓN ----------------
async function init() {
  await cargarTasas();
  mostrarHistorial();
  document.getElementById("cantidad").value = 1;
}

init();
