/* ===================== NAVEGACIÓN DE PESTAÑAS ===================== */
function mostrarPanel(n){
  document.querySelectorAll('.panel').forEach(function(p){ p.classList.remove('activo'); });
  document.querySelectorAll('.pestana').forEach(function(b){ b.classList.remove('activa'); });
  document.getElementById('panel-' + n).classList.add('activo');
  document.querySelector('.pestana[data-panel="' + n + '"]').classList.add('activa');
  window.scrollTo({top:0, behavior:'smooth'});
}

/* ===================== DESPLEGABLE "VER CONTEXTO" ===================== */
function alternarExtra(id, btn){
  var el = document.getElementById(id);
  el.classList.toggle('abierto');
  btn.classList.toggle('abierto');
  if(!btn.dataset.textoOriginal){ btn.dataset.textoOriginal = btn.childNodes[0].textContent.trim(); }
  btn.childNodes[0].textContent = (btn.classList.contains('abierto') ? 'Ocultar el contexto del territorio' : btn.dataset.textoOriginal) + ' ';

  // El mapa del contexto se inicializa la primera vez que se abre el desplegable,
  // y se recalcula el tamaño cada vez que se abre (Leaflet lo necesita porque
  // el contenedor estaba oculto con max-height:0).
  if (id === 'extra-contexto' && el.classList.contains('abierto')) {
    inicializarMapaContexto();
    setTimeout(function () {
      if (window.mapaContexto) { window.mapaContexto.invalidateSize(); }
    }, 380);
  }
}

/* ===================== MAPA 1: UBICACIÓN DEL EQUIPO (Entrada 1) ===================== */
function inicializarMapaEquipo(){
  var contenedor = document.getElementById('mapa');
  if (!contenedor || contenedor.dataset.inicializado) return;
  contenedor.dataset.inicializado = 'true';

  var mapa = L.map('mapa').setView([4.5709, -74.2973], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(mapa);

  var lugares = [
    { coords: [6.2641267634196565, -75.61289214480745], texto: "Medellín, Antioquia — Yulieth Carolina Rojas R." },
    { coords: [5.004, -73.978861], texto: "Zipaquirá, Cundinamarca — Maickol Alejandro Alarcón R." },
    { coords: [8.241342, -73.354319], texto: "Ocaña, Norte de Santander — Cristian Leonardo Santiago G." },
    { coords: [4.661257, -74.081933], texto: "Bogotá, Cundinamarca — Luisa Fernanda Barreto N." },
    { coords: [4.675507858088218, -74.09731686766843], texto: "Bogotá, Cundinamarca — Wilson Daniel Mellado J." },
    { coords: [1.219889, -77.267396], texto: "Pasto, Nariño — Luis Fernando Riascos" }
  ];

  lugares.forEach(function(lugar) {
    L.marker(lugar.coords)
      .addTo(mapa)
      .bindTooltip(lugar.texto, { permanent: false, direction: "top" });
  });
}

/* ===================== MAPA 2: CONTEXTO DEL TERRITORIO (Entrada 2) ===================== */
var lugaresContexto = [
  { nombre: "Medellín, Antioquia", lat: 6.2641267634196565, lng: -75.61289214480745 },
  { nombre: "Zipaquirá, Cundinamarca", lat: 5.004, lng: -73.978861 },
  { nombre: "Ocaña, Norte de Santander", lat: 8.241342, lng: -73.354319 },
  { nombre: "Bogotá, Cundinamarca", lat: 4.661257, lng: -74.081933 },
  { nombre: "Bogotá, Cundinamarca", lat: 4.675507858088218, lng: -74.09731686766843 },
  { nombre: "Pasto, Nariño", lat: 1.219889, lng: -77.267396 }
];

function inicializarMapaContexto(){
  var contenedor = document.getElementById('mapa-contexto');
  if (!contenedor || contenedor.dataset.inicializado) return;
  contenedor.dataset.inicializado = 'true';

  // Vista por defecto centrada en Colombia mientras se completan las coordenadas reales.
  var mapaContexto = L.map('mapa-contexto').setView([4.5709, -74.2973], 5);
  window.mapaContexto = mapaContexto;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(mapaContexto);

  var puntosValidos = [];

  lugaresContexto.forEach(function(lugar){
    if (typeof lugar.lat === 'number' && typeof lugar.lng === 'number') {
      var marcador = L.marker([lugar.lat, lugar.lng])
        .addTo(mapaContexto)
        .bindTooltip(lugar.nombre, { permanent: false, direction: "top" });
      puntosValidos.push([lugar.lat, lugar.lng]);
    }
  });

  if (puntosValidos.length === 1) {
    mapaContexto.setView(puntosValidos[0], 12);
  } else if (puntosValidos.length > 1) {
    mapaContexto.fitBounds(puntosValidos, { padding: [30, 30] });
  }
}

/* ===================== INICIO ===================== */
document.addEventListener("DOMContentLoaded", function () {
  inicializarMapaEquipo();
});
