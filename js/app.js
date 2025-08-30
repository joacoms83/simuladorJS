'use strict';

const VALOR_BTC_USD = 60000;

// ---------------- OBJETO DE CONVERSIÓN ----------------
function Conversion(tipo, entrada, salida) {
  this.tipo = tipo;      // "BTC→USD" o "USD→BTC"
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

// ---------------- VARIABLES ----------------
let historial = recuperarHistorial();

// ---------------- FUNCIONES DE CONVERSIÓN ----------------
function convertirBTCaUSD(btc) {
  return btc * VALOR_BTC_USD;
}

function convertirUSDaBTC(usd) {
  return usd / VALOR_BTC_USD;
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

  let salida, conversion;
  if (tipo === "btc-usd") {
    salida = convertirBTCaUSD(cantidad);
    conversion = new Conversion("BTC→USD", cantidad, salida);
    mostrarResultado(`${cantidad} BTC = $${salida.toFixed(2)} USD`);
  } else {
    salida = convertirUSDaBTC(cantidad);
    conversion = new Conversion("USD→BTC", cantidad, salida);
    mostrarResultado(`$${cantidad} USD = ${salida.toFixed(8)} BTC`);
  }

  historial.push(conversion);
  guardarHistorial();
  mostrarHistorial();

  e.target.reset(); 
});

document.getElementById("btn-limpiar").addEventListener("click", () => {
  if (confirm("¿Seguro que querés eliminar el historial?")) {
    historial = [];
    guardarHistorial();
    mostrarHistorial();
    mostrarResultado("📭 Historial eliminado.");
  }
});

// ---------------- INICIALIZACIÓN ----------------
mostrarHistorial();
