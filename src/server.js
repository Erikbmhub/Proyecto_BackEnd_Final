require('dotenv').config();

const app = require('./app');
const mongoose = require('./config/db.mongo');

const port = process.env.PORT || 3000;

// Iniciamos el servidor cuando MongoDB esté conectado.
mongoose.connection.once('open', () => {
    console.log('MongoDB conectado correctamente');

    app.listen(port, () => {
        console.log(`Puerto habilitado en: ${port}`);
    });
});