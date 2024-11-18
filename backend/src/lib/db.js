import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

export const connectDB = async () => {
    try {
        const connection = await new Promise((resolve, reject) => {
            const conn = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            });

            conn.connect((err) => {
                if (err) {
                    reject(err); // Reject the promise if there is an error
                } else {
                    resolve(conn); // Resolve the promise with the connection
                }
            });
        });

        console.log(`Connected to MySQL Database: ${connection.config.host}`);
        return connection; // Return the connection for further use
    } catch (error) {
        console.error("Failed to connect to MySQL", error);
        process.exit(1); // Exit the process with failure
    }
};
