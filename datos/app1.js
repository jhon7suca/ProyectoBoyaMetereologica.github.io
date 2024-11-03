const channelId = '2688654'; // Reemplaza con tu ID de canal de ThingSpeak
const readApiKey = 'DYU0KXMXCWWKE0LM'; // Reemplaza con tu Read API Key

// Función para obtener los datos de ThingSpeak
function fetchData() {
    const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${encodeURIComponent(readApiKey)}&results=5`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const last5Boyas = data.feeds.slice(-5).reverse(); // Últimos 5 registros para las tablas

            // Limpiar las tablas antes de agregar nuevos datos
            limpiarTabla('data-table-boya1');
            limpiarTabla('data-table-boya2');

            // Llenar las tablas con los últimos 5 registros
            last5Boyas.forEach(boya => {
                llenarTablaBoya1(boya);
                llenarTablaBoya2(boya);
            });

            // Actualizar los valores actuales para Boya 1 y Boya 2
            if (last5Boyas.length > 0) {
                const boya1 = last5Boyas[0];
                document.getElementById('temperatura-valor1').innerText = boya1.field1 + ' °C';
                document.getElementById('presion-valor1').innerText = boya1.field2 + ' hPa';
                document.getElementById('altitud-valor1').innerText = boya1.field3 + ' m';
                document.getElementById('humedad-valor1').innerText = boya1.field4 + ' %';
            }

            if (last5Boyas.length > 1) {
                const boya2 = last5Boyas[1];
                document.getElementById('temperatura-valor2').innerText = boya2.field5 + ' °C';
                document.getElementById('presion-valor2').innerText = boya2.field6 + ' hPa';
                document.getElementById('altitud-valor2').innerText = boya2.field7 + ' m';
                document.getElementById('humedad-valor2').innerText = boya2.field8 + ' %';
            }

            // Actualizar colores de pelotitas para Boya 1
            if (last5Boyas.length > 0) {
                const boya1 = last5Boyas[0];
                document.querySelector('.temperatura1').style.backgroundColor = actualizarColorCirculo(boya1.field1, 'temperatura');
                document.querySelector('.presion1').style.backgroundColor = actualizarColorCirculo(boya1.field2, 'presion');
                document.querySelector('.altitud1').style.backgroundColor = actualizarColorCirculo(boya1.field3, 'altitud');
                document.querySelector('.humedad1').style.backgroundColor = actualizarColorCirculo(boya1.field4, 'humedad');
            }

            // Actualizar colores de pelotitas para Boya 2
            if (last5Boyas.length > 1) {
                const boya2 = last5Boyas[1];
                document.querySelector('.temperatura2').style.backgroundColor = actualizarColorCirculo(boya2.field5, 'temperatura');
                document.querySelector('.presion2').style.backgroundColor = actualizarColorCirculo(boya2.field6, 'presion');
                document.querySelector('.altitud2').style.backgroundColor = actualizarColorCirculo(boya2.field7, 'altitud');
                document.querySelector('.humedad2').style.backgroundColor = actualizarColorCirculo(boya2.field8, 'humedad');
            }
        })
        .catch(error => console.error('Error al obtener datos:', error));
}

// Función para llenar la tabla de Boya 1
function llenarTablaBoya1(boya) {
    const table = document.getElementById('data-table-boya1');
    if (table) { // Verificación de existencia
        const row = table.insertRow();
        row.insertCell(0).innerText = boya.field1 + ' °C';
        row.insertCell(1).innerText = boya.field2 + ' hPa';
        row.insertCell(2).innerText = boya.field3 + ' m';
        row.insertCell(3).innerText = boya.field4 + ' %';
        row.insertCell(4).innerText = new Date(boya.created_at).toLocaleString();
    }
}

// Función para llenar la tabla de Boya 2
function llenarTablaBoya2(boya) {
    const table = document.getElementById('data-table-boya2');
    if (table) { // Verificación de existencia
        const row = table.insertRow();
        row.insertCell(0).innerText = boya.field5 + ' °C';
        row.insertCell(1).innerText = boya.field6 + ' hPa';
        row.insertCell(2).innerText = boya.field7 + ' m';
        row.insertCell(3).innerText = boya.field8 + ' %';
        row.insertCell(4).innerText = new Date(boya.created_at).toLocaleString();
    }
}

// Función para limpiar la tabla antes de actualizar
function limpiarTabla(tableId) {
    const table = document.getElementById(tableId);
    if (table) { // Verificación de existencia
        while (table.rows.length > 0) {
            table.deleteRow(0);
        }
    }
}

// Función para actualizar el color según los rangos
function actualizarColorCirculo(valor, tipo) {
    valor = parseFloat(valor);
    if (tipo === 'temperatura') {
        if (valor >= 10 && valor <= 25) return 'green';
        if ((valor >= 5 && valor < 10) || (valor > 25 && valor <= 30)) return 'yellow';
        return 'red';
    }
    if (tipo === 'presion') {
        if (valor >= 950 && valor <= 1050) return 'green';
        if ((valor >= 900 && valor < 950) || (valor > 1050 && valor <= 1100)) return 'yellow';
        return 'red';
    }
    if (tipo === 'altitud') {
        if (valor >= 0 && valor <= 3000) return 'green';
        if (valor > 3000 && valor <= 4000) return 'yellow';
        return 'red';
    }
    if (tipo === 'humedad') {
        if (valor >= 30 && valor <= 70) return 'green';
        if ((valor >= 20 && valor < 30) || (valor > 70 && valor <= 80)) return 'yellow';
        return 'red';
    }
}

// Llamar a fetchData cada 10 segundos
setInterval(fetchData, 10000);
