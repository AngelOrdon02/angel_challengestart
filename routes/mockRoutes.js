const express = require('express');
const router = express.Router();
const { configureMock, listMocks, deleteMock, deleteMockByPathAndMethod } = require('../controllers/mockController');

// Middleware personalizado para capturar eliminar por ID/path
const deleteMiddleware = (req, res, next) => {
  // Capturar todo lo que venga después de /configure-mock/
  const fullPath = req.originalUrl;
  const basePath = '/configure-mock/';
  const index = fullPath.indexOf(basePath);
  
  if (index !== -1) {
    const identifier = fullPath.substring(index + basePath.length);
    req.mockIdentifier = decodeURIComponent(identifier);
  }
  
  next();
};

// Endpoints
router.post('/configure-mock', configureMock);           // Registrar mocks
router.get('/configure-mock', listMocks);               // Ver configuraciones

// Usar middleware personalizado para eliminar con cualquier path
router.delete(/^\/configure-mock\/(.+)/, deleteMiddleware, deleteMock);
router.delete('/configure-mock', deleteMockByPathAndMethod); // Eliminar mock específico por path y método

module.exports = router;