const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Importamos la conexión a la BD

const saltRounds = 10;

// Registrar nuevo usuario
router.post('/register', async (req, res) => {
  const { usuario, clave, nombre, correo } = req.body;

  if (!usuario || !clave || !nombre || !correo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const hashClave = await bcrypt.hash(clave, saltRounds);
    await pool.query(
      "INSERT INTO `usuarios` (`usuario`, `clave`, `nombre`, `correo`) VALUES (?, ?, ?, ?)",
      [usuario, hashClave, nombre, correo]
    );
    return res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El nombre de usuario o correo ya existe' });
    }
    return res.status(500).json({ error: 'Error interno del servidor al registrar' });
  }
});

// Inicio de Sesión
router.post('/login', async (req, res) => {
  const { usuario, clave } = req.body; 

  try {
    const [results] = await pool.query("SELECT * FROM `usuarios` WHERE `usuario` = ?", [usuario]);

    if (results.length > 0) { 
      const usuarioBD = results[0];
      const coincide = await bcrypt.compare(clave, usuarioBD.clave);

      if (coincide) {
        req.session.usuario = usuario;
        return res.status(200).json({ mensaje: 'Inicio de sesión correcto' });
      } else {
        return res.status(401).json({ error: 'Datos incorrectos' });
      }
    } else {
      return res.status(401).json({ error: 'Datos incorrectos' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Validar sesión
router.get('/validar', (req, res) => {
  if (req.session.usuario) {
    return res.status(200).json({ mensaje: 'Sesión activa', usuario: req.session.usuario });
  } else {
    return res.status(401).json({ error: 'No autorizado' });
  }
});

// Cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo cerrar la sesión' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ mensaje: 'Sesión cerrada correctamente' });
  });
});

module.exports = router; // Exportamos el router