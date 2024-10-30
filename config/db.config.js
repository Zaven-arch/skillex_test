import mysql from 'mysql2/promise'

import dotenv from 'dotenv'

dotenv.config()

class Database {
  constructor() {
    if (!Database.instance) {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      })

      Database.instance = this
    }

    return Database.instance
  }

  async getConnection() {
    try {
      return await this.pool.getConnection()
    } catch (error) {
      console.error('Error connecting to the database:', error)

      throw new Error('Database connection failed')
    }
  }
}

const dbInstance = new Database()

Object.freeze(dbInstance)

export default dbInstance
