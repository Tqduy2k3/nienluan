const express = require('express');
const authController = require('../controllers/auth.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const router = express.Router();

module.exports.setup = (app) => {
  app.use('/api/v1/auth', router);

  /**
   * @swagger
   * /api/v1/auth/login:
   *   post:
   *     summary: Login
   *     description: Authenticate a user with the provided credentials
   *     requestBody:
   *       required: true
   *       content:
   *         application/x-www-form-urlencoded:
   *           schema:
   *             type: object
   *             properties:
   *               U_username:
   *                 type: string
   *                 description: Username for the user
   *                 example: "Hdang"
   *               U_password:
   *                 type: string
   *                 description: Password for the user
   *                 example: "Hello123"
   *     tags:
   *       - auth
   *     responses:
   *       200:
   *         description: User logged in successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   enum: [success]
   *                 data:
   *                   type: object
   *                   properties:
   *                     U_id:
   *                       type: integer
   *                       example: 1
   *                     U_username:
   *                       type: string
   *                       example: "Hdang"
   *                     U_role:
   *                       type: string
   *                       example: "user"
   *                     U_address:
   *                       type: string
   *                       example: "Dai ngai, long phu, soc trang"
   *                     U_phone:
   *                       type: integer
   *                       example: 0234243812
   *                     U_created_at:
   *                       type: string
   *                       format: date-time
   *                       example: "2023-08-29T09:12:33Z"
   *       401:
   *         description: Invalid credentials
   *       400:
   *         description: Missing required fields
   *       500:
   *         description: Internal Server Error
   */
  router.post('/login', authController.loginUser);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout
 *     description: Logs out the authenticated user by destroying the session.
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       401:
 *         description: Unauthorized - No active session found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [fail]
 *                 message:
 *                   type: string
 *                   example: "No active session found"
 *       500:
 *         description: Internal Server Error
 */
router.post('/logout', authController.logoutUser);
};


