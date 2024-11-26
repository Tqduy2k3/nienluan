const knex = require("../database/knex");
const ApiError = require("../api-error");
const JSend = require("../jsend");
const cartService = require("../services/carts.services");
async function createCart(req, res) {
  const { U_ID } = req.session; // Lấy U_ID từ session
  // Kiểm tra xem U_ID có tồn tại không
  if (!U_ID) {
    return res.status(401).json({
      status: "fail",
      message: "User is not authenticated",
    });
  }

  try {
    // Tạo cart mới
    const newCartData = {
      U_id: U_ID,
      C_id,
      C_quantity: 0,
    };

    await cartService.createCart(newCartData); // Gọi service để tạo cart

    return res.status(201).json({
      status: "success",
      message: "Cart created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "fail",
      message: "An error occurred while creating the cart",
    });
  }
}
// Function to delete a cart entry
async function deleteCart(req, res) {
  try {
    const { id } = req.params;
    const deleted = await cartService.deleteCart(id);
    if (!deleted) {
      return next(new ApiError(404, "Cart not found"));
    }
    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Could not delete cart with id=${id}`));
  }
}
async function addProduct(req, res) {
  const { C_ID, P_ID, AP_quantity } = req.body;
  try {
    // Validate input
    if (!C_ID || !P_ID || !AP_quantity) {
      return res.status(400).json({
        status: "fail",
        message: "Not enough information to add product",
      });
    }

    // Prepare data for adding
    const newAddingData = {
      C_ID,
      P_ID,
      AP_quantity,
    };

    // Call the service to add product
    const newAdding = await cartService.addProduct(newAddingData);

    // If the product was added successfully
    if (newAdding.status === "success") {
      return res.status(201).json({
        status: newAdding.status,
        message: newAdding.message,
        data: newAdding.data, // Trả về `data` từ `service`
      });
    } else {
      return res.status(400).json({
        status: "fail",
        message: newAdding.message || "Failed to add product",
      });
    }
  } catch (error) {
    console.error("Error adding product:", error); // Log the error details
    return res.status(500).json({
      status: "fail",
      message: "Cannot add product, please try again",
    });
  }
}
async function delete_productfromcart(req, res, next) {
  // Extract P_ID and C_ID from the request parameters
  const { P_ID, C_ID } = req.params;
  console.log("checkkk id", P_ID, C_ID);

  // Check if both P_ID and C_ID are provided and are valid
  if (!P_ID || !C_ID) {
    return res.status(400).json({
      status: "fail",
      message: "Valid Product ID and Cart ID are required",
    });
  }

  try {
    // Call the service or repository to delete the product from the cart
    const deleted = await cartService.delete_productcart({
      P_ID: P_ID,
      C_ID: C_ID,
    });

    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: "Resource not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    console.error(`Error deleting product from cart: ${error.message}`); // Log error for debugging
    return res.status(500).json({
      status: "error",
      message: `Internal Server Error: Could not delete product with ID = ${P_ID}`,
    });
  }
}
async function update_productOncart(req, res, next) {
  const getdata = { C_id: req.params.C_id, P_id: req.params.P_id };
  const AP_quantity = req.body.AP_quatity;
  console.log("check", getdata, AP_quantity);
  let updatedata = {}; // Khởi tạo là một đối tượng rỗng
  try {
    if (AP_quantity !== undefined) {
      updatedata.AP_quantity = AP_quantity;
    }
    if (Object.keys(updatedata).length == 0) {
      return res.status(400).json({
        status: "fail",
        message: "No data update",
      });
    }
    const updatedData = await cartService.update_productOncart(
      getdata,
      updatedata.AP_quantity
    );
    if (updatedData) {
      return res.json({
        status: "success",
        message: "Product updated successfully",
        data: updatedData,
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "fail",
      message: "An error occurred while updating the product on cart",
    });
  }
}
async function getProductsByCartId(req, res, next) {
  const { C_id } = req.params; // Lấy Cart ID từ tham số URL

  try {
    // Gọi dịch vụ để lấy sản phẩm và tổng giá theo Cart ID
    const { products, totalPrice } =
      await cartService.getProductsByCartId(C_id);

    if (!products || products.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Cart not found or no products in cart",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        products, // Danh sách sản phẩm
        totalPrice, // Tổng giá tiền
      },
    });
  } catch (error) {
    console.error(`Error retrieving products: ${error.message}`);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
}
const getTotalProduct = async (req, res) => {
  const { C_id } = req.params;

  try {
    // Call the service function to get the total product quantity
    const total = await cartService.totalproduct(C_id);

    if (total != null) {
      res.status(200).json({
        status: "success",
        data: {
          totalQuantity: total,
        },
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No products found for this cart ID",
      });
    }
  } catch (error) {
    console.error("Error fetching total product quantity:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
module.exports = {
  createCart,
  deleteCart,
  addProduct,
  delete_productfromcart,
  update_productOncart,
  getProductsByCartId,
  getTotalProduct,
};
