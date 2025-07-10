const express = require('express');
const bodyParser = require('body-parser');
const mockRoutes = require('./routes/mockRoutes');
const mockHandler = require('./middleware/mockHandler');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware para parseo de JSON
app.use(bodyParser.json());

// Rutas de gestión de mocks
app.use('/api', mockRoutes);

// Middleware para manejar solicitudes a mocks dinámicos
app.use(mockHandler);

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    message: `No se encontró un mock configurado para ${req.method} ${req.path}`,
    suggestion: 'Verifica que hayas configurado un mock para esta ruta usando POST /api/configure-mock'
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Arrancar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Mock API corriendo en http://localhost:${PORT}`);
});