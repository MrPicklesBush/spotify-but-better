import { connectDB } from "../lib/db.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const connection = await connectDB();
        const currentUserId = req.auth.userId;

        const query = `SELECT * FROM User WHERE clerkId != ?`;
        connection.query(query, [currentUserId], (err, results) => {
            connection.end(); // Close the connection
            if (err) {
                console.error("Error fetching users:", err);
                return next(err);
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        next(error);
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const connection = await connectDB();
        const myId = req.auth.userId;
        const { userId } = req.params;

        const query = `
            SELECT * FROM Message
            WHERE 
                (senderId = ? AND receiverId = ?) OR 
                (senderId = ? AND receiverId = ?)
            ORDER BY createdAt ASC
        `;
        connection.query(query, [userId, myId, myId, userId], (err, results) => {
            connection.end(); // Close the connection
            if (err) {
                console.error("Error fetching messages:", err);
                return next(err);
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Error in getMessages:", error);
        next(error);
    }
};
