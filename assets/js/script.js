
const preguntas = [
    {
        pregunta: "La (A) es de:",
        opciones: ["Animacion", "Analisis", "Animar", "Antorcha"],
        correcta: 1
    },
    {
        pregunta: "Bootstrap es un:",
        opciones: ["Data-Base", "Sistema de gestion", "Framework", "no se"],
        correcta: 2
    },
    {
        pregunta: "¿Que es html?",
        opciones: ["una comida", "diseño en cascada", "lenguaje de marcado", "ninguna de las anteriores"],
        correcta: 2
    },
    {
        pregunta: "¿Qué lenguaje se utiliza para dar estilos a una página web?",
        opciones: ["Html", "Css", "Js", "Python"],
        correcta: 1
    },
    {
        pregunta: "¿Que hace git hub?",
        opciones: ["crea estilos", "almacena repositorios ", "da funcionalidad con codigo a una pagina ", "no se con que se come eso"],
        correcta: 1
    }
];

// Variables principales del juego

const TIEMPO = 60;

let numeroPregunta = 0;
let puntaje = 0;
let segundos = TIEMPO;
let temporizador;
let resumen = [];

// Conectamos los elementos del HTML

const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaQuiz = document.getElementById("pantalla-quiz");
const pantallaResultado = document.getElementById("pantalla-resultado");

const textoProgreso = document.getElementById("texto-progreso");
const textoPuntaje = document.getElementById("texto-puntaje");
const textoTiempo = document.getElementById("texto-tiempo");
const textoPregunta = document.getElementById("texto-pregunta");

const contenedorRespuestas = document.getElementById("contenedor-respuestas");
const botonSiguiente = document.getElementById("boton-siguiente");
const mensajeRespuesta = document.getElementById("mensaje-respuesta");
const barraProgreso = document.getElementById("progreso");

// Configuramos los botones principales

document.getElementById("boton-empezar").addEventListener("click", empezar);

document.getElementById("boton-reiniciar").addEventListener("click", empezar);

botonSiguiente.addEventListener("click", siguientePregunta);

// Función para comenzar o reiniciar el examen

function empezar() {

    // Reiniciamos los valores del juego

    clearInterval(temporizador);

    numeroPregunta = 0;
    puntaje = 0;
    resumen = [];

    // Mostramos la pantalla de preguntas

    pantallaInicio.classList.add("oculto");
    pantallaResultado.classList.add("oculto");
    pantallaQuiz.classList.remove("oculto");

    mostrarPregunta();
}

// Función para mostrar las preguntas

function mostrarPregunta() {

    const preguntaActual = preguntas[numeroPregunta];

    // Actualizamos la información de la pantalla

    textoProgreso.textContent = "Pregunta " + (numeroPregunta + 1) + " de " + preguntas.length;

    textoPuntaje.textContent = "Puntos: " + puntaje;

    textoPregunta.textContent = preguntaActual.pregunta;

    // Actualizamos la barra de progreso

    barraProgreso.style.width = ((numeroPregunta + 1) / preguntas.length) * 100 + "%";

    // Limpiamos las respuestas anteriores

    contenedorRespuestas.innerHTML = "";

    mensajeRespuesta.textContent = "";

    botonSiguiente.classList.add("oculto");

    // Creamos un botón para cada respuesta

    preguntaActual.opciones.forEach(function (opcion, indice) {

        const boton = document.createElement("button");

        boton.textContent = opcion;

        boton.classList.add("boton-respuesta");

        // Comprobamos la respuesta cuando se hace clic

        boton.addEventListener("click", function () {
            responder(indice);
        });

        contenedorRespuestas.appendChild(boton);

    });

    // Iniciamos el temporizador

    segundos = TIEMPO;

    textoTiempo.textContent = "Tiempo: " + segundos + "s";

    textoTiempo.classList.remove("poco-tiempo");

    clearInterval(temporizador);

    temporizador = setInterval(pasarUnSegundo, 1000);
}

// Función para controlar el tiempo

