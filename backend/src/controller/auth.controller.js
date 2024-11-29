import { connectDB } from "../lib/db.js";

export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    // Connect to the database
    const db = await connectDB();

    // Check if the user already exists
    const query = `SELECT * FROM User WHERE clerkId = ?`;
    db.query(query, [id], (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return next(err);
      }

      if (rows.length === 0) {
        // Signup: Insert a new user into the database
        const insertQuery = `
          INSERT INTO User (clerkId, fullName, imageUrl)
          VALUES (?, ?, ?)
        `;
        db.query(
          insertQuery,
          [
            id,
            `${firstName || ""} ${lastName || ""}`.trim(),
            imageUrl,
          ],
          (err, result) => {
            if (err) {
              console.error("Insert error:", err);
              return next(err);
            }

            // Respond after inserting the user
            res.status(200).json({ success: true });
          }
        );
      } else {
        // User already exists
        res.status(200).json({ success: true, message: "User already exists" });
      }
    });
  } catch (error) {
    console.log("Error in auth callback", error);
    next(error);
  }
};
