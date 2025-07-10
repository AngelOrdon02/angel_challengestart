const { v4: uuidv4 } = require('uuid');
const { mockConfigSchema, mockIdentifierSchema } = require('../utils/validation');

// Guardar configuraciones de mocks en memoria
let mockConfigurations = [];
let nextNumericId = 1; // Contador para IDs numéricos secuenciales

// Registrar nueva configuración
exports.configureMock = (req, res) => {
  // Validar los datos de entrada
  const { error, value } = mockConfigSchema.validate(req.body, { 
    abortEarly: false,
    allowUnknown: false 
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: errorMessages
    });
  }

  const { path, method, params, headers, body, statusCode, response, contentType } = value;

  // Verificar si ya existe un mock con el mismo path y método
  const existingMock = mockConfigurations.find(mock => 
    mock.path === path && mock.method === method.toUpperCase()
  );

  if (existingMock) {
    return res.status(409).json({
      error: 'Mock ya existe',
      message: `Ya existe un mock configurado para ${method.toUpperCase()} ${path}`,
      existingMock: {
        id: existingMock.id,
        numericId: existingMock.numericId
      }
    });
  }

  const newMock = {
    id: uuidv4(),
    numericId: nextNumericId++,
    path,
    method: method.toUpperCase(),
    params,
    headers,
    body,
    statusCode,
    response,
    contentType: contentType || 'application/json',
  };

  mockConfigurations.push(newMock);
  return res.status(201).json({ message: 'Mock configurado correctamente', mock: newMock });
};

// Listar configuraciones
exports.listMocks = (req, res) => {
  res.json({ mocks: mockConfigurations });
};

// Eliminar configuración
exports.deleteMock = (req, res) => {
  // Obtener el identificador de la URL
  let identifier = req.mockIdentifier;
  
  // Si el identificador empieza con '/', es un path completo
  if (identifier && !identifier.startsWith('/')) {
    // Si no empieza con /, podría ser un ID numérico o UUID
    // No necesitamos agregar nada
  }
  
  // Validar el identificador del mock
  const { error, value } = mockIdentifierSchema.validate(identifier);
  
  if (error) {
    return res.status(400).json({
      error: 'Identificador inválido',
      message: 'El identificador debe ser un UUID válido, un ID numérico, o un path válido (ej: /api/productos)',
      details: error.details.map(detail => detail.message)
    });
  }

  const validIdentifier = value;
  const initialLength = mockConfigurations.length;
  let deletedMock = null;

  // Determinar el tipo de identificador y buscar el mock correspondiente
  if (validIdentifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
    // Es un UUID
    deletedMock = mockConfigurations.find(mock => mock.id === validIdentifier);
    mockConfigurations = mockConfigurations.filter(mock => mock.id !== validIdentifier);
  } else if (validIdentifier.match(/^\d+$/)) {
    // Es un ID numérico
    const numericId = parseInt(validIdentifier);
    deletedMock = mockConfigurations.find(mock => mock.numericId === numericId);
    mockConfigurations = mockConfigurations.filter(mock => mock.numericId !== numericId);
  } else if (validIdentifier.startsWith('/')) {
    // Es un path - eliminamos el primero que coincida
    deletedMock = mockConfigurations.find(mock => mock.path === validIdentifier);
    mockConfigurations = mockConfigurations.filter(mock => mock.path !== validIdentifier);
  }
  
  if (mockConfigurations.length === initialLength || !deletedMock) {
    return res.status(404).json({
      error: 'Mock no encontrado',
      message: `No se encontró un mock con el identificador: ${validIdentifier}`,
      suggestion: 'Usa GET /api/configure-mock para ver todos los mocks disponibles'
    });
  }
  
  res.json({ 
    message: `Mock eliminado correctamente`,
    deletedMock: {
      id: deletedMock.id,
      numericId: deletedMock.numericId,
      path: deletedMock.path,
      method: deletedMock.method
    }
  });
};

// Función para obtener las configuraciones (para el middleware)
exports.getMockConfigurations = () => {
  return mockConfigurations;
};

// Eliminar mock específico por path y método
exports.deleteMockByPathAndMethod = (req, res) => {
  const { path, method } = req.body;

  if (!path || !method) {
    return res.status(400).json({
      error: 'Datos faltantes',
      message: 'Se requieren los campos "path" y "method"'
    });
  }

  const initialLength = mockConfigurations.length;
  const deletedMock = mockConfigurations.find(mock => 
    mock.path === path && mock.method === method.toUpperCase()
  );

  if (!deletedMock) {
    return res.status(404).json({
      error: 'Mock no encontrado',
      message: `No se encontró un mock para ${method.toUpperCase()} ${path}`
    });
  }

  mockConfigurations = mockConfigurations.filter(mock => 
    !(mock.path === path && mock.method === method.toUpperCase())
  );

  res.json({ 
    message: `Mock eliminado correctamente`,
    deletedMock: {
      id: deletedMock.id,
      numericId: deletedMock.numericId,
      path: deletedMock.path,
      method: deletedMock.method
    }
  });
};