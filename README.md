# HangIt - MVP Sprint 1 (Prototipo Web Autónomo)

Aplicación móvil tipo videojuego educativo para evaluar el dominio de la conjugación verbal en tiempo pasado en inglés, mediante la mecánica del ahorcado con retroalimentación exclusivamente textual.

---

## 1. Descripción del Proyecto

HangIt permite al estudiante de inglés leer oraciones incompletas y completar el verbo faltante ingresando letras con el teclado nativo de su dispositivo.

Este primer incremento (Sprint 1 / MVP) implementa el *walking skeleton* del producto:
- **5 reactivos encadenados** jugados de forma secuencial en una única pantalla.
- **7 intentos fallidos** por cada reactivo.
- **Retroalimentación exclusivamente textual** (sin muñeco del ahorcado, sin revelación de respuestas fallidas, sin menús ni resúmenes).
- **Paleta de colores cerrada** y elementos con proporciones y textos estipulados al 100%.

---

## 2. Estructura de Archivos

```
/
├── index.html       # Estructura semántica HTML5 con diseño móvil adaptable
├── styles.css       # Estilos visuales con paleta de colores fija y dimensiones exactas
├── script.js        # Lógica del juego, estado y orden estricto de evaluación (Regla 11)
├── data.js          # Estructura de datos desacoplada con los 5 reactivos precargados
├── metadata.json    # Metadatos de la aplicación para Google AI Studio
├── package.json     # Configuración y scripts del proyecto
└── README.md        # Documentación de instalación, ejecución y pruebas
```

---

## 3. Instrucciones de Ejecución

### En Google AI Studio
El prototipo está configurado para ejecutarse directamente en el entorno de Google AI Studio en el puerto 3000. Al iniciar el servidor de desarrollo, la vista previa cargará automáticamente la interfaz interactiva.

### En Entorno Local
1. Clonar o descargar el repositorio en el equipo local.
2. Asegurarse de tener instalado Node.js (versión 18 o superior).
3. Instalar las dependencias (si aplica):
   ```bash
   npm install
   ```
4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abrir el navegador web en `http://localhost:3000` o la URL indicada en la consola.
6. Para probar la experiencia en formato móvil:
   - Abrir las herramientas de desarrollador (`F12` o `Ctrl + Shift + I`).
   - Activar el modo dispositivo móvil (`Ctrl + Shift + M`).
   - Seleccionar un dispositivo como iPhone o Pixel.

---

## 4. Guía de Pruebas de Criterios de Aceptación

1. **Carga inicial**: Verificar que la barra superior muestre "Ronda 1" a la izquierda y "Reactivo 1 de 5" a la derecha, con "Intentos restantes: 7 de 7", la oración "She _ _ _ _ to school yesterday.", "Letras usadas: -", caja de texto vacía y botón "Comprobar" habilitado.
2. **Validación de caja vacía**: Pulsar "Comprobar" con la caja vacía → Mensaje neutro "Ingresa una letra". Intentos intactos.
3. **Validación no alfabética**: Ingresar "5" o "$" o "é" y pulsar "Comprobar" → Mensaje neutro "Ingresa solo letras". Caja vacía, intentos intactos.
4. **Letra correcta**: Ingresar "E" y pulsar "Comprobar" → Oración cambia a "She _ E _ _ to school yesterday.", aviso verde "¡Letra correcta!", intentos permanecen en 7 de 7, letras usadas muestra "Letras usadas: E".
5. **Letra repetida**: Ingresar "E" nuevamente y pulsar "Comprobar" → Aviso neutro "Ya intentaste esa letra". Intentos intactos, no se duplica en letras usadas.
6. **Letra incorrecta**: Ingresar "Z" y pulsar "Comprobar" → Contador baja a "Intentos restantes: 6 de 7", aviso rojo "Letra incorrecta", letras usadas muestra "Letras usadas: E, Z".
7. **Agotar intentos**: Fallar 7 veces → Contador en "Intentos restantes: 0 de 7", aviso rojo "Se agotaron tus intentos. Fallaste este reactivo", caja y botón "Comprobar" deshabilitados (fondo gris #E5E7EB), aparece botón "Siguiente reactivo".
8. **Completar reactivo**: Adivinar todas las letras restantes → Aviso verde "¡Reactivo completado correctamente!", controles bloqueados, aparece botón "Siguiente reactivo".
9. **Avance de reactivo**: Pulsar "Siguiente reactivo" → Carga reactivo 2 con "Reactivo 2 de 5", intentos en 7 de 7, letras usadas en "-", aviso vacío y botón "Siguiente reactivo" oculto.
10. **Fin de ronda**: Al terminar el reactivo 5 y pulsar "Siguiente reactivo" → Aviso "Fin de la ronda", botón "Siguiente reactivo" oculto y controles deshabilitados.
