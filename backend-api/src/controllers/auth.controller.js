const authService = require('../services/auth.service');  // Import the service
const ApiError = require('../api-error');
const JSend = require('../jsend');
const multer = require('multer');

const upload = multer(); 

async function loginUser(req, res) {
    const payload = req.body;

    try {
        // Gọi authService để xác thực người dùng và nhận thông tin người dùng
        const user = await authService.loginUser(payload);

        // Kiểm tra session và lưu thông tin người dùng vào session
        if (!req.session) {
            console.error('Session is undefined');
            return res.status(500).json({ message: 'Session is undefined' });
        }

        // Lưu thông tin người dùng vào session
        req.session.user = {
            U_ID: user.id,
            U_username: user.username,
            U_role: user.role,
            U_created_at: user.created_at,
            U_phone: user.phone,
            U_address: user.address
        };

        return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(400).json({ message: error.message });
    }
}

async function logoutUser(req, res) {
    try {
        // Call the service function to handle logout
        await authService.logoutUser(req);
        
        // Send a successful response back to the client
         return res.status(200).json({
            status: 'success',  // Add status field to indicate success
            message: 'Logout successful',
        });
    } catch (error) {
        console.error('Error during logout:', error);

        // Handle specific error cases, if needed
        if (error.message === 'Session not found') {
            return res.status(400).json({ message: 'No session found' });
        }

        // General error response
        return res.status(500).json({ message: 'Logout failed', error: error.message });
    }
}


// Exporting the functions
module.exports = {
    loginUser,   // Change the exported function name
    logoutUser
};
