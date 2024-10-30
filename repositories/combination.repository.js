import BaseRepository from './base.repository.js'

class CombinationRepository extends BaseRepository {
  async batchInsert(combinations, connection) {
    const values = combinations
      .map((comb) => `(${connection.escape(comb.items.toString())})`)
      .join(',')

    const sql = `INSERT INTO combinations (combination) VALUES ${values}`

    const [result] = await connection.query(sql)

    return result.insertId
  }
}

export default CombinationRepository
