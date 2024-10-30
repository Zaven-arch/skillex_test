import fs from 'fs'

import path from 'path'

import dbInstance from './db.config.js'

class DatabaseSetup {
  constructor() {
    this.setupFilePath = path.resolve('sql', 'setup.sql')
  }

  async getConnection() {
    return dbInstance.getConnection()
  }

  async loadSetupScript() {
    try {
      return fs.readFileSync(this.setupFilePath, 'utf8')
    } catch (error) {
      console.error('Error loading setup SQL file:', error)

      throw new Error('Failed to load setup SQL file')
    }
  }

  async initializeDatabase() {
    const connection = await this.getConnection()


    try {
      const setupScript = await this.loadSetupScript()

      const statements = setupScript
        .split(';')
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0)

      for (const statement of statements) {
        await connection.query(statement)
      }


      console.log('Database setup completed successfully.')
    } catch (error) {
      console.error('Database setup error:', error)

      throw new Error('Database setup failed')
    } finally {
      connection.release()
    }
  }
}

export default DatabaseSetup
