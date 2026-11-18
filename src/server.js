require('dotenv').config();
const port = process.env.PORT || 3000;
const app = require('./app.js');

app.listener(port, () => {
    console.log(`Puerta habilitado en: ${port}`)
});

// Meter logica de OAuth, valorar cantidad de lineas