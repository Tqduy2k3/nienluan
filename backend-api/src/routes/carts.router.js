const express = require("express");
const cartController = require("../controllers/carts.controller");
const router = express.Router();
module.exports.setup = (app) => {
  app.use("/api/v1/carts", router);

  /**
   * @swagger
   * /api/v1/carts:
   *   post:
   *     summary: Create a new cart entry
   *     tags: [Cart]
   *     responses:
   *       201:
   *         description: Cart created successfully
   *       500:
   *         description: An error occurred while creating the cart
   */
  router.post("/cart", cartController.createCart);

  /**
   * @swagger
   * /cart/{id}:
   *   delete:
   *     summary: Delete a cart entry
   *     tags: [Cart]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The cart ID
   *     responses:
   *       200:
   *         description: Cart deleted successfully
   *       404:
   *         description: Cart not found
   *       500:
   *         description: An error occurred while deleting the cart
   */
  router.delete("/cart/:id", cartController.deleteCart);
  /**
   * @swagger
   * /api/v1/carts/add:
   *   post:
   *     summary: add product into cart
   *     description: add product into cart
   *     tags:
   *       - Cart
   *     requestBody:
   *       required: true
   *       content:
   *         application/x-www-form-urlencoded:
   *           schema:
   *             $ref: '#/components/schemas/Adding_Products'
   *     responses:
   *       201:
   *         description: add product into cart
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Product added
   *                 data:
   *                   type: object
   *                   properties:
   *                     P_name:
   *                       type: string
   *                       description: Name of the product
   *                       example: Iphone
   *                     AP_quantity:
   *                       type: integer
   *                       description: Quantity of the product added
   *                       example: 2
   *                     price:
   *                       type: number
   *                       format: float
   *                       description: Total price for the added quantity
   *                       example: 0.2
   *       400:
   *         description: Invalid input
   *       500:
   *         description: Internal Server Error
   */
  router.post("/add", cartController.addProduct);
  /**
   * @swagger
   * /api/v1/carts/{P_ID}/{C_ID}:
   *   delete:
   *     summary: Delete product from cart
   *     description: Delete product from cart by providing product ID and cart ID in the URL parameters.
   *     tags:
   *       - Cart
   *     parameters:
   *       - in: path
   *         name: P_ID
   *         required: true
   *         description: Product ID
   *         schema:
   *           type: integer
   *           example: 101
   *       - in: path
   *         name: C_ID
   *         required: true
   *         description: Cart ID
   *         schema:
   *           type: integer
   *           example: 501
   *     responses:
   *       200:
   *         description: Product deleted
   *       404:
   *         description: Product not found
   *       500:
   *         description: Internal Server Error
   */
  router.delete("/:P_ID/:C_ID", cartController.delete_productfromcart);
  /**
   * @swagger
   * /api/v1/carts/{P_ID}/{C_ID}:
   *   delete:
   *     summary: Delete product from cart
   *     description: Delete product from cart by providing product ID and cart ID in the URL parameters.
   *     tags:
   *       - Cart
   *     parameters:
   *       - in: path
   *         name: P_ID
   *         required: true
   *         description: Product ID
   *         schema:
   *           type: integer
   *           example: 101
   *       - in: path
   *         name: C_ID
   *         required: true
   *         description: Cart ID
   *         schema:
   *           type: integer
   *           example: 501
   *     responses:
   *       200:
   *         description: Product deleted
   *       404:
   *         description: Product not found
   *       500:
   *         description: Internal Server Error
   */
  router.delete("/:P_ID/:C_ID", cartController.delete_productfromcart);
  /**
   * @swagger
   * /api/v1/carts/{C_id}/{P_id}:
   *   put:
   *     summary: Update information product on cart
   *     description: Update information product on cart
   *     parameters:
   *       - in: path
   *         name: C_id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Cart ID
   *       - in: path
   *         name: P_id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Product ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/x-www-form-urlencoded:
   *           schema:
   *             type: object
   *             properties:
   *               AP_quatity:
   *                 type: integer
   *                 description: quantity of the product in the cart
   *                 example: 2
   *     tags:
   *       - Cart
   *     responses:
   *       200:
   *         description: Product updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   enum: [success]
   *                 data:
   *                   $ref: '#/components/schemas/Adding_Products'
   *       404:
   *         description: Product not found in the cart
   *       500:
   *         description: Internal Server Error
   */
  router.put("/:C_id/:P_id", cartController.update_productOncart);
  /**
   * @swagger
   * /api/v1/carts/{C_id}:
   *   get:
   *     summary: get product of user
   *     description: get product of user
   *     parameters:
   *       - in: path
   *         name: C_id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Cart ID
   *       - $ref: '#/components/parameters/limitParam'
   *       - $ref: '#/components/parameters/pageParam'
   *     tags:
   *       - Cart
   *     responses:
   *       200:
   *         description: Product retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   enum: [success]
   *                 data:
   *                   $ref: '#/components/schemas/Adding_Products'
   *       404:
   *         description: Product not found
   *       500:
   *         description: Internal Server Error
   */

  router.get("/:C_id", cartController.getProductsByCartId);
  /**
   * @swagger
   * /api/v1/carts/total/{C_id}:
   *   get:
   *     summary: Get total quantity of products in a user's cart
   *     description: Retrieve the total quantity of products for a specific cart ID.
   *     parameters:
   *       - in: path
   *         name: C_id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Cart ID
   *     tags:
   *       - Cart
   *     responses:
   *       200:
   *         description: Total quantity retrieved successfully
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
   *                     totalQuantity:
   *                       type: integer
   *                       description: The total quantity of products in the cart
   *       404:
   *         description: No products found for this cart ID
   *       500:
   *         description: Internal Server Error
   */
  router.get("/total/:C_id", cartController.getTotalProduct);
};
