import DatabaseSetup from './config/db-setup.config.js'

import App from './app.js'

import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

/**
 * Application class responsible for initializing the database and starting the Express application.
 *
 * This class orchestrates the setup of the database and the application instance,
 * ensuring that all components are properly configured before starting the server.
 */
class Application {
  constructor() {
    this.databaseSetup = new DatabaseSetup() // Create an instance of DatabaseSetup

    this.appInstance = new App() // Create an instance of the App
  }

  /**
   * Initializes the application by setting up the database and starting the server.
   *
   * This method attempts to initialize the database and, upon success, starts the application.
   * In case of failure during initialization, it logs an error message.
   */
  async initialize() {
    try {
      await this.databaseSetup.initializeDatabase() // Initialize the database

      console.log('Database initialized successfully') // Log successful initialization
      this.appInstance.start() // Start the Express application
    } catch (error) {
      console.error('Failed to initialize application:', error) // Log any errors encountered during initialization
    }
  }
}

// Create an instance of the Application class and initialize it
const application = new Application()

application.initialize()
