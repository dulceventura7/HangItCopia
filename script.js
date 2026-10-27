/**
 * @file script.js
 * @description Lógica del juego HangIt - MVP Sprint 1.
 * Implementa las 11 Reglas de Negocio y las Historias de Usuario HU-05, HU-12, HU-13, HU-14 y HU-15.
 */

import { REACTIVOS } from './data.js';

// Estado global de la sesión de juego
let indiceReactivo = 0;
let intentosRestantes = 7;
/** @type {string[]} */
let letrasUsadas = [];
/** @type {Set<string>} */
let letrasReveladas = new Set();
let reactivoCerrado = false;
/** @type {Array<{id: number, acertado: boolean}>} */
const sesionResultados = [];

// Elementos del DOM
const etiquetaRonda = document.getElementById('etiqueta-ronda');
const etiquetaReactivo = document.getElementById('etiqueta-reactivo');
const franjaIntentos = document.getElementById('franja-intentos');
const textoOracion = document.getElementById('texto-oracion');
const etiquetaLetrasUsadas = document.getElementById('etiqueta-letras-usadas');
const cajaLetra = /** @type {HTMLInputElement} */ (document.getElementById('caja-letra'));
const botonComprobar = /** @type {HTMLButtonElement} */ (document.getElementById('boton-comprobar'));
const areaAvisos = document.getElementById('area-avisos');
const botonSiguiente = /** @type {HTMLButtonElement} */ (document.getElementById('boton-siguiente'));

/**
 * Genera la representación visual del verbo oculto con guiones bajos o letras reveladas.
 * @param {string} verbo - Verbo objetivo en mayúsculas.
 * @returns {string} Verbo formateado con guiones y letras separados por espacio.
 */
function obtenerTextoVerbo(verbo) {
  return verbo
    .split('')
    .map(caracter => (letrasReveladas.has(caracter) ? caracter : '_'))
    .join(' ');
}

/**
 * Actualiza la tarjeta central con la oración correspondiente y sus guiones/letras.
 */
function actualizarOracion() {
  const reactivoActual = REACTIVOS[indiceReactivo];
  const representacionVerbo = obtenerTextoVerbo(reactivoActual.verbo);
  if (textoOracion) {
    textoOracion.textContent = reactivoActual.oracion.replace('{verb}', representacionVerbo);
  }
}

/**
 * Actualiza el texto de la franja del contador de intentos restantes.
 */
function actualizarContadorIntentos() {
  if (franjaIntentos) {
    franjaIntentos.textContent = `Intentos restantes: ${intentosRestantes} de 7`;
  }
}

/**
 * Actualiza la etiqueta de letras usadas con el formato requerido.
 */
function actualizarLetrasUsadas() {
  if (etiquetaLetrasUsadas) {
    if (letrasUsadas.length === 0) {
      etiquetaLetrasUsadas.textContent = "Letras usadas: -";
    } else {
      etiquetaLetrasUsadas.textContent = `Letras usadas: ${letrasUsadas.join(', ')}`;
    }
  }
}

/**
 * Muestra un mensaje en el área de avisos con el color y tipografía especificados.
 * @param {string} mensaje - Texto del aviso a mostrar.
 * @param {'vacio' | 'neutro' | 'rojo' | 'verde'} tipo - Tipo de aviso para aplicar estilos.
 */
function mostrarAviso(mensaje, tipo) {
  if (!areaAvisos) return;
  areaAvisos.textContent = mensaje;
  areaAvisos.className = 'area-avisos';

  if (tipo === 'verde') {
    areaAvisos.classList.add('aviso-verde');
  } else if (tipo === 'rojo') {
    areaAvisos.classList.add('aviso-rojo');
  } else if (tipo === 'neutro') {
    areaAvisos.classList.add('aviso-neutro');
  } else {
    areaAvisos.classList.add('aviso-vacio');
  }
}

/**
 * Deshabilita la caja de texto y el botón Comprobar al terminar un reactivo.
 */
function deshabilitarControles() {
  if (cajaLetra) {
    cajaLetra.disabled = true;
  }
  if (botonComprobar) {
    botonComprobar.disabled = true;
  }
}

/**
 * Muestra el botón de avanzar al siguiente reactivo.
 */
function mostrarBotonSiguiente() {
  if (botonSiguiente) {
    botonSiguiente.classList.remove('oculto');
  }
}

/**
 * Procesa la letra ingresada siguiendo estrictamente el orden de evaluación de la Regla 11.
 */
