// Middleware para manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación de Joi
  if (err.isJoi) {
    const errorMessages = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: errorMessages
    });
  }

  // Error de JSON malformado
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'JSON malformado',
      message: 'El cuerpo de la solicitud contiene JSON inválido'
    });
  }

  // Error interno del servidor
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ha ocurrido un error inesperado'
  });
};

module.exports = errorHandler;
