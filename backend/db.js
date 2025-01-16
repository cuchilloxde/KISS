//Libreria MySQL
const mysql = require('mysql2'); //Esto es lo que permite la ejecución de SELECT, INSERT, etc.

//CONFIGURAMOS LA CONEXION
const db = mysql.createConnection({
    host: 'localhost', //server donde esta la bd, para la bdlocales
    user: 'root',       
    password: '197749172Ka',
    database: 'Local_instance_MySQL91' 
});

//Para probar la conexión
db.connect((err) => {
    if (err) {
        console.error('Error conectándose a la base de datos:', err);
        return;
    }
    console.log('¡Conexión a la base de datos exitosa!');
});

//exportamos la conexión

module.exports = db;
