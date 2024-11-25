import { connectDB } from "../lib/db.js";

export const getAllSongs = async (req, res, next) => {
    try {
        const connection = await connectDB();

        const query = `SELECT * FROM Song ORDER BY createdAt DESC`;
        connection.query(query, (err, results) => {
            connection.end(); // Close the connection
            if (err) {
                console.error("Error fetching songs:", err);
                return next(err);
            }

            res.json(results);
        });
    } catch (error) {
        console.error("Error in getAllSongs:", error);
        next(error);
    }
};

export const getFeaturedSongs = async (req, res, next) => {
    try {
        const connection = await connectDB();

        const query = `
            SELECT id, title, artist, imageUrl, audioUrl
            FROM Song
            ORDER BY RAND()
            LIMIT 6
        `;
        connection.query(query, (err, results) => {
            connection.end(); // Close the connection
            if (err) {
                console.error("Error fetching featured songs:", err);
                return next(err);
            }

            res.json(results);
        });
    } catch (error) {
        console.error("Error in getFeaturedSongs:", error);
        next(error);
    }
};

export const getMadeForYouSongs = async (req, res, next) => {
    try {
        const connection = await connectDB();

        const query = `
            SELECT id, title, artist, imageUrl, audioUrl
            FROM Song
            ORDER BY RAND()
            LIMIT 4
        `;
        connection.query(query, (err, results) => {
            connection.end(); // Close the connection
            if (err) {
                console.error("Error fetching made-for-you songs:", err);
                return next(err);
            }

            res.json(results);
        });
    } catch (error) {
        console.error("Error in getMadeForYouSongs:", error);
        next(error);
    }
};

export const getTrendingSongs = async (req, res, next) => {
    try {
        const connection = await connectDB();

        const query = `
            SELECT id, title, artist, imageUrl, audioUrl
            FROM Song
            ORDER BY RAND()
            LIMIT 4
        `;
        connection.query(query, (err, results) => {
            connection.end(); // Close the connection
            if (err) {
                console.error("Error fetching trending songs:", err);
                return next(err);
            }

            res.json(results);
        });
    } catch (error) {
        console.error("Error in getTrendingSongs:", error);
        next(error);
    }
};
