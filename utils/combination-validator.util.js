/**
 * CombinationValidator is a utility class that provides validation methods for combinations.
 *
 * This class contains methods to ensure that combinations meet specific criteria,
 * such as uniqueness of prefixes within a combination.
 */
class CombinationValidator {
  /**
   * Checks if a combination is valid based on its prefixes.
   *
   * A combination is considered valid if it does not contain multiple items with the same prefix.
   *
   * @param {Array<string>} combination - An array of item names representing a combination.
   * @returns {boolean} Returns true if the combination is valid (no repeating prefixes),
   *                   false otherwise.
   */
  static isValid(combination) {
    const seenPrefixes = new Set()

    for (const item of combination) {
      const prefix = item[0]

      if (seenPrefixes.has(prefix)) {
        return false
      }

      seenPrefixes.add(prefix)
    }

    return true
  }
}

export default CombinationValidator
