const Joi = require('joi');

// Esquema para validar la configuración de un mock
const mockConfigSchema = Joi.object({
  path: Joi.string()
    .required()
    .pattern(/^\/.*/)
    .messages({
      'string.pattern.base': 'El path debe comenzar con "/"',
      'any.required': 'El path es requerido'
    }),
  
  method: Joi.string()
    .valid('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS')
    .required()
    .messages({
      'any.only': 'El método debe ser uno de: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS',
      'any.required': 'El método HTTP es requerido'
    }),
  
  params: Joi.object()
    .optional()
    .allow(null),
  
  headers: Joi.object()
    .optional()
    .allow(null),
  
  body: Joi.alternatives()
    .try(
      Joi.object(),
      Joi.array(),
      Joi.string(),
      Joi.number(),
      Joi.boolean()
    )
    .optional()
    .allow(null),
  
  statusCode: Joi.number()
    .integer()
    .min(100)
    .max(599)
    .required()
    .messages({
      'number.min': 'El código de estado debe ser mayor o igual a 100',
      'number.max': 'El código de estado debe ser menor o igual a 599',
      'any.required': 'El código de estado es requerido'
    }),
  
  response: Joi.alternatives()
    .try(
      Joi.object(),
      Joi.array(),
      Joi.string(),
      Joi.number(),
      Joi.boolean()
    )
    .required()
    .messages({
      'any.required': 'La respuesta es requerida'
    }),
  
  contentType: Joi.string()
    .optional()
    .default('application/json')
    .valid(
      'application/json',
      'application/xml',
      'text/xml',
      'text/plain',
      'text/html',
      'application/x-www-form-urlencoded'
    )
    .messages({
      'any.only': 'El Content-Type debe ser uno de los tipos soportados'
    })
});

// Esquema para validar el ID de un mock (UUID)
const mockIdSchema = Joi.string()
  .guid({ version: 'uuidv4' })
  .required()
  .messages({
    'string.guid': 'El ID debe ser un UUID válido',
    'any.required': 'El ID es requerido'
  });

// Esquema para validar el identificador de eliminación (UUID, ID numérico o path)
const mockIdentifierSchema = Joi.alternatives()
  .try(
    // UUID válido
    Joi.string().guid({ version: 'uuidv4' }),
    // ID numérico (convertido a string en la URL)
    Joi.string().pattern(/^\d+$/).messages({
      'string.pattern.base': 'El ID numérico debe contener solo dígitos'
    }),
    // Path válido (debe empezar con /)
    Joi.string().pattern(/^\/.*/).messages({
      'string.pattern.base': 'El path debe comenzar con "/"'
    })
  )
  .required()
  .messages({
    'alternatives.match': 'El identificador debe ser un UUID válido, un ID numérico, o un path válido',
    'any.required': 'El identificador es requerido'
  });

module.exports = {
  mockConfigSchema,
  mockIdSchema,
  mockIdentifierSchema
};
