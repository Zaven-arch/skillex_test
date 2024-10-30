import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

/**
 * Options for configuring Swagger documentation.
 *
 * @type {Object}
 * @property {Object} definition - The main configuration for OpenAPI.
 * @property {string} definition.openapi - The OpenAPI version.
 * @property {Object} definition.info - Metadata about the API.
 * @property {string} definition.info.title - The title of the API.
 * @property {string} definition.info.version - The version of the API.
 * @property {string} definition.info.description - A brief description of the API.
 * @property {Array<Object>} definition.servers - The list of servers hosting the API.
 * @property {string} definition.servers[].url - The URL of the API server.
 * @property {Array<string>} apis - The paths to the API documentation files.
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Combination API',
      version: '1.0.0',
      description: 'API for generating combinations without repeating prefixes',
    },
    servers: [
      {
        url: process.env.APP_URL,
      },
    ],
  },
  apis: ['./controllers/*.js'],
}

/**
 * Generates Swagger specification using the defined options.
 *
 * @type {Object}
 */
const swaggerSpec = swaggerJSDoc(options)

/**
 * Sets up Swagger UI for API documentation.
 *
 * This function mounts the Swagger UI at the `/docs` endpoint,
 * allowing users to view and interact with the API documentation.
 *
 * @param {Object} app - The Express application instance.
 * @returns {void}
 */
export const swaggerDocs = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
