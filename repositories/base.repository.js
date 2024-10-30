import dbInstance from '../config/db.config.js'

/**
 * BaseRepository provides a base class for database operations,
 * managing connections and transactions.
 */
class BaseRepository {
  /**
   * Retrieves a database connection from the dbInstance.
   *
   * @returns {Promise<Connection>} A promise that resolves to the database connection.
   */
  async getConnection() {
    return dbInstance.getConnection()
  }

  /**
   * Executes a callback function within a database transaction.
   *
   * This method begins a transaction, executes the provided callback,
   * commits the transaction if successful, and rolls back if an error occurs.
   *
   * @param {Function} callback - A function that performs database operations using the connection.
   * @returns {Promise<*>} A promise that resolves to the result of the callback.
   * @throws {Error} If there is an error during the transaction or callback execution.
   */
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
