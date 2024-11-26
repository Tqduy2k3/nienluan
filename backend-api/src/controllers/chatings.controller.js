const chatingsService = require("../services/chatings.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");

// Create a new chat entry
async function createChat(req, res, next) {
  const { C_id_from, C_id_to, C_content, C_status } = req.body;
  console.log(req.body);
  if (!C_id_from || !C_id_to || !C_content) {
    return res.status(400).json({
      status: "fail",
      message: "Missing required fields",
    });
  }

  try {
    const newChat = await chatingsService.createChat({
      C_id_from,
      C_id_to,
      C_content,
      C_status,
    });
    return res.status(201).json(JSend.success(newChat));
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Failed to create chat"));
  }
}

// Delete a chat by C_id
async function deleteChatById(req, res, next) {
  const { C_id } = req.params;

  try {
    const deleted = await chatingsService.deleteChatById(C_id);

    if (!deleted) {
      return next(new ApiError(404, "Chat not found"));
    }

    return res.json(JSend.success());
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Failed to delete chat by ID"));
  }
}

// Delete all chats by C_id_from
async function deleteChatsByFrom(req, res, next) {
  const { C_id_from } = req.params;

  try {
    await chatingsService.deleteChatsByFrom(C_id_from);
    return res.json(JSend.success());
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Failed to delete chats by sender ID"));
  }
}

// Delete all chats by C_id_to
async function deleteChatsByTo(req, res, next) {
  const { C_id_to } = req.params;

  try {
    await chatingsService.deleteChatsByTo(C_id_to);
    return res.json(JSend.success());
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Failed to delete chats by receiver ID"));
  }
}
const updateChatStatus = async (req, res) => {
  const { C_id_from, C_id_to, C_status } = req.body;

  // Check if necessary parameters are provided
  if (!C_id_from || !C_id_to || C_status === undefined) {
    return res.status(400).json({
      status: "fail",
      message:
        "Missing required fields: C_id_from, C_id_to, and C_status are required.",
    });
  }

  try {
    const result = await chatingsService.updateStatusByUsers(
      C_id_from,
      C_id_to,
      C_status
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: "success",
        message: "Chat status updated successfully.",
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "No chats found for the specified users.",
      });
    }
  } catch (error) {
    console.error("Error updating chat status:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
async function updateChatStatusById(req, res, next) {
  const { C_id, C_status } = req.body;

  // Check if necessary parameters are provided
  if (!C_id || C_status === undefined) {
    return res.status(400).json({
      status: "fail",
      message: "Missing required fields: C_id and C_status are required.",
    });
  }

  try {
    const result = await chatingsService.updateStatusById(C_id, C_status);

    if ((result.status = "success")) {
      return res.status(200).json({
        status: "success",
        message: "Chat status updated successfully.",
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Chat not found with the specified ID.",
      });
    }
  } catch (error) {
    console.error("Error updating chat status:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
}

module.exports = {
  createChat,
  deleteChatById,
  deleteChatsByFrom,
  deleteChatsByTo,
  updateChatStatus,
  updateChatStatusById,
};
