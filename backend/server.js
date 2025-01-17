//importando conexión bd
const db = require('./db'); // Esto importa la conexión a la base de datos


const express = require('express'); // Framework para crear servidor web. Facilita gestión de respuestas.
const cors = require('cors'); //Permite la comunicación entre frontend y backend.

// Configuramos Express:
const app = express(); //Instacia del servidor
app.use(cors());        //Activa cors permitiendo peticiones
app.use(express.json()); //Entender datos formato js

const PORT = 3000; 

//Ruta
app.get('/', (req, res) => {
    res.send('El servidor funciona con exito!!');
}); 

//Inicio del server:
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Nueva ruta:
// Esta ruta es para consultar datos y obtener las tablas. Necesario para el ususario pueda saber que informacion usar

app.get('/api/tablas', (req, res) => {
    const query = `
        SELECT TABLE_NAME AS tabla, COLUMN_NAME AS campo
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = 'KISS';`; // Esta linea de cod cambia KISS por el nombre de tu bds si esta es diferente

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener tablas:', err);
            res.status(500).json({ error: 'Error al obtener tablas' });
        } else {
            res.json(results); // Envia las tablas y campos al frontend
        }
    });
});

// Endpoint: Punto final, es la ubicación de los recursos que una app solicita a otra.
// Si no hay endpoint , el sistema no puede devolver respuesta.
// Ruta para poder obtener los datos de una tabla en específico
app.post('/api/tabla-datos', (req, res) => {
    const { tabla, campos, filtros } = req.body;

    // Esto es para validar si se dieron los datos necesarios
    if (!tabla || !campos || campos.length === 0) { //la tabla de donde se sacan los datos. 
        return res.status(400).json({ error: 'Debe proporcionar una tabla y al menos un campo.' });
    }

    // Para construir una consulta 
    let query = `SELECT ${campos.join(', ')} FROM ${tabla}`;
    const condiciones = [];

    // es para los filtros, para filtrar los datos
    if (filtros && Object.keys(filtros).length > 0) { //FILTROS a aplicar
        for (const campo in filtros) { // Campo: Array con nombre de los campos a visualizar.
            condiciones.push(`${campo} = '${filtros[campo]}'`);
        }
        query += ` WHERE ${condiciones.join(' AND ')}`;
    }

    // Este ejecuta la consulta
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener datos:', err);
            res.status(500).json({ error: 'Error al obtener datos.' });
        } else {
            res.json(results);
        }
    });
});

// FILTROS: Para que obtenga los posibles valores de cada filtro
// Permitirá filtrar dinámicamenmte los datos segun los campos seleccionados.

// ruta para poder obtener los valores
app.get('/api/valores-filtro', (req, res) => {
    const { tabla, campo } = req.query; //en esta linea hace que se obtenga los parametros
    console.log(`Tabla: ${tabla}, Campo: ${campo}`); 

    // valida si se dieron los parámetros necesarios
    if (!tabla || !campo) {
        return res.status(400).json({ error: 'Debe proporcionar la tabla y el campo.' });
    }

    // Consulta para obtener los valores q son unicos de un campo
    const query = `SELECT DISTINCT ${campo} FROM ${tabla}`;

    // ejecuta la consulta
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener valores de filtro:', err);
            res.status(500).json({ error: 'Error al obtener valores de filtro.' });
        } else {
            res.json(results); //envia al frontend
        }
    });
});


// Ruta para obtener los datos filtrados
app.get('/api/datos', (req, res) => {
    const filtro = req.query.filtro || ''; // Obtiene el filtro de la consulta (si existe)

    const query = `SELECT * FROM Trabajador WHERE Cargo LIKE '%${filtro}%'`; // Filtra los datos por el campo Cargo

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los datos:', err);
            res.status(500).json({ error: 'Error al obtener los datos' });
        } else {
            res.json(results); // Devuelve los datos filtrados al frontend
        }
    });
});


