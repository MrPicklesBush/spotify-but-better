import { connectDB } from "../lib/db.js";

export const getAllAlbums = async (req, res, next) => {
    try {
        const connection = await connectDB();

        const query = `SELECT * FROM Album`;
        connection.query(query, (err, results) => {
            connection.end(); // Close the connection
            if (err) {
                console.error("Error fetching albums:", err);
                return next(err);
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Error in getAllAlbums:", error);
        next(error);
    }
};

export const getAlbumById = async (req, res, next) => {
    try {
        const connection = await connectDB();
        const { albumId } = req.params;

        const query = `
            SELECT * FROM Album WHERE id = ?;
        `;
        const songQuery = `
            SELECT * FROM Song WHERE albumId = ?;
        `;

        connection.query(query, [albumId], (err, albumResults) => {
            if (err) {
                console.error("Error fetching album:", err);
                connection.end();
                return next(err);
            }

            if (albumResults.length === 0) {
                connection.end();
                return res.status(404).json({ message: "Album not found" });
            }

            connection.query(songQuery, [albumId], (err, songResults) => {
                connection.end(); // Close the connection
                if (err) {
                    console.error("Error fetching songs:", err);
                    return next(err);
                }

                const album = {
                    ...albumResults[0], // Album details
                    songs: songResults, // Songs related to the album
                };

                res.status(200).json(album);
            });
        });
    } catch (error) {
        console.error("Error in getAlbumById:", error);
        next(error);
    }
};
