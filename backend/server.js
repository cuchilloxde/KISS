
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


