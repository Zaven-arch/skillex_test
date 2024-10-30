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
   * linked to the provided combination ID, ensuring the integrity of the relationship
   * between combinations and their responses.
   *
   * @param {number} combinationId - The ID of the combination associated with the response.
   * @param {string} responseText - The response text to be inserted into the database.
   * @param {Connection} connection - The database connection to use for the query.
   *
   * @returns {Promise<number>} A promise that resolves to the ID of the inserted response.
   *
   * @throws {Error} If there is an error during the database operation, such as a
   * SQL constraint violation or connection issue.
   */
  async insert(combinationId, responseText, connection) {
    const [result] = await connection.execute(
      'INSERT INTO responses (combination_id, response) VALUES (?, ?)',
      [combinationId, responseText],
    )

    return result.insertId // Return the inserted response ID
  }
}

export default ResponseRepository
