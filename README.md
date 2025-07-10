# angel_challengestart
Challenge Start | API para Mocks de Servicios REST | Angel Geovanny Ordón Colchaj

## Descripción

API para gestionar mocks de servicios REST que permite configurar endpoints dinámicos, definir respuestas personalizadas y simular comportamientos de servicios externos.

## Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/AngelOrdon02/angel_challengestart.git

# Navegar al directorio del proyecto
cd angel_challengestart

# Instalar dependencias
npm install
```

### Ejecución
```bash
# Iniciar el servidor
npm start

# O ejecutar directamente con Node.js
node app.js
```

La API estará disponible en: `http://localhost:3000`

## Endpoints Disponibles

### 1. Configurar Mock
**POST** `/api/configure-mock`

Registra una nueva configuración de mock.

#### Ejemplo de solicitud:
```bash
curl -X POST http://localhost:3000/api/configure-mock ^
  -H "Content-Type: application/json" ^
  -d "{\"path\":\"/api/v1/productos\",\"method\":\"GET\",\"statusCode\":200,\"response\":{\"productos\":[{\"id\":1,\"nombre\":\"Producto 1\"},{\"id\":2,\"nombre\":\"Producto 2\"}]},\"contentType\":\"application/json\"}"
```

#### Parámetros del body:
- `path`: Ruta del endpoint (ej. `/api/v1/productos`)
- `method`: Método HTTP (`GET`, `POST`, `PUT`, `DELETE`)
- `params`: Parámetros de URL (opcional)
- `headers`: Headers requeridos (opcional)
- `body`: Body esperado (opcional)
- `statusCode`: Código de respuesta HTTP
- `response`: Contenido de la respuesta
- `contentType`: Tipo de contenido (por defecto: `application/json`)

#### Respuesta exitosa:
```json
{
  "message": "Mock configurado correctamente",
  "mock": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "numericId": 1,
    "path": "/api/v1/productos",
    "method": "GET",
    "statusCode": 200,
    "response": {
      "productos": [
        {"id": 1, "nombre": "Producto 1"},
        {"id": 2, "nombre": "Producto 2"}
      ]
    },
    "contentType": "application/json"
  }
}
```

#### Respuesta de error (mock duplicado):
```json
{
  "error": "Mock ya existe",
  "message": "Ya existe un mock configurado para GET /api/v1/productos",
  "existingMock": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "numericId": 1
  }
}
```

### 2. Listar Mocks Configurados
**GET** `/api/configure-mock`

Obtiene todas las configuraciones de mocks registradas.

#### Ejemplo de solicitud:
```bash
curl -X GET http://localhost:3000/api/configure-mock
```

#### Respuesta:
```json
{
  "mocks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "numericId": 1,
      "path": "/api/v1/productos",
      "method": "GET",
      "statusCode": 200,
      "response": {"productos": [...]},
      "contentType": "application/json"
    }
  ]
}
```

### 3. Eliminar Mock
**DELETE** `/api/configure-mock/:identifier`

Elimina una configuración de mock específica. El identificador puede ser:
- **UUID**: ID único generado automáticamente
- **ID Numérico**: ID secuencial (1, 2, 3...)
- **Path**: Ruta del endpoint (elimina el primer mock que coincida)

#### Ejemplos de solicitud:

**Por UUID:**
```bash
curl -X DELETE http://localhost:3000/api/configure-mock/550e8400-e29b-41d4-a716-446655440000
```

**Por ID numérico:**
```bash
curl -X DELETE http://localhost:3000/api/configure-mock/1
```

**Por path:**
```bash
curl -X DELETE http://localhost:3000/api/configure-mock/api/v1/productos
```

#### Respuesta exitosa:
```json
{
  "message": "Mock eliminado correctamente",
  "deletedMock": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "numericId": 1,
    "path": "/api/v1/productos",
    "method": "GET"
  }
}
```

#### Respuesta de error:
```json
{
  "error": "Mock no encontrado",
  "message": "No se encontró un mock con el identificador: /api/v1/inexistente",
  "suggestion": "Usa GET /api/configure-mock para ver todos los mocks disponibles"
}
```

### 4. Eliminar Mock Específico
**DELETE** `/api/configure-mock`

Elimina un mock específico por path y método exactos (útil cuando hay múltiples mocks para el mismo path con diferentes métodos).

#### Ejemplo de solicitud:
```bash
curl -X DELETE http://localhost:3000/api/configure-mock ^
  -H "Content-Type: application/json" ^
  -d "{\"path\":\"/api/v1/productos\",\"method\":\"GET\"}"
```

