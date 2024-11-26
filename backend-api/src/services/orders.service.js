const knex = require("../database/knex");
const getCart = require("../services/carts.services");
function orderRepository() {
  return knex("order"); // Refers to the `order` table
}

function readOrder(payload) {
  return {
    O_ID: payload.O_ID,
    U_ID: payload.U_ID,
    AD_ID: payload.AD_ID,
    O_total_price: payload.O_total_price,
    O_status: payload.O_status,
    O_created: payload.O_created, // Ensure the field name matches your SQL table column
  };
}

async function createOrder({ userId, cartId, totalPrice, status }) {
  try {
    // Insert the order without returning the ID
    await knex("Order").insert({
      U_ID: userId,
      C_ID: cartId,
      O_total_price: totalPrice,
      O_status: status,
      O_created: new Date(),
    });
    await getCart.addingRepository().where("C_id", cartId).delete().debug();

    // Fetch the last inserted order details using a query
    const newOrder = await knex("Order")
      .where("U_ID", userId) // Filter by user ID
      .andWhere("C_ID", cartId) // Filter by cart ID
      .orderBy("O_ID", "desc") // Order by ID descending to get the latest
      .first(); // Get the first result

    return newOrder; // Return the full order object
  } catch (error) {
    console.error("Error creating order:", error);
    throw error; // Propagate error to controller
  }
}

async function getOrderByUserId({ userId, page, limit }) {
  const offset = (page - 1) * limit;

  try {
    // Get total count of orders for pagination metadata
    const [{ total: totalOrders }] = await knex("Order")
      .where("Order.U_ID", userId)
      .count("* as total");

    // Query to get orders for the user with pagination
    const orders = await knex("Order")
      .select(
        "Order.O_ID",
        "Order.U_ID",
        "Order.C_ID", // Keep C_ID to link products later
        "Order.O_status",
        "Order.O_created"
      )
      .where("Order.U_ID", userId)
      .limit(limit)
      .offset(offset);

    // If no orders are found, return an empty array
    if (orders.length === 0) {
      return {
        orders: [],
        pagination: {
          page,
          limit,
          totalRecords: totalOrders,
          lastPage: Math.ceil(totalOrders / limit),
        },
      };
    }

    // Retrieve products for each order
    const orderIds = orders.map((order) => order.C_ID); // Get all cart IDs from the orders
    const products = await knex("Adding_Product")
      .select(
        "Adding_Product.C_ID",
        "Adding_Product.P_ID",
        "Adding_Product.AP_quantity",
        "Products.P_name",
        "Products.P_price"
      )
      .innerJoin("Products", "Adding_Product.P_ID", "Products.P_ID") // Join to get product details
      .innerJoin("Cart", "Adding_Product.C_ID", "Cart.C_ID") // Ensure the correct column name
      .whereIn("Cart.C_ID", orderIds); // Filter products by cart IDs

    // Organize products by order ID and calculate total price
    const ordersWithProducts = orders.map((order) => {
      const orderProducts = products.filter(
        (product) => product.C_ID === order.C_ID
      );
      const totalOrderPrice = orderProducts.reduce((total, product) => {
        return total + product.AP_price * product.AP_quantity;
      }, 0); // Calculate total price for the order

      return {
        ...order,
        O_total_price: totalOrderPrice, // Set the calculated total price
        products: orderProducts, // Include the filtered products
      };
    });

    // Return the result including orders with products and pagination metadata
    return {
      orders: ordersWithProducts,
      pagination: {
        page,
        limit,
        totalRecords: totalOrders,
        lastPage: Math.ceil(totalOrders / limit),
      },
    };
  } catch (error) {
    console.error(error); // Log error for debugging
    throw error; // Propagate the error to the controller
  }
}

async function getAllOrders({ page, limit }) {
  const offset = (page - 1) * limit;

  try {
    // Get total count of orders for pagination metadata
    const [{ total: totalOrders }] = await knex("Order").count("* as total");

    // Query to get all orders with pagination
    const orders = await knex("Order")
      .select(
        "Order.O_ID",
        "Order.U_ID",
        "Order.C_ID", // Keep C_ID to link products later
        "Order.O_status",
        "Order.O_created",
        "Order.O_total_price"
      )
      .limit(limit)
      .offset(offset);
    console.log(orders);
    // If no orders are found, return an empty array
    if (orders.length === 0) {
      return {
        orders: [],
        pagination: {
          page,
          limit,
          totalRecords: totalOrders,
          lastPage: Math.ceil(totalOrders / limit),
        },
      };
    }

    // Retrieve products for each order
    const orderIds = orders.map((order) => order.C_ID); // Get all cart IDs from the orders
    const products = await knex("Adding_Product")
      .select(
        "Adding_Product.C_ID",
        "Adding_Product.P_ID",
        "Adding_Product.AP_quantity",
        "Products.P_name",
        "Products.P_price"
      )
      .innerJoin("Products", "Adding_Product.P_ID", "Products.P_ID") // Join to get product details
      .innerJoin("Cart", "Adding_Product.C_ID", "Cart.C_ID") // Ensure the correct column name
      .whereIn("Cart.C_ID", orderIds); // Filter products by cart IDs

    // Organize products by order ID and calculate total price
    const ordersWithProducts = orders.map((order) => {
      //const orderProducts = products.filter(
      // (product) => product.C_ID === order.C_ID
      //);
      // const totalOrderPrice = orderProducts.reduce((total, product) => {
      //  return total + product.P_price * product.AP_quantity;
      //}, 0); // Calculate total price for the order

      return {
        ...order,
        // O_total_price: totalOrderPrice, // Set the calculated total price
        //products: orderProducts, // Include the filtered products
      };
    });

    // Return the result including orders with products and pagination metadata
    return {
      orders: ordersWithProducts,
      pagination: {
        page,
        limit,
        totalRecords: totalOrders,
        lastPage: Math.ceil(totalOrders / limit),
      },
    };
  } catch (error) {
    console.error(error); // Log error for debugging
    throw error; // Propagate the error to the controller
  }
}

async function updateOrder(orderId, { totalPrice, status, created_at }) {
  try {
    const updatedRows = await knex("Order")
      .where("O_ID", orderId)
      .update({
        O_total_price: totalPrice,
        O_status: status,
        O_created: created_at || new Date(), // Update the created_at field if provided, else use the current date
      });

    if (!updatedRows) {
      throw new Error("Order not found or no fields updated.");
    }

    // Fetch the updated order
    const updatedOrder = await knex("Order").where("O_ID", orderId).first();
    return updatedOrder;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error; // Propagate error to the controller
  }
}

async function deleteOrder(orderId) {
  try {
    // Check if the order exists before trying to delete
    const orderExists = await orderRepository()
      .where({ O_ID: orderId })
      .first();

    if (!orderExists) {
      throw new Error("Order not found"); // Change this message for clarity
    }

    // Delete related data first, for example, order items
    await orderRepository().where({ O_ID: orderId }).del(); // Adjust this if you have a separate repository for order items

    // Now delete the order
    await orderRepository().where({ O_ID: orderId }).del();

    return "Order deleted successfully";
  } catch (error) {
    throw new Error("Error deleting order: " + error.message);
  }
}

module.exports = {
  createOrder,
  getOrderByUserId,
  updateOrder,
  deleteOrder,
  getAllOrders,
};
