const pool = require('../db'); // Import your pool configuration for PostgreSQL

// Define the User Model
class User {
    // Create a new user in the database
    static async createUser(username, password, role) {
        try {
            const result = await pool.query(
                "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
                [username, password, role]
            );
            return result.rows[0]; // Return the created user
        } catch (err) {
            throw new Error('Error creating user: ' + err.message);
        }
    }

    // Find user by username
    static async findByUsername(username) {
        try {
            const result = await pool.query(
                "SELECT id, username, password, role FROM users WHERE username = $1",
                [username]
            );
            return result.rows[0]; // Return the found user or null
        } catch (err) {
            throw new Error('Error fetching user: ' + err.message);
        }
    }

    // Find user by id
    static async findById(id) {
        try {
            const result = await pool.query(
                "SELECT id, username, email, role FROM users WHERE id = $1",
                [id]
            );
            return result.rows[0]; // Return the found user or null
        } catch (err) {
            throw new Error('Error fetching user: ' + err.message);
        }
    }
}

module.exports = User;
