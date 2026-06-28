const express = require('express');
const cors = require('cors');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const vinosRoutes = require('./routes/vinos');

const app = express();
const port = 3000;

mysql://root:BTFLZGckdUCjdCEIOvDiNNWoTYGulabs@reseau.proxy.rlwy.net:16982/railway

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));

app.use(session({
  secret: 'cookies prueba',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

app.get('/', (req, res) => {
  res.send('Servidor central funcionando correctamente');
});

app.use('/', authRoutes); 
app.use('/vinos', vinosRoutes); 
app.listen(port, () => {
  console.log(`Servidor modular corriendo en http://localhost:${port}`);
});