import DatabaseSetup from './config/db-setup.config.js'

import App from './app.js'

import dotenv from 'dotenv'

dotenv.config()

class Application {
  constructor() {
    this.databaseSetup = new DatabaseSetup()

    this.appInstance = new App()
  }

  async initialize() {
    try {
      await this.databaseSetup.initializeDatabase()

      console.log('Database initialized successfully')

      this.appInstance.start()
    } catch (error) {
      console.error('Failed to initialize application:', error)
    }
  }
}

const application = new Application()

application.initialize()
