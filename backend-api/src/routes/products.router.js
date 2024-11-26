/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const productsController = require('../controllers/products.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const avatarUpload = require('../middlewares/avatar_upload.middleware');
const router = express.Router();

module.exports.setup = (app) => {
  app.use('/api/v1/products', router);

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get products by filter
 *     description: Retrieve a list of products based on filters such as name and price, with pagination.
 *     parameters:
 *       - in: query
 *         name: P_name
 *         schema:
 *           type: string
 *         description: Filter by product name
 *       - in: query
 *         name: P_price
 *         schema:
 *           type: number
 *         description: Filter by minimum price
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/pageParam'
 *     tags:
 *       - products
 *     responses:
 *       200:
 *         description: A list of products
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
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     metadata:
 *                       $ref: '#/components/schemas/PaginationMetadata'
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 *       405:
 *         $ref: '#/components/responses/405MethodNotAllowed'
 *       500:
 *         $ref: '#/components/responses/500InternalServerError'
 */
router.get('/', productsController.getProductsByFilter);



/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product
 *     tags:
 *       - products
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: A new product created
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
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post('/', avatarUpload, productsController.createProduct);

/**
 * @swagger
 * /api/v1/products/{P_id}:
 *  get:
 *    summary: Get product by ID
 *    description: Get product by ID
 *    parameters:
 *      - $ref: '#/components/parameters/productIdParam'  # Correct $ref syntax
 *    tags:
 *      - products
 *    responses:
 *      200:
 *        description: A product
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  description: The response status
 *                  enum: [success]
 *                data:
 *                  type: object
 *                  properties:
 *                    product:  # Updated property from 'contact' to 'product' to match context
 *                      $ref: '#/components/schemas/Product'
 */
router.get('/:P_id', productsController.getProduct);

  

  /**
   * @swagger
   * /api/v1/products/{id}:
   *   put:
   *     summary: Update product by ID
   *     description: Update product by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Product ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/x-www-form-urlencoded:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     tags:
   *       - products
   *     responses:
   *       200:
   *         description: Product updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   enum: [success]
   *                 data:
   *                   $ref: '#/components/schemas/Product'
   *       404:
   *         description: Product not found
   *       500:
   *         description: Internal Server Error
   */
  router.put('/:id', productsController.updateProduct);

  /**
   * @swagger
   * /api/v1/products/{id}:
   *   delete:
   *     summary: Delete product by ID
   *     description: Delete product by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Product ID
   *     tags:
   *       - products
   *     responses:
   *       200:
   *         description: Product deleted
   *       404:
   *         description: Product not found
   *       500:
   *         description: Internal Server Error
   */
  router.delete('/:id', productsController.deleteProduct);

};
