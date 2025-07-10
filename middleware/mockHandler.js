// Importar las configuraciones desde el controlador
const { getMockConfigurations } = require('../controllers/mockController');

// Función para comparar headers
const matchHeaders = (requiredHeaders, requestHeaders) => {
  if (!requiredHeaders) return true; // Si no se requieren headers específicos, coincide
  
  for (const [key, value] of Object.entries(requiredHeaders)) {
    // Express convierte todos los headers a lowercase
    const requestValue = requestHeaders[key.toLowerCase()];
    if (requestValue !== value) {
      return false;
    }
  }
  return true;
};

// Función para comparar parámetros de query
const matchParams = (requiredParams, requestQuery) => {
  if (!requiredParams) return true; // Si no se requieren parámetros, coincide
  
  for (const [key, value] of Object.entries(requiredParams)) {
    if (requestQuery[key] !== value) {
      return false;
    }
  }
  return true;
};

// Función para comparar body
const matchBody = (requiredBody, requestBody) => {
  if (!requiredBody) return true; // Si no se requiere body específico, coincide
  
  return JSON.stringify(requiredBody) === JSON.stringify(requestBody);
};

const mockHandler = (req, res, next) => {
  const { method, path, query, headers, body } = req;

  // Buscar una configuración que coincida
  const mockConfigurations = getMockConfigurations();
  const mock = mockConfigurations.find(mock => {
    return (
      mock.method === method &&
      mock.path === path &&
      matchParams(mock.params, query) &&
      matchHeaders(mock.headers, headers) &&
      matchBody(mock.body, body)
    );
  });

  if (mock) {
    // Macheo encontrado -> retornar configuración personalizada
    res.setHeader('Content-Type', mock.contentType);
    return res.status(mock.statusCode).send(mock.response);
  }

  // No coincide con ninguna configuración -> continuar al siguiente middleware
  next();
};

module.exports = mockHandler;