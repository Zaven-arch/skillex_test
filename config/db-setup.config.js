import fs from 'fs'

import path from 'path'

import dbInstance from './db.config.js'

/**
 * DatabaseSetup is a class responsible for initializing a database
 * by loading and executing a setup SQL script.
 */
class DatabaseSetup {
  /**
   * Creates an instance of DatabaseSetup.
   * Sets up the file path for the SQL setup script.
   */
  constructor() {
    this.setupFilePath = path.resolve('sql', 'setup.sql')
  }

  /**
   * Retrieves a database connection from the dbInstance.
   *
   * @returns {Promise<Connection>} A promise that resolves to the database connection.
   */
  async getConnection() {
    return dbInstance.getConnection()
  }

  /**
   * Loads the SQL setup script from the specified file path.
   *
   * @returns {Promise<string>} A promise that resolves to the content of the SQL file.
   * @throws {Error} If there is an error reading the setup SQL file.
   */
  async loadSetupScript() {
    try {
      return fs.readFileSync(this.setupFilePath, 'utf8')
    } catch (error) {
      console.error('Error loading setup SQL file:', error)

      throw new Error('Failed to load setup SQL file')
    }
  }

  /**
   * Initializes the database by executing the SQL setup script.
   *
   * This method connects to the database, loads the SQL setup script,
   * splits the script into individual statements, and executes each statement.
   *
   * @returns {Promise<void>} A promise that resolves when the database setup is complete.
   * @throws {Error} If there is an error during database setup or SQL execution.
   */
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
