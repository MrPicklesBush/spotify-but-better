import { connectDB } from "../lib/db.js";

export const getStats = async (req, res, next) => {
    try {
        const connection = await connectDB();

        // Define queries
        const totalSongsQuery = `SELECT COUNT(*) AS total FROM Song`;
        const totalAlbumsQuery = `SELECT COUNT(*) AS total FROM Album`;
        const totalUsersQuery = `SELECT COUNT(*) AS total FROM User`;
        const uniqueArtistsQuery = `
            SELECT COUNT(DISTINCT artist) AS totalArtists
            FROM (
                SELECT artist FROM Song
                UNION
                SELECT artist FROM Album
            ) AS artists
        `;

        // Execute all queries in parallel
        const [songsResult, albumsResult, usersResult, artistsResult] = await Promise.all([
            new Promise((resolve, reject) => {
                connection.query(totalSongsQuery, (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0].total);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(totalAlbumsQuery, (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0].total);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(totalUsersQuery, (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0].total);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(uniqueArtistsQuery, (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0].totalArtists);
                });
            }),
        ]);

        connection.end(); // Close the connection

        // Respond with the aggregated statistics
        res.status(200).json({
            totalAlbums: albumsResult,
            totalSongs: songsResult,
            totalUsers: usersResult,
            totalArtists: artistsResult,
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        next(error); // Pass the error to the error handler
    }
};
