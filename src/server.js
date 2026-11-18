
require('dotenv').config();
const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Puerta habilitado en: ${port}`)
});

// Meter logica de OAuth, valorar cantidad de lineas