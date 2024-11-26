/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const usersController = require('../controllers/users.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
// const { avatarUpload } = require('../middlewares/avatar-upload.middleware');
const router = express.Router();

module.exports.setup = (app) => {
  app.use('/api/v1/users', router);
    /**
    * @swagger
    * /api/v1/users:
    *   get:
    *     summary: Get users by filter
    *     description: Get users by filter
    *     parameters:
    *       - in: query
    *         name: role
    *         schema:
    *           type: int
    *         description: Filter by role status
    *       - in: query
    *         name: name
    *         schema:
    *           type: string
    *         description: Filter by user name
    *       - $ref: '#/components/parameters/limitParam'
    *       - $ref: '#/components/parameters/pageParam'
    *     tags:
    *       - users
    *     responses:
    *       200:
    *         description: A list of users
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: string
    *                   description: The response status
    *                   enum: [success]
    *                 data:
    *                   type: object
    *                   properties:
    *                     users:
    *                       type: array
    *                       items:
    *                         $ref: '#/components/schemas/User'
    *                     metadata:
    *                         $ref: '#/components/schemas/PaginationMetadata'
    *       400: 
    *         description: Bad Request
    *         $ref: '#/components/responses/400BadRequest'
    *       404:
    *         description: Page not found
    *         $ref: '#/components/responses/404NotFound'
    *       405:
    *         description: Method not allowed
    *         $ref: '#/components/responses/405MethodNotAllowed'
    *       500:
    *         description: Internal Server Error
    *         $ref: '#/components/responses/500InternalServerError'
    */
    router.get('/', usersController.getUsersByFilter);


/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register
 *     description: Create a new user with the provided details
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               U_username:
 *                 type: string
 *                 description: Username for the new user
 *                 example: "Hdang"
 *               U_password:
 *                 type: string
 *                 description: Password for the new user (will be hashed)
 *                 example: "Hello123"
 *               U_phone:
 *                 type: integer
 *                 description: Phone number for the new user
 *                 example: 0328270396
 *               U_address:
 *                 type: string
 *                 description: Address for the new user
 *                 example: "Dai Ngai, Long Phu, Soc Trang"
 *     tags:
 *       - users
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                       example: "JohnDoe"
 *                     U_phone:
 *                       type: integer
 *                       example: 1234567890
 *                     U_address:
 *                       type: string
 *                       example: "123 New Street, City"
 *                     U_role:
 *                       type: string
 *                       example: "user"
 *                     U_created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-08-29T09:12:33Z"
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal Server Error
 */
  router.post('/register', usersController.register);


  router.all('/', methodNotAllowed);

   /**
     * @swagger
     * /api/v1/users/{id}:
     *   get:
     *     summary: Get user by ID
     *     description: Get user by ID
     *     parameters:
     *       - $ref: '#/components/parameters/userIdParam'
     *     tags:
     *       - users
     *     responses:
     *       200:
     *         description: A user
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
     *                     user:
     *                       $ref: '#/components/schemas/User'
     *       404:
     *         description: Page not found
     *         $ref: '#/components/responses/404NotFound'
     *       405:
     *         description: Method not allowed
     *         $ref: '#/components/responses/405MethodNotAllowed'
     *       500:
     *         description: Internal Server Error
     *         $ref: '#/components/responses/500InternalServerError'
     */
    router.get('/:id', usersController.getUser);
/**
   * @swagger
   * /api/v1/users/{id}:
   *   put:
   *     summary: Update user by ID
   *     description: Update the details of a user
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID of the user to update
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
 *         application/x-www-form-urlencoded:
   *           schema:
   *             type: object
   *             properties:
   *               U_username:
   *                 type: string
   *                 description: Updated U_username
   *                 example: "JohnDoe"
   *               U_password:
   *                 type: string
   *                 description: Updated password (hashed)
   *                 example: "new_hashed_password"
   *               U_phone:
   *                 type: integer
   *                 description: Updated phone number
   *                 example: 1234567890
   *               U_address:
   *                 type: string
   *                 description: Updated address
   *                 example: "123 New Street, City"
   *               U_role:
   *                 type: string
   *                 description: Updated role 
   *                 example: "user"
   *     tags:
   *       - users
   *     responses:
   *       200:
   *         description: User updated successfully
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
   *                       example: "JohnDoe"
   *                     U_phone:
   *                       type: integer
   *                       example: 1234567890
   *                     U_address:
   *                       type: string
   *                       example: "123 New Street, City"
   *                     U_role:
   *                       type: string
   *                       example: "user"
   *                     U_created_at:
   *                       type: string
   *                       format: date-time
   *                       example: "2023-08-29T09:12:33Z"
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal Server Error
   */

  router.put('/:id', usersController.updateUser);

/**
     * @swagger
     * /api/v1/users/{id}/delete:
     *   delete:
     *     summary: Delete user by ID
     *     description: Delete user by ID
     *     parameters:
    *       - name: id
    *         in: path
    *         required: true
    *         schema:
    *           type: string
    *         description: The ID of the user to delete
    *     tags:
    *       - users
    *     responses:
    *       200:
    *         description: User deleted
    *         $ref: '#/components/responses/200NoData'
    *       400: 
    *         description: Bad Request
    *         $ref: '#/components/responses/400BadRequest'
    *       404:
    *         description: Page not found
    *         $ref: '#/components/responses/404NotFound'
    *       405:
    *         description: Method not allowed
    *         $ref: '#/components/responses/405MethodNotAllowed'
    *       500:
    *         description: Internal Server Error
    *         $ref: '#/components/responses/500InternalServerError'
    */
    router.delete('/:id/delete', usersController.deleteUser);
  router.all('/:id', methodNotAllowed);
};



