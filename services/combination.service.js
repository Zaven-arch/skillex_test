import Combination from '../models/combination.model.js'

import CombinationValidator from '../utils/combination-validator.util.js'

class CombinationService {
  constructor(combinationRepo, itemRepo, responseRepo) {
    this.combinationRepo = combinationRepo
    this.itemRepo = itemRepo
    this.responseRepo = responseRepo
  }

  *generateValidCombinations(items, length) {
    const itemNames = this.itemRepo.getItems(items)

    yield* this.generateCombinations(itemNames, length)
  }

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
