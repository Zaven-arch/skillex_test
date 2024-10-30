import BaseRepository from './base.repository.js'

/**
 * CombinationRepository is responsible for performing database operations
 * related to combinations, extending the functionality of BaseRepository.
 */
class CombinationRepository extends BaseRepository {
  /**
   * Inserts multiple combinations into the database in a single batch.
   *
   * This method constructs an SQL `INSERT` statement using the provided
   * combinations and executes it on the given database connection.
   *
   * @param {Array<Object>} combinations - An array of combination objects to insert.
   * @param {Connection} connection - The database connection to use for the query.
   * @returns {Promise<number>} A promise that resolves to the ID of the last inserted row.
   * @throws {Error} If there is an error during the database operation.
   */
  async batchInsert(combinations, connection) {
    const values = combinations
      .map((comb) => `(${connection.escape(comb.items.toString())})`)
      .join(',')

    const sql = `INSERT INTO combinations (combination) VALUES ${values}`

    const [result] = await connection.query(sql)

    return result.insertId
  }
}

export default CombinationRepository
