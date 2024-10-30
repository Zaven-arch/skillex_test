import BaseRepository from './base.repository.js'

/**
 * ResponseRepository is responsible for performing database operations
 * related to storing responses associated with combinations,
 * extending the functionality of BaseRepository.
 */
class ResponseRepository extends BaseRepository {
  /**
   * Inserts a response into the database associated with a specific combination.
   *
   * This method executes an SQL `INSERT` statement to add a response
   * linked to the provided combination ID.
   *
   * @param {number} combinationId - The ID of the combination associated with the response.
   * @param {string} responseText - The response text to be inserted into the database.
   * @param {Connection} connection - The database connection to use for the query.
   * @returns {Promise<void>} A promise that resolves when the response has been inserted.
   * @throws {Error} If there is an error during the database operation.
   */
  async insert(combinationId, responseText, connection) {
    await connection.execute('INSERT INTO responses (combination_id, response) VALUES (?, ?)', [
      combinationId,
      responseText,
    ])
  }
}

export default ResponseRepository
