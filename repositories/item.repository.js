class ItemRepository {
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