#### Respuesta:
```json
{
  "message": "Mock eliminado correctamente",
  "deletedMock": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "numericId": 1,
    "path": "/api/v1/productos",
    "method": "GET"
  }
}
```

### 5. Ejecutar Mock
**ANY** `/{ruta-configurada}`

Ejecuta el mock configurado para la ruta y método especificados.

#### Ejemplo de solicitud:
```bash
# Ejecutar el mock configurado para GET /api/v1/productos
curl -X GET http://localhost:3000/api/v1/productos
```

#### Respuesta (según configuración):
```json
{
  "productos": [
    {"id": 1, "nombre": "Producto 1"},
    {"id": 2, "nombre": "Producto 2"}
  ]
}
```

## Ejemplos Avanzados

### Mock con Headers Específicos
```bash
curl -X POST http://localhost:3000/api/configure-mock ^
  -H "Content-Type: application/json" ^
  -d "{\"path\":\"/api/v1/usuarios\",\"method\":\"GET\",\"headers\":{\"Authorization\":\"Bearer token123\"},\"statusCode\":200,\"response\":{\"usuarios\":[{\"id\":1,\"nombre\":\"Juan\"}]}}"
```

### Mock con Parámetros de URL
```bash
curl -X POST http://localhost:3000/api/configure-mock ^
  -H "Content-Type: application/json" ^
  -d "{\"path\":\"/api/v1/buscar\",\"method\":\"GET\",\"params\":{\"categoria\":\"electronicos\"},\"statusCode\":200,\"response\":{\"resultados\":[]}}"
```

### Mock POST con Body
```bash
curl -X POST http://localhost:3000/api/configure-mock ^
  -H "Content-Type: application/json" ^
  -d "{\"path\":\"/api/v1/crear-usuario\",\"method\":\"POST\",\"body\":{\"nombre\":\"Juan\",\"email\":\"juan@email.com\"},\"statusCode\":201,\"response\":{\"id\":123,\"mensaje\":\"Usuario creado\"}}"
```

### Mock con Respuesta de Error
```bash
curl -X POST http://localhost:3000/api/configure-mock ^
  -H "Content-Type: application/json" ^
  -d "{\"path\":\"/api/v1/error\",\"method\":\"GET\",\"statusCode\":500,\"response\":{\"error\":\"Error interno del servidor\"}}"
```

### Mock con Respuesta XML
```bash
curl -X POST http://localhost:3000/api/configure-mock ^
  -H "Content-Type: application/json" ^
  -d "{\"path\":\"/api/v1/xml-data\",\"method\":\"GET\",\"statusCode\":200,\"response\":\"<?xml version='1.0'?><data><item>value</item></data>\",\"contentType\":\"application/xml\"}"
```

## Probar los Mocks Configurados

Una vez configurados los mocks, puedes probarlos directamente:

```bash
# Probar mock de productos
curl -X GET http://localhost:3000/api/v1/productos

# Probar mock con headers
curl -X GET http://localhost:3000/api/v1/usuarios ^
  -H "Authorization: Bearer token123"

# Probar mock con parámetros
curl -X GET "http://localhost:3000/api/v1/buscar?categoria=electronicos"

# Probar mock POST
curl -X POST http://localhost:3000/api/v1/crear-usuario ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Juan\",\"email\":\"juan@email.com\"}"
```

## Arquitectura

### Estructura del Proyecto
```
├── app.js                 # Archivo principal de la aplicación
├── controllers/
│   └── mockController.js  # Lógica de gestión de mocks
├── middleware/
│   ├── errorHandler.js    # Middleware de manejo de errores
│   └── mockHandler.js     # Middleware para ejecutar mocks
├── routes/
│   └── mockRoutes.js      # Definición de rutas de gestión
├── utils/
│   └── validation.js      # Esquemas de validación con Joi
├── package.json           # Configuración del proyecto
└── README.md             # Documentación
```

### Dependencias
- **express**: Framework web para Node.js
- **body-parser**: Middleware para parsear JSON
- **uuid**: Generación de identificadores únicos
- **joi**: Validación de esquemas de datos

## Decisiones de Diseño

1. **Almacenamiento en memoria**: Las configuraciones se guardan en memoria para simplicidad
2. **Middleware genérico**: Un middleware maneja todas las rutas dinámicas
3. **Coincidencia exacta**: Los parámetros deben coincidir exactamente para ejecutar el mock
4. **Respuesta 404**: Si no hay coincidencia, se retorna 404 Not Found
5. **Validación robusta**: Se usa Joi para validar todos los datos de entrada
6. **Manejo de errores**: Middleware especializado para manejo centralizado de errores
7. **IDs múltiples**: Cada mock tiene UUID (único) e ID numérico (secuencial) para facilidad de uso
8. **Unicidad por path+método**: No se permiten duplicados del mismo path con el mismo método
9. **Eliminación flexible**: Permite eliminar por UUID, ID numérico, path, o combinación path+método

