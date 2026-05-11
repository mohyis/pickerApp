const router = require('express').Router();
const { verifyLogin } = require('../middleware/validation');
const { weatherLocation } = require('../utils/weather');

/**
 * @swagger
 * /api/v1/weather:
 *   get:
 *     tags:
 *       - Weather
 *     summary: Get weather info
 *     description: Get weather information for a specific loaction
 *     security:
 *       - bearerAuth: []
 *     responses: 
 *       200:
 *         description: Weather info retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 location:
 *                   type: string
 *                   description: the location for which the weather is provided
 *                   example: lagos, nigeria
 *                 temperature:
 *                   type: string
 *                   description: the current temperature in degree celsius
 *                   example: 30.5
 *                 description:
 *                   type: string
 *                   description: a brief description of present weather condition
 *                   example: partly cloudy with a chance of rain
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: internal server error
 */

router.get('/', verifyLogin, weatherLocation)

module.exports = router