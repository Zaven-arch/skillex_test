class CombinationValidator {
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
