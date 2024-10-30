import express from 'express'

import CombinationController from './controllers/combination.controller.js'

import { swaggerDocs } from './config/swagger.config.js'

import dotenv from 'dotenv'

dotenv.config()

class App {
  constructor() {
    this.app = express()

    this.port = process.env.PORT || 3000

    this.setupMiddleware()

    this.setupRoutes()

    swaggerDocs(this.app)
  }

  setupMiddleware() {
    this.app.use(express.json())

    this.app.use(express.urlencoded({ extended: true }))
  }

  setupRoutes() {
    const combinationController = new CombinationController()

    this.app.post('/generate', combinationController.generate.bind(combinationController))
  }

  getServer() {
    return this.app
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on ${process.env.APP_URL}`)
    })
  }
}

export default App
