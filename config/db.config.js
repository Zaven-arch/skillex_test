import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

/**
 * Database class that implements a singleton pattern for managing
 * a MySQL connection pool using mysql2 library.
 */
class Database {
  /**
   * Creates an instance of Database.
   * Initializes a connection pool if it doesn't exist already.
   */
  constructor() {
    // Check if an instance already exists
    if (!Database.instance) {
      // Create a connection pool using configuration from environment variables
      this.pool = mysql.createPool({
        host: process.env.DB_HOST, // Database host
        user: process.env.DB_USER, // Database user
        password: process.env.DB_PASSWORD, // Database user's password
        database: process.env.DB_NAME, // Database name
        waitForConnections: true, // Wait for available connections
        connectionLimit: 10, // Maximum number of connections in the pool
        queueLimit: 0, // Number of queued connection requests
      })

      // Assign the instance to the static property
      Database.instance = this
    }

    // Return the singleton instance
    return Database.instance
  }

  /**
   * Gets a connection from the pool.
   * @returns {Promise<mysql.Connection>} A promise that resolves to a MySQL connection.
   * @throws {Error} If unable to connect to the database.
   */
  async getConnection() {
    try {
      return await this.pool.getConnection()
    } catch (error) {
      console.error('Error connecting to the database:', error)

      throw new Error('Database connection failed')
    }
  }
}

// Create a single instance of the Database class
const dbInstance = new Database()

// Freeze the instance to prevent modification
Object.freeze(dbInstance)

// Export the single instance of the Database class
export default dbInstance
