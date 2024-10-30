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
   * Each combination object must contain an `items` property, which is an array
   * of items included in that combination.
   *
   * @param {Array<Object>} combinations - An array of combination objects to insert.
   *                                        Each object should have an `items` property, for example:
   *                                        [{ items: ['A1', 'B1'] }, { items: ['C1', 'D1'] }].
   * @param {Connection} connection - The database connection to use for the query.
   * @returns {Promise<number>} A promise that resolves to the ID of the last inserted row.
   * @throws {Error} If there is an error during the database operation, such as a
   *                 constraint violation or connection issue.
   */
  async batchInsert(combinations, connection) {
    const values = combinations
      .map((comb) => `(${connection.escape(comb.items.toString())})`)
      .join(',')

    const sql = `INSERT INTO combinations (combination) VALUES ${values}`

    const [result] = await connection.query(sql)

    return result.insertId // Return the ID of the last inserted combination
  }

  /**
   * Links a combination to an item in the combination_items table.
   *
   * This method establishes a many-to-many relationship between combinations
   * and items by inserting a record into the `combination_items` table.
   *
   * @param {number} combinationId - The ID of the combination to link.
   * @param {number} itemId - The ID of the item to link.
   * @param {Connection} connection - The database connection to use for the query.
   * @returns {Promise<void>} A promise that resolves when the link has been established.
   * @throws {Error} If the combination ID or item ID is undefined, or if there is an error
   *                 during the database operation.
   */
  async linkCombinationItem(combinationId, itemId, connection) {
    if (!combinationId || !itemId) {
      throw new Error('Combination ID or item ID cannot be undefined.')
    }
    await connection.execute(
      'INSERT INTO combination_items (combination_id, item_id) VALUES (?, ?)',
      [combinationId, itemId],
    )
  }
}

export default CombinationRepository
