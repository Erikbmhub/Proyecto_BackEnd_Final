
require('dotenv').config();
const port = process.env.PORT || 3000;

const app = require('./app');

app.listen(port, () => {
    console.log(`Puerto habilitado en: ${port}`)
});

// Meter logica de OAuth, valorar cantidad de lineas