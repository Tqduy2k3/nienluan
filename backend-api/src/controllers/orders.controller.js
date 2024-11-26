const orderService = require('../services/orders.service');
const ApiError = require('../api-error');
const knex = require('../database/knex');

async function createOrder(req, res) {
    const { userId, cartId, totalPrice, status } = req.body;

    // Validate input
    if (!userId || !cartId || !totalPrice || !status) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newOrder = await orderService.createOrder({ userId, cartId, totalPrice, status });

        return res.status(201).json({
            message: 'Order created successfully',
            order: newOrder, // Include the complete order object
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
}



async function getOrderByUserId(req, res, next) {

    const userId = req.query.U_ID; // Extract U_ID from query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;

    // Validate inputs
    if (!userId) {
        return res.status(400).json({
            status: "fail",
            message: "User ID is required"
        });
    }

    if (page < 1 || limit < 1) {
        return res.status(400).json({
            status: "fail",
            message: "Page and limit must be positive integers"
        });
    }

    try {
        // Call the service to get orders with pagination
        const result = await orderService.getOrderByUserId({ userId, page, limit });

        // Check if there are any orders found
        if (result.orders.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "No orders found for this user"
            });
        }

        // Send response with orders and pagination metadata
        return res.status(200).json({
            status: 'success',
            data: {
                orders: result.orders,
                metadata: result.pagination,
            },
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return next(new ApiError(500, 'An error occurred while retrieving orders'));
    }
}

async function getAllOrders(req, res, next) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;

    // Validate inputs
    if (page < 1 || limit < 1) {
        return res.status(400).json({
            status: "fail",
            message: "Page and limit must be positive integers"
        });
    }

    try {
        // Call the service to get all orders with pagination
        const result = await orderService.getAllOrders({ page, limit });

        // Check if there are any orders found
        if (result.orders.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "No orders found"
            });
        }

        // Send response with orders and pagination metadata
        return res.status(200).json({
            status: 'success',
            data: {
                orders: result.orders,
                metadata: result.pagination,
            },
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return next(new ApiError(500, 'An error occurred while retrieving orders'));
    }
}

async function updateOrder(req, res) {
    const { id: orderId } = req.params;  // Extract orderId from the URL params
    const { totalPrice, status } = req.body;  // Extract status and totalPrice from the request body

    // Validate the input
    if (!orderId) {
        return res.status(400).json({ message: 'Order ID is required' });
    }
    if (!totalPrice || !status) {
        return res.status(400).json({ message: 'Total price and status are required' });
    }

    try {
        // Update the specific fields (totalPrice, status, created_at) in the order
        const updatedOrder = await orderService.updateOrder(orderId, {
            totalPrice,
            status,
            created_at: new Date(),  // Optionally update created_at to current timestamp
        });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Return the updated order details
        return res.status(200).json({
            message: 'Order updated successfully',
            order: updatedOrder,
        });
    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ message: 'An error occurred while updating the order' });
    }
}




async function deleteOrder(req, res) {
    try {
        const message = await orderService.deleteOrder(req.params.id);
        res.status(200).json({ message });
    } catch (error) {
        if (error.message.includes('not found')) {
            // If the error message indicates that the order was not found, send a 404 status
            res.status(404).json({ message: error.message });
        } else {
            // For any other error, send a 500 status
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}


module.exports = {
    createOrder,
    getOrderByUserId,
    updateOrder,
    deleteOrder,
    getAllOrders
};
