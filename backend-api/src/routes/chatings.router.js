const express = require("express");
const chatController = require("../controllers/chatings.controller");
const router = express.Router();
module.exports.setup = (app) => {
  app.use("/api/v1/chatings", router);
  /**
   * @swagger
   * tags:
   *   name: Chat
   *   description: API for managing chat messages
   */

  /**
   * @swagger
   * /api/v1/chatings:
   *   post:
   *     summary: Create a new chat message
   *     tags: [Chat]
   *     requestBody:
   *       required: true
   *       content:
   *         application/x-www-form-urlencoded:
   *           schema:
   *             $ref: '#/components/schemas/Chat'
   *     responses:
   *       201:
   *         description: Chat created successfully
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
   *                   example: Chat created successfully
   *       400:
   *         $ref: '#/components/responses/400BadRequest'
   *       500:
   *         $ref: '#/components/responses/500InternalServerError'
   */
  router.post("/", chatController.createChat);

  /**
   * @swagger
   * /api/chats/{C_id}:
   *   delete:
   *     summary: Delete a chat by ID
   *     tags: [Chat]
   *     parameters:
   *       - $ref: '#/components/parameters/chatIdParam'
   *     responses:
   *       200:
   *         description: Chat deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/responses/200NoData'
   *       404:
   *         $ref: '#/components/responses/404NotFound'
   *       500:
   *         $ref: '#/components/responses/500InternalServerError'
   */
  router.delete("/:C_id", chatController.deleteChatById);

  /**
   * @swagger
   * /api/chats/from/{C_id_from}:
   *   delete:
   *     summary: Delete all chats sent by a specific user
   *     tags: [Chat]
   *     parameters:
   *       - name: C_id_from
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the user who sent the chats
   *     responses:
   *       200:
   *         description: Chats deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/responses/200NoData'
   *       404:
   *         $ref: '#/components/responses/404NotFound'
   *       500:
   *         $ref: '#/components/responses/500InternalServerError'
   */
  router.delete("/from/:C_id_from", chatController.deleteChatsByFrom);

  /**
   * @swagger
   * /api/chats/to/{C_id_to}:
   *   delete:
   *     summary: Delete all chats received by a specific user
   *     tags: [Chat]
   *     parameters:
   *       - name: C_id_to
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the user who received the chats
   *     responses:
   *       200:
   *         description: Chats deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/responses/200NoData'
   *       404:
   *         $ref: '#/components/responses/404NotFound'
   *       500:
   *         $ref: '#/components/responses/500InternalServerError'
   */
  router.delete("/to/:C_id_to", chatController.deleteChatsByTo);
  /**
   * @swagger
   * /api/v1/chatings/status:
   *   put:
   *     summary: Update the status of a chat by C_id
   *     tags: [Chat]
   *     requestBody:
   *       required: true
   *       content:
   *         application/x-www-form-urlencoded:
   *           schema:
   *             type: object
   *             properties:
   *               C_id:
   *                 type: integer
   *                 description: The ID of the chat message to update
   *               C_status:
   *                 type: integer
   *                 description: The status to update (e.g., 0 for unread, 1 for read)
   *     responses:
   *       200:
   *         description: Chat status updated successfully
   *       400:
   *         $ref: '#/components/responses/400BadRequest'
   *       404:
   *         $ref: '#/components/responses/404NotFound'
   *       500:
   *         $ref: '#/components/responses/500InternalServerError'
   */
  router.put("/status", chatController.updateChatStatusById);
};
