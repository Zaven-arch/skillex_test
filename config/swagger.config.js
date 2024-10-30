import swaggerJSDoc from 'swagger-jsdoc'

import swaggerUi from 'swagger-ui-express'

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

const swaggerSpec = swaggerJSDoc(options)

export const swaggerDocs = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
