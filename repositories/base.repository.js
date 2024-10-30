import dbInstance from '../config/db.config.js'

/**
 * BaseRepository provides a base class for database operations,
 * managing connections and transactions.
 *
 * This class serves as a foundation for other repository classes,
 * enabling them to perform common database operations with ease.
 */
class BaseRepository {
  /**
   * Retrieves a database connection from the dbInstance.
   *
   * This method ensures that the caller can obtain a connection to
   * the database for executing queries or transactions.
   *
   * @returns {Promise<Connection>} A promise that resolves to the database connection.
   * @throws {Error} If there is an error while retrieving the connection.
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
   * The callback function should accept a connection parameter to perform
   * database operations. If the callback resolves successfully, the transaction
   * is committed; otherwise, it is rolled back to maintain database integrity.
   *
   * @param {Function} callback - A function that performs database operations using the connection.
   *                               This function should return a promise.
   * @returns {Promise<*>} A promise that resolves to the result of the callback.
   *                       The result will be whatever the callback returns.
   * @throws {Error} If there is an error during the transaction or callback execution.
   *
   * @example
   * // Example usage of executeInTransaction
   * await baseRepository.executeInTransaction(async (connection) => {
   *   const result1 = await connection.query('INSERT INTO table1 ...');
   *   const result2 = await connection.query('INSERT INTO table2 ...');
   *   return { result1, result2 };
   * });
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
      connection.release() // Always release the connection back to the pool
    }
  }
}

export default BaseRepository