function procesarJugada() {
  if (reactivoCerrado) return;

  const valor = cajaLetra ? cajaLetra.value : '';

  // Regla 11 - Caso (1): Caja vacía
  if (!valor || valor.trim() === '') {
    mostrarAviso("Ingresa una letra", "neutro");
    return;
  }

  // Regla 11 - Caso (2): Carácter no alfabético fuera de A-Z
  if (!/^[A-Za-z]$/.test(valor)) {
    mostrarAviso("Ingresa solo letras", "neutro");
    if (cajaLetra) {
      cajaLetra.value = '';
    }
    return;
  }

  const letra = valor.toUpperCase();

  // Regla 11 - Caso (3): Letra ya intentada presente en el listado de letras usadas
  if (letrasUsadas.includes(letra)) {
    mostrarAviso("Ya intentaste esa letra", "neutro");
    if (cajaLetra) {
      cajaLetra.value = '';
    }
    return;
  }

  const reactivoActual = REACTIVOS[indiceReactivo];
  const verboActual = reactivoActual.verbo.toUpperCase();

  // Regla 11 - Caso (4): Letra correcta que pertenece al verbo oculto
  if (verboActual.includes(letra)) {
    letrasReveladas.add(letra);
    letrasUsadas.push(letra);
    actualizarLetrasUsadas();
    actualizarOracion();
    if (cajaLetra) {
      cajaLetra.value = '';
    }

    // Comprobar si se completaron todas las letras pendientes del verbo
    const todasReveladas = verboActual.split('').every(caracter => letrasReveladas.has(caracter));

    if (todasReveladas) {
      reactivoCerrado = true;
      sesionResultados.push({ id: reactivoActual.id, acertado: true });
      mostrarAviso("¡Reactivo completado correctamente!", "verde");
      deshabilitarControles();
      mostrarBotonSiguiente();
    } else {
      mostrarAviso("¡Letra correcta!", "verde");
    }
    return;
  }

  // Regla 11 - Caso (5): Letra incorrecta que no pertenece al verbo oculto
  intentosRestantes--;
  letrasUsadas.push(letra);
  actualizarLetrasUsadas();
  actualizarContadorIntentos();
  if (cajaLetra) {
    cajaLetra.value = '';
  }

  if (intentosRestantes === 0) {
    reactivoCerrado = true;
    sesionResultados.push({ id: reactivoActual.id, acertado: false });
    mostrarAviso("Se agotaron tus intentos. Fallaste este reactivo", "rojo");
    deshabilitarControles();
    mostrarBotonSiguiente();
  } else {
    mostrarAviso("Letra incorrecta", "rojo");
  }
}

/**
 * Carga e inicializa el reactivo indicado en pantalla.
 * @param {number} indice - Índice del reactivo (0 a 4).
 */
function cargarReactivo(indice) {
  reactivoCerrado = false;
  intentosRestantes = 7;
  letrasUsadas = [];
  letrasReveladas.clear();

  if (etiquetaRonda) {
    etiquetaRonda.textContent = "Ronda 1";
  }
  if (etiquetaReactivo) {
    etiquetaReactivo.textContent = `Reactivo ${indice + 1} de 5`;
  }

  actualizarContadorIntentos();
  actualizarLetrasUsadas();
  actualizarOracion();
  mostrarAviso("", "vacio");

  if (cajaLetra) {
    cajaLetra.disabled = false;
    cajaLetra.value = '';
  }
  if (botonComprobar) {
    botonComprobar.disabled = false;
  }
  if (botonSiguiente) {
    botonSiguiente.classList.add('oculto');
  }
}

/**
 * Maneja el avance al siguiente reactivo o finaliza la ronda si es el reactivo 5.
 */
function avanzarReactivo() {
  if (indiceReactivo < REACTIVOS.length - 1) {
    indiceReactivo++;
    cargarReactivo(indiceReactivo);
  } else {
    // CA 15.9: Quinto reactivo terminado, pulsar Siguiente reactivo finaliza la ronda
    mostrarAviso("Fin de la ronda", "neutro");
    if (botonSiguiente) {
      botonSiguiente.classList.add('oculto');
    }
  }
}

// Configuración de escuchadores de eventos
if (botonComprobar) {
  botonComprobar.addEventListener('click', procesarJugada);
}

if (botonSiguiente) {
  botonSiguiente.addEventListener('click', avanzarReactivo);
}

// Regla 10: La tecla de confirmación (Enter/Listo) no procesa jugada; cierra el teclado
if (cajaLetra) {
  cajaLetra.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
      evento.preventDefault();
      cajaLetra.blur();
    }
  });
}

// Inicialización de la aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  cargarReactivo(0);
});
