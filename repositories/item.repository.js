/**
 * ItemRepository is responsible for generating item names based on the provided data.
 */
class ItemRepository {
  /**
   * Generates an array of item names based on the specified counts for each starting letter.
   *
   * Each item name is constructed by combining a starting letter (A, B, C, etc.)
   * with a numerical suffix (1, 2, 3, etc.) based on the count provided for each letter.
   *
   * @param {Object<number>} data - An object where the keys are letters (0-based index)
   *                                and the values are the counts of items to generate for each letter.
   * @returns {Array<string>} An array of generated item names.
   */
  getItems(data) {
    return data.reduce((items, count, letter) => {
      const startingLetter = String.fromCharCode(65 + letter)

      for (let i = 0; i < count; i++ ){
        items.push(`${startingLetter}${i + 1}`)
      }

      return items
    }, [])
  }
}

export default ItemRepository
