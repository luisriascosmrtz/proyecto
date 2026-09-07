/* ===================== NAVEGACIÓN DE PESTAÑAS ===================== */

function mostrarPanel(n){
  document.querySelectorAll('.panel').forEach(function(p){
    p.classList.remove('activo');
  });

  document.querySelectorAll('.pestana').forEach(function(b){
    b.classList.remove('activa');
  });

  document.getElementById('panel-' + n).classList.add('activo');
  document.querySelector('.pestana[data-panel="' + n + '"]').classList.add('activa');

  window.scrollTo({top:0, behavior:'smooth'});
}


/* ===================== DESPLEGABLE "VER CONTEXTO" ===================== */

function alternarExtra(id, btn){

  var el = document.getElementById(id);

  el.classList.toggle('abierto');
  btn.classList.toggle('abierto');

  if(!btn.dataset.textoOriginal){
    btn.dataset.textoOriginal = btn.childNodes[0].textContent.trim();
  }

  btn.childNodes[0].textContent =
    (btn.classList.contains('abierto')
      ? 'Ocultar el contexto del territorio'
      : btn.dataset.textoOriginal) + ' ';

  // Inicializa mapa solo cuando se abre
  if (id === 'extra-contexto' && el.classList.contains('abierto')) {

    inicializarMapaContexto();

    setTimeout(function () {
      if (window.mapaContexto) {
        window.mapaContexto.invalidateSize();
      }
    }, 380);
  }
}


/* ===================== MAPA 1: UBICACIÓN DEL EQUIPO ===================== */

function inicializarMapaEquipo(){

  var contenedor = document.getElementById('mapa');

  if (!contenedor || contenedor.dataset.inicializado) return;

  contenedor.dataset.inicializado = 'true';

  var mapa = L.map('mapa').setView([4.5709, -74.2973], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(mapa);

  var lugares = [
    { coords: [6.2641267, -75.6128921], texto: "Medellín — Yulieth" },
    { coords: [5.004, -73.978861], texto: "Zipaquirá — Maickol" },
    { coords: [8.241342, -73.354319], texto: "Ocaña — Cristian" },
    { coords: [4.661257, -74.081933], texto: "Bogotá — Luisa" },
    { coords: [4.6755078, -74.0973168], texto: "Bogotá — Wilson" },
    { coords: [1.219889, -77.267396], texto: "Pasto — Luis" }
  ];

  lugares.forEach(function(lugar){
    L.marker(lugar.coords)
      .addTo(mapa)
      .bindTooltip(lugar.texto, { direction: "top" });
  });
}


/* ===================== MAPA 2: CONTEXTO ===================== */

var lugaresContexto = [
  { nombre: "Medellín", lat: 6.2641267, lng: -75.6128921 },
  { nombre: "Zipaquirá", lat: 5.004, lng: -73.978861 },
  { nombre: "Ocaña", lat: 8.241342, lng: -73.354319 },
  { nombre: "Bogotá", lat: 4.661257, lng: -74.081933 },
  { nombre: "Bogotá", lat: 4.6755078, lng: -74.0973168 },
  { nombre: "Pasto", lat: 1.219889, lng: -77.267396 }
];

function inicializarMapaContexto(){

  var contenedor = document.getElementById('mapa-contexto');

  if (!contenedor || contenedor.dataset.inicializado) return;

  contenedor.dataset.inicializado = 'true';

  var mapaContexto = L.map('mapa-contexto').setView([4.5709, -74.2973], 5);

  window.mapaContexto = mapaContexto;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(mapaContexto);

  var puntos = [];

  lugaresContexto.forEach(function(lugar){
    if (typeof lugar.lat === 'number' && typeof lugar.lng === 'number') {

      L.marker([lugar.lat, lugar.lng])
        .addTo(mapaContexto)
        .bindTooltip(lugar.nombre, { direction: "top" });

      puntos.push([lugar.lat, lugar.lng]);
    }
  });

  if (puntos.length > 1) {
    mapaContexto.fitBounds(puntos, { padding: [30, 30] });
  }
}


/* ===================== BOTÓN VER MÁS ===================== */

function toggleInfo(boton){
  const card = boton.parentElement;
  card.classList.toggle("activo");

  if(card.classList.contains("activo")){
    boton.textContent = "Ver menos";
  } else {
    boton.textContent = "Ver más";
  }
}


/* ===================== INICIO ===================== */

document.addEventListener("DOMContentLoaded", function () {
  inicializarMapaEquipo();
});

