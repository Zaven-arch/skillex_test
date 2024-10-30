import express from 'express'

import CombinationController from './controllers/combination.controller.js'

import { swaggerDocs } from './config/swagger.config.js'

import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

/**
 * App class initializes and configures the Express application.
 *
 * This class sets up middleware, routes, and integrates Swagger for API documentation.
 */
class App {
  constructor() {
    this.app = express() // Create an instance of the Express application

    this.port = process.env.PORT || 3000 // Set the application port

    this.setupMiddleware() // Configure middleware

    this.setupRoutes() // Define application routes

    swaggerDocs(this.app) // Integrate Swagger documentation
  }

  /**
   * Configures middleware for the application.
   *
   * This method adds JSON and URL-encoded data parsing middleware to handle incoming requests.
   */
  setupMiddleware() {
    this.app.use(express.json()) // Parse JSON request bodies

    this.app.use(express.urlencoded({ extended: true })) // Parse URL-encoded request bodies
  }

  /**
   * Sets up routes for the application.
   *
   * This method defines the API endpoints and associates them with the appropriate controller methods.
   */
  setupRoutes() {
    const combinationController = new CombinationController() // Instantiate the CombinationController

    // Define POST endpoint for generating combinations
    this.app.post('/generate', combinationController.generate.bind(combinationController))
  }

  /**
   * Returns the configured Express application instance.
   *
   * @returns {express.Application} The configured Express application.
   */
  getServer() {
    return this.app
  }

  /**
   * Starts the server and listens for incoming requests.
   *
   * This method begins listening on the specified port and logs a message to the console
   * indicating the server is running.
   */
  start() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on ${process.env.APP_URL}`)
    })
  }
}

export default App
