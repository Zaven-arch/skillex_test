import CombinationRepository from '../repositories/combination.repository.js'

import ItemRepository from '../repositories/item.repository.js'

import ResponseRepository from '../repositories/response.repository.js'

import CombinationService from '../services/combination.service.js'

/**
 * CombinationController is responsible for handling API requests related
 * to generating combinations of items.
 */
class CombinationController {
  /**
   * Creates an instance of CombinationController.
   * Initializes the CombinationService with the necessary repositories.
   */
  constructor() {
    this.combinationService = new CombinationService(
      new CombinationRepository(),
      new ItemRepository(),
      new ResponseRepository(),
    )
  }

  /**
   * Generates combinations based on the provided items and length.
   *
   * @swagger
   * /generate:
   *   post:
   *     summary: Generate combinations
   *     tags: [Combinations]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               items:
   *                 type: array
   *                 items:
   *                   type: integer
   *               length:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Successfully generated combinations
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 combination:
   *                   type: array
   *                   items:
   *                     type: array
   *                     items:
   *                       type: string
   *       400:
   *         description: Bad request
   *
   * @param {Object} req - The request object, containing the body with items and length.
   * @param {Object} res - The response object used to send the response.
   * @returns {Promise<void>} A promise that resolves when the response is sent.
   * @throws {Error} If there is an error during combination generation.
   */
  async generate(req, res) {
    const { items, length } = req.body

    try {
      const result = await this.combinationService.saveCombinations(items, length)

      res.status(200).json(result)
    } catch (error) {
      console.error('Error generating combinations:', error)

      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

export default CombinationController
