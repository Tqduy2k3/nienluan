const knex = require('../database/knex');
const bcrypt = require('bcrypt');
const Paginator = require('./paginator');

function userRepository() {
    return knex('users');
}

function readUser(payload) {
    return {
        U_username: payload.U_username, // Maps to U_username
        U_password: payload.U_password,  // Maps to U_password (note: should be hashed before storing)
        U_role: payload.U_role || 'user', // Maps to U_role; default to 'user' if not provided
        U_created_at: new Date(),      // Sets current timestamp for U_created_at
        U_phone: payload.U_phone,         // Maps to U_phone
        U_address: payload.U_address,     // Maps to U_address
    };
}

async function findUserByUsername(U_username) {
    try {
        const user = await knex('users').where({ U_username }).first(); 
        return user; 
    } catch (error) {
        console.error('Error finding user by username:', error);
        throw new Error('Error finding user by username');
    }
}


async function loginUser(payload) {
    try {
        const user = await findUserByUsername(payload.U_username);
        
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(payload.U_password, user.U_password);
        
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        return {
            id: user.U_ID,
            username: user.U_username,
            role: user.U_role,
            address: user.U_address,
            phone: user.U_phone,
            created_at: user.U_created_at
        };
    } catch (error) {
        console.error('Error during login:', error);
        throw new Error('Login failed');
    }
}

async function logoutUser(req) {
    try {
        // Check if req.session exists
        if (!req.session) {
            throw new Error('No session found to logout');
        }

        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.error('Error during logout:', err);
                throw new Error('Logout failed');
            }
        });

        return { message: 'Logout successful' };
    } catch (error) {
        console.error('Error during logout:', error);
        throw new Error('Logout failed');
    }
}


module.exports = {
    loginUser,
    logoutUser
};