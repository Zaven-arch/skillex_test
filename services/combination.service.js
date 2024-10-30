import Combination from '../models/combination.model.js'
import CombinationValidator from '../utils/combination-validator.util.js'

/**
 * CombinationService class for generating and saving unique combinations of items.
 *
 * This service is responsible for:
 * - Generating valid combinations of items based on specific rules.
 * - Saving the generated combinations to a database using a transactional approach.
 *
 * The class uses three repositories:
 * - combinationRepo: For managing combinations in the database.
 * - itemRepo: For accessing item data.
 * - responseRepo: For handling responses associated with the combinations.
 *
 * @class CombinationService
 */
class CombinationService {
  /**
   * Creates an instance of CombinationService.
   *
   * @param {Object} combinationRepo - The repository for combination operations.
   * @param {Object} itemRepo - The repository for item operations.
   * @param {Object} responseRepo - The repository for response operations.
   */
  constructor(combinationRepo, itemRepo, responseRepo) {
    this.combinationRepo = combinationRepo
    this.itemRepo = itemRepo
    this.responseRepo = responseRepo
  }

  /**
   * Generates valid combinations of items of a specified length.
   *
   * This method is a generator function that yields valid combinations
   * as Combination instances.
   *
   * @param {Array} items - The array of item identifiers.
   * @param {number} length - The desired length of combinations.
   * @returns {Generator} Yields valid combinations of items.
   * @throws {Error} If no valid item names are available for combination generation.
   */
  *generateValidCombinations(items, length) {
    const itemNames = this.itemRepo.getItems(items)

    if (!itemNames || !itemNames.length) {
      throw new Error('No valid item names available for combination generation.')
    }

    // Create a Set to store unique prefixes
    const prefixSet = new Set()

    yield* this.generateCombinations(itemNames, length, prefixSet)
  }

  /**
   * Recursively generates combinations of items.
   *
   * @param {Array} items - The array of item names.
   * @param {number} length - The desired length of combinations.
   * @param {Set} prefixSet - A set to track unique prefixes.
   * @param {Array} path - The current combination being constructed.
   * @param {number} start - The starting index for combination generation.
   * @returns {Generator} Yields valid Combination instances.
   */
  *generateCombinations(items, length, prefixSet, path = [], start = 0) {
    if (path.length === length) {
      if (CombinationValidator.isValid(path)) {
        yield new Combination([...path]) // Yield a new Combination instance
      }
      return
    }

    for (let i = start; i < items.length; i++) {
      const currentItem = items[i]

      const prefix = currentItem[0] // Assuming prefix is the first character

      // Check if the prefix already exists in the path
      if (!prefixSet.has(prefix)) {
        path.push(currentItem) // Add the current item to the path

        prefixSet.add(prefix) // Add the current item's prefix to the set

        yield* this.generateCombinations(items, length, prefixSet, path, i + 1) // Recur with the updated path

        path.pop() // Remove the last item to backtrack

        prefixSet.delete(prefix) // Remove the prefix after backtracking
      }
    }
  }

  /**
   * Saves generated combinations to the database.
   *
   * This method validates the number of items, generates combinations,
   * and performs database operations within a transaction to ensure
   * consistency. It inserts both the combinations and the items associated with
   * them into their respective tables.
   *
   * @param {Array} items - The array of item identifiers.
   * @param {number} length - The desired length of combinations.
   * @returns {Promise<Object>} The response containing the saved combination ID
   * and the items in the combinations.
   * @throws {Error} If there are not enough items to generate combinations or if
   * an item or response ID is undefined.
   */
  async saveCombinations(items, length) {
    const combinations = []

    const itemNames = this.itemRepo.getItems(items)

    if (itemNames.length < length) {
      return { message: 'Not enough items to generate combinations.' }
    }

    // Generate valid combinations
    for (let combination of this.generateValidCombinations(items, length)) {
      combinations.push(combination)
    }

    // Execute database operations within a transaction
    return await this.combinationRepo.executeInTransaction(async (connection) => {
      const combinationId = await this.combinationRepo.batchInsert(combinations, connection)

      const responseText = JSON.stringify({
        id: combinationId,
        combinations: combinations.map((c) => c.items),
      })

      // Insert response and get the ID
      const responseId = await this.responseRepo.insert(combinationId, responseText, connection)

      // Insert items and link them to the response and the combination
      for (const combination of combinations) {
        for (const item of combination.items) {
          // Check if item or responseId is undefined
          if (!item || !responseId) {
            throw new Error('Item or response ID is undefined.')
          }

          const itemId = await this.itemRepo.insert(item, responseId, connection)

          // Link the combination to the item
          await this.combinationRepo.linkCombinationItem(combinationId, itemId, connection)
        }
      }

      return {
        id: combinationId,
        combinations: combinations.map((c) => c.items),
      }
    })
  }
}

export default CombinationService
