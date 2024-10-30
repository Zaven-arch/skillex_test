import Combination from '../models/combination.model.js'

import CombinationValidator from '../utils/combination-validator.util.js'

/**
 * CombinationService is responsible for generating and saving valid combinations
 * of items, utilizing repositories for database operations and validation.
 */
class CombinationService {
  /**
   * Creates an instance of CombinationService.
   *
   * @param {CombinationRepository} combinationRepo - The repository for handling combination data.
   * @param {ItemRepository} itemRepo - The repository for handling item data.
   * @param {ResponseRepository} responseRepo - The repository for handling response data.
   */
  constructor(combinationRepo, itemRepo, responseRepo) {
    this.combinationRepo = combinationRepo
    this.itemRepo = itemRepo
    this.responseRepo = responseRepo
  }

  /**
   * Generates valid combinations of items with the specified length.
   *
   * This generator function yields valid combinations of item names
   * based on the provided item counts and specified length.
   *
   * @param {Object<number>} items - An object representing the counts of each item.
   * @param {number} length - The desired length of each combination.
   * @returns {Iterable<Combination>} A generator yielding valid Combination objects.
   */
  *generateValidCombinations(items, length) {
    const itemNames = this.itemRepo.getItems(items)

    yield* this.generateCombinations(itemNames, length)
  }

  /**
   * Generates all combinations of items of a specified length.
   *
   * This generator function produces combinations using a recursive approach,
   * yielding valid combinations only if they pass validation checks.
   *
   * @param {Array<string>} items - An array of item names to generate combinations from.
   * @param {number} length - The desired length of each combination.
   * @returns {Iterable<Combination>} A generator yielding Combination objects.
   */
  *generateCombinations(items, length) {
    function* combinationGenerator(path = [], start = 0) {
      if (path.length === length) {
        if (CombinationValidator.isValid(path)) {
          yield new Combination([...path])
        }

        return
      }

      for (let i = start; i < items.length; i++) {
        path.push(items[i])

        yield* combinationGenerator(path, i + 1)

        path.pop()
      }
    }

    yield* combinationGenerator()
  }

  /**
   * Saves valid combinations to the database within a transaction.
   *
   * This method generates valid combinations, saves them to the combination
   * repository, and also records the associated response in the response repository.
   *
   * @param {Object<number>} items - An object representing the counts of each item.
   * @param {number} length - The desired length of each combination.
   * @returns {Promise<Object>} A promise that resolves to an object containing the ID
   *                            of the saved combinations and the combinations themselves.
   * @throws {Error} If there is an error during the generation or saving process.
   */
  async saveCombinations(items, length) {
    const combinations = []

    for (let combination of this.generateValidCombinations(items, length)) {
      combinations.push(combination)
    }

    return await this.combinationRepo.executeInTransaction(async (connection) => {
      const combinationId = await this.combinationRepo.batchInsert(combinations, connection)

      const responseText = JSON.stringify({
        id: combinationId,
        combinations: combinations.map((c) => c.items),
      })

      await this.responseRepo.insert(combinationId, responseText, connection)

      return {
        id: combinationId,
        combinations: combinations.map((c) => c.items),
      }
    })
  }
}

export default CombinationService
