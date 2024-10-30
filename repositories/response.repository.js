import BaseRepository from './base.repository.js'

class ResponseRepository extends BaseRepository {
  async insert(combinationId, responseText, connection) {
    await connection.execute('INSERT INTO responses (combination_id, response) VALUES (?, ?)', [
      combinationId,
      responseText,
    ])
  }
}

export default ResponseRepository
