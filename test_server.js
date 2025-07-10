// Test simple para verificar que el servidor arranca sin errores
console.log('Iniciando test del servidor...');

try {
  // Importar las dependencias principales
  const express = require('express');
  const mockRoutes = require('./routes/mockRoutes');
  const mockHandler = require('./middleware/mockHandler');
  const errorHandler = require('./middleware/errorHandler');
  
  console.log('✓ Todas las dependencias se cargaron correctamente');
  
  // Intentar crear la app de Express
  const app = express();
  app.use(express.json());
  app.use('/api', mockRoutes);
  app.use(mockHandler);
  app.use(errorHandler);
  
  console.log('✓ App de Express configurada correctamente');
  
  // Intentar arrancar el servidor
  const server = app.listen(3001, () => {
    console.log('✓ Servidor arrancó correctamente en puerto 3001');
    console.log('✓ Todas las pruebas pasaron - el servidor está listo');
    server.close();
    process.exit(0);
  });
  
  server.on('error', (err) => {
    console.error('✗ Error al arrancar servidor:', err.message);
    process.exit(1);
  });
  
} catch (error) {
  console.error('✗ Error al configurar el servidor:', error.message);
  console.error('Detalles:', error.stack);
  process.exit(1);
}
