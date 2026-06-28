require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const vinosRoutes = require('./routes/vinos');

const app = express();

// PASO 3: Configurar el puerto dinámico para Railway
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  // Nota: Cuando despliegues tu frontend en la nube, deberás cambiar este 'http://localhost:5173' por la URL real de tu frontend
  origin: 'http://localhost:5173',
  credentials: true 
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'cookies prueba', // Usará la variable en producción
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Nota: Déjalo en false si tu frontend sigue en localhost sin HTTPS
}));

app.get('/', (req, res) => {
  res.send('Servidor central funcionando correctamente');
});

app.use('/', authRoutes); 
app.use('/vinos', vinosRoutes); 

// Iniciar el servidor usando el puerto dinámico
app.listen(port, () => {
  console.log(`Servidor modular corriendo exitosamente en el puerto ${port}`);
});