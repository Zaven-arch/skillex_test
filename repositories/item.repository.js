import BaseRepository from './base.repository.js'

/**
 * ItemRepository is responsible for generating item names based on the provided data
 * and performing database operations related to item storage.
 */
class ItemRepository extends BaseRepository {
  /**
   * Generates an array of item names based on the specified counts for each starting letter.
   *
   * Each item name is constructed by combining a starting letter (A, B, C, etc.)
   * with a numerical suffix (1, 2, 3, etc.) based on the count provided for each letter.
   *
   * @param {Object<number>} data - An object where the keys represent letters (0-based index),
   *                                and the values indicate the counts of items to generate for each letter.
   *                                For example: {0: 3, 1: 2} generates ['A1', 'A2', 'A3', 'B1', 'B2'].
   * @returns {Array<string>} An array of generated item names.
   */
  getItems(data) {
    return Object.entries(data).reduce((items, [letter, count]) => {
      const startingLetter = String.fromCharCode(65 + Number(letter)) // Convert index to ASCII character

      for (let i = 0; i < count; i++) {
        items.push(`${startingLetter}${i + 1}`) // Create item name
      }

      return items
    }, [])
  }

  /**
   * Inserts an item into the database and links it to a specific response.
   *
   * This method executes an SQL `INSERT` statement to add the item name to the `items` table,
   * ensuring it is linked to the provided response ID.
   *
   * @param {string} itemName - The name of the item to insert into the database.
   * @param {number} responseId - The ID of the response to link the item to.
   * @param {Connection} connection - The database connection to use for executing the query.
   * @returns {Promise<number>} A promise that resolves to the ID of the inserted item.
   * @throws {Error} If the item name or response ID is undefined or if there is an error
   * during the database operation, such as a constraint violation.
   */
  async insert(itemName, responseId, connection) {
    if (!itemName || !responseId) {
      throw new Error('Item name or response ID cannot be undefined.')
    }

    const [result] = await connection.execute(
      'INSERT INTO items (item_name, response_id) VALUES (?, ?)',
      [itemName, responseId],
    )

    return result.insertId // Return the ID of the inserted item
  }
}

export default ItemRepository
