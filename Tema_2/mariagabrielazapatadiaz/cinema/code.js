// Definir el tamaño de la matriz de butacas
const N = 10; // Número de filas y columnas

// Función para inicializar la matriz de butacas
function setup() {
    let idContador = 1; // Iniciar el contador los ID en 1 (los humanos no empezamos a contar desde 0)
    let butacas = [];

    for (let i = 0; i < N; i++) {
        // Nueva fila
        let fila = [];
        for (let j = 0; j < N; j++) {
            // Nuevo asiento
            fila.push({
                id: idContador++,
                estado: false // Estado inicial libre
            });
        }
        butacas.push(fila);
    }
    return butacas;
}

// Inicializar la matriz
let butacas = setup();

//Función para revisar butacas libres
function suggest(numSeats) {
    if (!(numSeats > 0 && numSeats <= N)) return new Set();
    let libres = new Set(), encontrado = false;
    for (let row = N - 1; row >= 0 && !encontrado; row--) {
        let cont = 0, inicio = 0;
        for (let col = 0; col < N && !encontrado; col++) {
            if (!butacas[row][col].estado) {
                if (++cont === 1) inicio = col;
                if (cont === numSeats) {
                    for (let c = inicio; c < inicio + numSeats; c++) libres.add(butacas[row][c].id);
                    encontrado = true;
                }
            } else cont = 0;
        }
    }
    if (!encontrado) return new Set();
    libres.forEach(id => (butacas.flat().find(a => a.id === id)).estado = true);
    return libres;
}

//Funciones para el HTML
// Imprimir la tabla
function doTable() {
    let idContador = 1;
    let letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
    let html = '<table><tr>';
    //Encabezado
    for (let num = 0; num < N + 1; num++) {
        if (num === 0)
            html += "<th></th>";
        else
            html += `<th>${num}</th>`;
    }
    html += "</tr>";
    //Filas
    for (let i = 0; i < N; i++) {
        html += "<tr>";
        //Columnas 
        html += `<td class="row">${letras[i]}</td>`;
        for (let j = 0; j < N; j++) {
            html += `<td><div id="${idContador}" class="free">${idContador}</div></td>`;
            idContador++;
        }
        html += "</tr>";
    }
    html += "</table>";
    document.getElementById("tabla").innerHTML = html;
}

function changeClass(idSeat) {
    document.getElementById(idSeat).className = "occupied";
}

function writeMessage(message) {
    document.getElementById("mensaje").innerHTML = message;
}

function suggestH() {
    let numSeats = document.getElementById('nro_asientos').value
    numSeats = Number.parseInt(numSeats) || 0;
    let libres = suggest(numSeats);
    writeMessage('');
    if (libres.size === numSeats) {
        for (const id of libres) {
            changeClass(id);
        }
        writeMessage([...libres]);
    }
    else {
        writeMessage('No se logró el objetivo');
    }
}