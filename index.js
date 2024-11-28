const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

// Servidor en el puerto definido
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
