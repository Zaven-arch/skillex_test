import dbInstance from '../config/db.config.js'

class BaseRepository {
  async getConnection() {
    return dbInstance.getConnection()
  }

  async executeInTransaction(callback) {
    const connection = await this.getConnection()

    try {
      await connection.beginTransaction()

      const result = await callback(connection)

      await connection.commit()

      return result
    } catch (error) {
      await connection.rollback()

      throw error
    } finally {
      connection.release()
    }
  }
}

export default BaseRepository