function pasarUnSegundo() {

    segundos--;

    textoTiempo.textContent = "Tiempo: " + segundos + "s";

    // Cambiamos el color cuando quedan pocos segundos

    if (segundos <= 10) {
        textoTiempo.classList.add("poco-tiempo");
    }

    // Si el tiempo termina, restamos un punto

    if (segundos === 0) {

        clearInterval(temporizador);

        puntaje--;

        textoPuntaje.textContent = "Puntos: " + puntaje;

        const preguntaActual = preguntas[numeroPregunta];

        // Guardamos la pregunta sin respuesta

        resumen.push({
            pregunta: preguntaActual.pregunta,
            respuesta: "Sin respuesta",
            correcta: preguntaActual.opciones[preguntaActual.correcta],
            estado: "sin-respuesta"
        });

        // Pasamos a la siguiente pregunta

        siguientePregunta();
    }
}

// Función para comprobar las respuestas

function responder(indiceElegido) {

    clearInterval(temporizador);

    const preguntaActual = preguntas[numeroPregunta];

    const botones = contenedorRespuestas.children;

    const respuestaCorrecta = preguntaActual.correcta;

    // Comprobamos si la respuesta elegida es correcta

    if (indiceElegido === respuestaCorrecta) {

        puntaje++;

        botones[indiceElegido].classList.add("correcta");

        mensajeRespuesta.textContent = "¡Muy bien! Tu respuesta es correcta.";

        resumen.push({
            pregunta: preguntaActual.pregunta,
            respuesta: preguntaActual.opciones[indiceElegido],
            correcta: preguntaActual.opciones[respuestaCorrecta],
            estado: "correcta"
        });

    } else {

        botones[indiceElegido].classList.add("incorrecta");

        botones[respuestaCorrecta].classList.add("correcta");

        mensajeRespuesta.textContent = "Respuesta incorrecta. Revisa la respuesta correcta.";

        resumen.push({
            pregunta: preguntaActual.pregunta,
            respuesta: preguntaActual.opciones[indiceElegido],
            correcta: preguntaActual.opciones[respuestaCorrecta],
            estado: "incorrecta"
        });

    }

    // Desactivamos los botones para evitar otra respuesta

    for (let i = 0; i < botones.length; i++) {
        botones[i].disabled = true;
    }

    textoPuntaje.textContent = "Puntos: " + puntaje;

    // Mostramos el botón para continuar

    botonSiguiente.classList.remove("oculto");
}

// Función para pasar a la siguiente pregunta

function siguientePregunta() {

    numeroPregunta++;

    // Comprobamos si todavía quedan preguntas

    if (numeroPregunta < preguntas.length) {

        mostrarPregunta();

    } else {

        mostrarResultado();

    }
}

// Función para mostrar los resultados finales

function mostrarResultado() {

    clearInterval(temporizador);

    // Cambiamos a la pantalla de resultados

    pantallaQuiz.classList.add("oculto");

    pantallaResultado.classList.remove("oculto");

    // Mostramos el puntaje obtenido

    document.getElementById("puntaje-final").textContent = puntaje;

    document.getElementById("puntaje-maximo").textContent = "/ " + preguntas.length;

    // Mostramos un mensaje según el resultado

    if (puntaje === preguntas.length) {

        document.getElementById("mensaje-final").textContent =
            "¡Excelente! Respondiste todas las preguntas correctamente.";

    } else if (puntaje > 0) {

        document.getElementById("mensaje-final").textContent =
            "¡Buen trabajo! Sigue practicando para mejorar.";

    } else {

        document.getElementById("mensaje-final").textContent =
            "No te rindas. Puedes intentarlo nuevamente.";

    }

    // Limpiamos los resultados anteriores

    const listaResultados = document.getElementById("lista-resultados");

    listaResultados.innerHTML = "";

    // Mostramos el resumen de cada pregunta

    resumen.forEach(function (resultado, indice) {

        const tarjeta = document.createElement("div");

        tarjeta.classList.add("item-resultado", resultado.estado);

        const titulo = document.createElement("strong");

        titulo.textContent = (indice + 1) + ". " + resultado.pregunta;

        const respuesta = document.createElement("p");

        respuesta.textContent = "Tu respuesta: " + resultado.respuesta;

        const correcta = document.createElement("p");

        correcta.textContent = "Respuesta correcta: " + resultado.correcta;

        tarjeta.appendChild(titulo);

        tarjeta.appendChild(respuesta);

        tarjeta.appendChild(correcta);

        listaResultados.appendChild(tarjeta);

    });

}

// Mostramos la cantidad de preguntas en la pantalla inicial

document.getElementById("total-preguntas").textContent = preguntas.length;
