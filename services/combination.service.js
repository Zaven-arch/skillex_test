import Combination from '../models/combination.model.js'
import CombinationValidator from '../utils/combination-validator.util.js'

/**
 * CombinationService is responsible for generating and saving valid combinations
 * of items. It utilizes repositories for database operations and validation,
 * ensuring that the combinations adhere to the specified rules and constraints.
 */
class CombinationService {
  constructor(combinationRepo, itemRepo, responseRepo) {
    this.combinationRepo = combinationRepo // Repository for managing combinations
    this.itemRepo = itemRepo // Repository for managing items
    this.responseRepo = responseRepo // Repository for managing responses
  }

  /**
   * Generates valid combinations of items based on the specified length.
   *
   * @param {Array} items - An array of item identifiers to generate combinations from.
   * @param {number} length - The desired length of each combination.
   * @yields {Combination} - A valid combination of items.
   *
   * @throws {Error} - Throws an error if no valid item names are available for combination generation.
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
   * Recursively generates combinations of items using backtracking.
   *
   * @param {Array} items - The array of item names to generate combinations from.
   * @param {number} length - The desired length of each combination.
   * @param {Set} prefixSet - A set to track unique prefixes of the items in the current path.
   * @param {Array} path - The current combination being constructed.
   * @param {number} start - The starting index for the current iteration.
   * @yields {Combination} - A valid combination of items when the path reaches the specified length.
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
   * Saves generated combinations into the database within a transaction.
   *
   * @param {Array} items - An array of item identifiers to generate combinations from.
   * @param {number} length - The desired length of each combination.
   * @returns {Object} - An object containing the ID of the combination and the generated combinations.
   *
   * @throws {Error} - Throws an error if there are not enough items to generate combinations,
   * or if any item or response ID is undefined during the insertion process.
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
