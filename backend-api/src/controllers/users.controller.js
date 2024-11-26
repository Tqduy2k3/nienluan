const usersService = require('../services/users.service');  // Import the service
const ApiError = require('../api-error');
const JSend = require('../jsend');
const multer = require('multer');
//const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const upload = multer(); // Creates an instance of multer to parse form data


async function register(req, res, next) {
    const { U_username, U_password, U_address, U_phone, U_role } = req.body; // Extract fields from request body

    try {
        // Validate required fields
        if (!U_username || !U_password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Missing required fields'
            });
        }

        // Create an object to hold the user data
        const newUserData = {
            U_username,
            U_address,
            U_phone,
            U_role: U_role || 'user', // Default role if not provided
            U_created_at: new Date().toISOString() // Set the created timestamp
        };

        // Hash the password before saving
        newUserData.U_password = await bcrypt.hash(U_password, 10);

        // Call the service to create a new user
        const newUser = await usersService.register(newUserData);
        
        return res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: {
                U_id: newUser.U_ID,  // Return the new user's ID
                U_username: newUser.U_username,
                U_role: newUser.U_role,
                U_address: newUser.U_address,
                U_phone: newUser.U_phone,
                U_created_at: newUser.U_created_at
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'fail',
            message: 'Username already exists. Please choose a different one.'
        });
    }
}


async function getUsersByFilter(req, res, next) {
    let result = {
        users: [],
        metadata: {
            totalRecord: 0,
            firstPage: 1,
            lastPage: 1,
            page: 1,
            limit: 9,
        },
    };

    try {
        result = await usersService.getUsersByFilter(req.query);  // Get filtered users
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'An error occurred while retrieving users'));
    }

    return res.json({
        status: 'success',
        data: {
            users: result.users,
            metadata: result.metadata,
        }
    });
}

//done
async function getUser(req, res, next) {
    const { id } = req.params;

    try {
        const user = await usersService.getUserById(id);
        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }
        return res.json(JSend.success({ user }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Error retrieving user with id=${id}`));
    }
}

async function getAllUsers(req, res) {
    const sql = 'SELECT U_ID, U_username, U_role, U_phone, U_address FROM User';

    connection.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No users found.' });
        }

        return res.status(200).json({ message: 'Users retrieved successfully', users: results });
    });
}

// Done
async function updateUser(req, res, next) {
    const userId = req.params.id; 
    const { U_username, U_password, U_address, U_phone, U_role } = req.body; // Lấy các trường từ request body

    try {
        const updateData = {};
        if (U_username) updateData.U_username = U_username;
        if (U_password) {
            const hashedPassword = await bcrypt.hash(U_password, 10); // Hash password trước khi lưu
            updateData.U_password = hashedPassword;
        }
        if (U_address) updateData.U_address = U_address;
        if (U_phone) updateData.U_phone = U_phone;
        if (U_role !== undefined) updateData.U_role = U_role;

        // Gọi service để cập nhật thông tin người dùng
        const updatedUser = await usersService.updateUser(userId, updateData);
        if (updatedUser) {
            return res.json({
                status: 'success',
                message: 'User updated successfully',
                data: updatedUser
            });
        } else {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'fail',
            message: 'An error occurred while updating the user'
        });
    }
}

async function deleteUser(req, res, next) {
    const { id } = req.params; 

    try {
        const deleted = await usersService.deleteUser(id);
        if (!deleted) {
            return next(new ApiError(404, 'User not found'));  
        }
        return res.json(JSend.success()); 
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Could not delete user with id=${id}`));  
    }
}



module.exports = {
    getUsersByFilter,
    getUser,
    register,
    updateUser,
    deleteUser,
    getAllUsers
};