## Validación de Datos

La API incluye validación robusta usando Joi para todos los endpoints:

### Errores de Validación Comunes

#### Datos faltantes o inválidos:
```bash
# Ejemplo: Path sin barra inicial
curl -X POST http://localhost:3000/api/configure-mock ^
  -H "Content-Type: application/json" ^
  -d "{\"path\":\"api/productos\",\"method\":\"GET\",\"statusCode\":200,\"response\":{}}"
```

**Respuesta de error:**
```json
{
  "error": "Datos de entrada inválidos",
  "details": [
    {
      "field": "path",
      "message": "El path debe comenzar con \"/\""
    }
  ]
}
```

#### Método HTTP inválido:
```bash
curl -X POST http://localhost:3000/api/configure-mock ^
  -H "Content-Type: application/json" ^
  -d "{\"path\":\"/api/productos\",\"method\":\"INVALID\",\"statusCode\":200,\"response\":{}}"
```

**Respuesta de error:**
```json
{
  "error": "Datos de entrada inválidos",
  "details": [
    {
      "field": "method",
      "message": "El método debe ser uno de: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS"
    }
  ]
}
```

#### Código de estado inválido:
```bash
curl -X POST http://localhost:3000/api/configure-mock ^
  -H "Content-Type: application/json" ^
  -d "{\"path\":\"/api/productos\",\"method\":\"GET\",\"statusCode\":999,\"response\":{}}"
```

**Respuesta de error:**
```json
{
  "error": "Datos de entrada inválidos",
  "details": [
    {
      "field": "statusCode",
      "message": "El código de estado debe ser menor o igual a 599"
    }
  ]
}
```

#### ID de mock inválido:
```bash
curl -X DELETE http://localhost:3000/api/configure-mock/invalid-id
```

**Respuesta de error:**
```json
{
  "error": "Identificador inválido",
  "message": "El identificador debe ser un UUID válido, un ID numérico, o un path válido (ej: /api/productos)",
  "details": ["El identificador debe ser un UUID válido, un ID numérico, o un path válido"]
}
```

## Ejemplos de Eliminación de Mocks

### Eliminar por ID numérico (más fácil):
```bash
curl -X DELETE http://localhost:3000/api/configure-mock/1
```

### Eliminar por path (cuando solo hay uno):
```bash
curl -X DELETE http://localhost:3000/api/configure-mock/api/v1/usuarios
```

### Eliminar específico por path y método:
```bash
curl -X DELETE http://localhost:3000/api/configure-mock ^
  -H "Content-Type: application/json" ^
  -d "{\"path\":\"/api/v1/productos\",\"method\":\"POST\"}"
```

### Eliminar por UUID (más específico):
```bash
curl -X DELETE http://localhost:3000/api/configure-mock/550e8400-e29b-41d4-a716-446655440000
```

## Notas Técnicas y Mejoras Implementadas

### Resolución de Problemas de Rutas
- **Problema resuelto**: Error de `path-to-regexp` con rutas wildcard (`/*`)
- **Solución implementada**: Middleware personalizado con regex para capturar paths dinámicos
- **Ventaja**: Permite eliminación de mocks por path completo sin restricciones de caracteres especiales

### Validación Robusta
- **Joi** para validación de entrada con esquemas específicos
- **Manejo de errores** centralizado con middleware dedicado
- **Validación flexible** de identificadores (UUID, ID numérico, path)

### Matching Inteligente
- **Headers case-insensitive**: Los headers se comparan sin distinción de mayúsculas/minúsculas
- **Body matching profundo**: Comparación recursiva de objetos JSON
- **Parámetros flexibles**: Soporte para múltiples parámetros de URL

### Arquitectura Extensible
- **Separación de responsabilidades**: Controladores, middleware y validaciones independientes
- **Configuración flexible**: Soporte para diferentes tipos de contenido (JSON, XML, texto)
- **Escalabilidad**: Estructura preparada para agregar persistencia y funcionalidades avanzadas

## Uso de Herramientas de IA

Durante el desarrollo se utilizaron las siguientes consultas con GitHub Copilot:

- "Crear middleware para manejar rutas dinámicas en Express"
- "Implementar sistema de matching de parámetros en API REST"
- "Validación de datos con Joi en Node.js"
- "Estructurar proyecto Express con controladores y rutas"
