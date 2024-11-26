const knex = require("../database/knex");
function chatingsRepository() {
  return knex("chatings");
}
// Create a new chat entry
async function createChat(chatData) {
  const [newChatId] = await knex("chatings").insert(chatData);
  return {
    C_id: newChatId,
    ...chatData,
  };
}

// Delete a chat by C_id
async function deleteChatById(C_id) {
  const deleted = await knex("chatings").where("C_id", C_id).del();
  return deleted > 0; // Return true if deletion is successful
}

// Delete all chats by C_id_from
async function deleteChatsByFrom(C_id_from) {
  await knex("chatings").where("C_id_from", C_id_from).del();
}

// Delete all chats by C_id_to
async function deleteChatsByTo(C_id_to) {
  await knex("chatings").where("C_id_to", C_id_to).del();
}
const updateStatusByUsers = async (C_id_from, C_id_to, C_status) => {
  // Update the status of the chat messages between two specific users
  const query = `
    UPDATE chatings 
    SET C_status = ? 
    WHERE C_id_from = ? AND C_id_to = ?;
  `;

  try {
    const [result] = await db.execute(query, [C_status, C_id_from, C_id_to]);
    return result;
  } catch (error) {
    throw new Error("Error while updating chat status");
  }
};
async function updateStatusById(C_id, C_status) {
  // Update the status of a chat message based on C_id
  console.log(C_id, C_status);
  try {
    const result = await chatingsRepository()
      .where("C_id", C_id)
      .update("C_status", C_status)
      .debug();
    if (!result) {
      throw new Error(`No rows updated for C_id: ${C_id}`);
    }
    return { status: "success", message: "Chat status updated successfully" };
  } catch (error) {
    console.error("Error updating chat status:", error);
    throw new Error("Error while updating chat status");
  }
}
module.exports = {
  createChat,
  deleteChatById,
  deleteChatsByFrom,
  deleteChatsByTo,
  updateStatusByUsers,
  updateStatusById,
};
