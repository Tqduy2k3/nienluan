/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const ordersController = require('../controllers/orders.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const router = express.Router();

module.exports.setup = (app) => {
  app.use('/api/v1/orders', router);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get orders by user ID
 *     description: Retrieves a list of orders associated with the specified user ID, including pagination metadata.
 *     parameters:
 *       - in: query
 *         name: U_ID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID to filter orders by.
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/pageParam'
 *     tags:
 *       - orders
 *     responses:
 *       200:
 *         description: A list of orders
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
 *                     orders:  
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *                     metadata:
 *                       $ref: '#/components/schemas/PaginationMetadata'
 *       400: 
 *         description: Bad Request
 *         $ref: '#/components/responses/400BadRequest'
 *       404:
 *         description: No orders found for this user
 *         $ref: '#/components/responses/404NotFound'
 *       405:
 *         description: Method not allowed
 *         $ref: '#/components/responses/405MethodNotAllowed'
 *       500:
 *         description: Internal Server Error
 *         $ref: '#/components/responses/500InternalServerError'
 */

router.get('/:id', ordersController.getOrderByUserId);

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieves a list of all orders with pagination metadata.
 *     parameters:
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/pageParam'
 *     tags:
 *       - orders
 *     responses:
 *       200:
 *         description: A list of all orders
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
 *                     orders:  
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *                     metadata:
 *                       $ref: '#/components/schemas/PaginationMetadata'
 *       400: 
 *         description: Bad Request
 *         $ref: '#/components/responses/400BadRequest'
 *       404:
 *         description: No orders found
 *         $ref: '#/components/responses/404NotFound'
 *       405:
 *         description: Method not allowed
 *         $ref: '#/components/responses/405MethodNotAllowed'
 *       500:
 *         description: Internal Server Error
 *         $ref: '#/components/responses/500InternalServerError'
 */

router.get('/', ordersController.getAllOrders);


/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order
 *     description: Add a new order to the system
 *     tags:
 *       - orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *                 description: The ID of the user placing the order
 *               cartId:
 *                 type: integer
 *                 example: 1
 *                 description: The ID of the cart associated with the order
 *               totalPrice:
 *                 type: number
 *                 format: float
 *                 example: 2599.97
 *                 description: The total price of the order
 *               status:
 *                 type: string
 *                 example: "paid"
 *                 description: The status of the order
 *     responses:
 *       201:
 *         description: A new order has been created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order created successfully"
 *                 order:
 *                   type: object
 *                   properties:
 *                     O_ID:
 *                       type: integer
 *                       example: 1
 *                       description: The ID of the created order
 *                     U_ID:
 *                       type: integer
 *                       example: 12345
 *                       description: The ID of the user who placed the order
 *                     C_ID:
 *                       type: integer
 *                       example: 67890
 *                       description: The ID of the cart associated with the order
 *                     O_total_price:
 *                       type: number
 *                       format: float
 *                       example: 99.99
 *                       description: The total price of the order
 *                     O_status:
 *                       type: string
 *                       example: "Pending"
 *                       description: The status of the order
 *                     O_created:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-11T10:00:00.000Z"
 *                       description: The creation date and time of the order
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal Server Error
 */

  router.post('/', ordersController.createOrder);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   put:
 *     summary: Update order by ID
 *     description: Modify an existing order by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               totalPrice:
 *                 type: number
 *                 description: Total price of the order
 *               status:
 *                 type: string
 *                 description: Status of the order (e.g., pending, completed)
 *     tags:
 *       - orders
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order updated successfully
 *                 order:
 *                   type: object
 *                   properties:
 *                     O_ID:
 *                       type: integer
 *                       description: The ID of the order
 *                       example: 999
 *                     U_ID:
 *                       type: integer
 *                       description: The ID of the user who placed the order
 *                       example: 4999
 *                     C_ID:
 *                       type: integer
 *                       description: The ID of the customer
 *                       example: 999
 *                     O_total_price:
 *                       type: number
 *                       description: Total price of the order
 *                       example: 999999
 *                     O_status:
 *                       type: string
 *                       description: Status of the order
 *                       example: completed
 *                     O_created:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the order was created
 *                       example: 2024-10-12T15:02:33.000Z

 */

router.put('/:id', ordersController.updateOrder);


/**
 * @swagger
 * /api/v1/orders/{id}:
 *   delete:
 *     summary: Delete order by ID
 *     description: Remove an order by its ID. This action will delete the order and any related items.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order to delete
 *     tags:
 *       - orders
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order deleted successfully
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.delete('/:id', ordersController.deleteOrder);

};
