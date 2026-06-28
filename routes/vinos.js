const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Importamos la conexión a la BD

// 1. Obtener todos los vinos
router.get('/', async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM `vinos`");
    return res.status(200).json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener los vinos' });
  }
});

// 2. Agregar un nuevo vino
router.post('/', async (req, res) => {
  const { nombre, tipo, precio } = req.body;
  if (!nombre || !tipo || !precio) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO `vinos` (`nombre`, `tipo`, `precio`) VALUES (?, ?, ?)",
      [nombre, tipo, precio]
    );
    return res.status(201).json({ id: result.insertId, nombre, tipo, precio });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al guardar el vino' });
  }
});

// 3. Actualizar un vino existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, precio } = req.body;
  try {
    await pool.query(
      "UPDATE `vinos` SET `nombre` = ?, `tipo` = ?, `precio` = ? WHERE `id` = ?",
      [nombre, tipo, precio, id]
    );
    return res.status(200).json({ mensaje: 'Vino actualizado correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al actualizar el vino' });
  }
});

// 4. Eliminar un vino
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM `vinos` WHERE `id` = ?", [id]);
    return res.status(200).json({ mensaje: 'Vino eliminado correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al eliminar el vino' });
  }
});

module.exports = router; // Exportamos el router