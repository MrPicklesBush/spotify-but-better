import { connectDB } from "../lib/db.js";

export const authCallback = async (req, res, next) => {
	try {
		const { id, firstName, lastName, imageUrl } = req.body;

		// Connect to the database
		const db = await connectDB();

		// Check if the user already exists
		const [rows] = await db.execute(
			"SELECT * FROM User WHERE clerkId = ?",
			[id]
		);

		if (rows.length === 0) {
			// Signup: Insert a new user into the database
			await db.execute(
				"INSERT INTO User (clerkId, fullName, imageUrl) VALUES (?, ?, ?)",
				[
					id,
					`${firstName || ""} ${lastName || ""}`.trim(),
					imageUrl
				]
			);
		}

		res.status(200).json({ success: true });
	} catch (error) {
		console.log("Error in auth callback", error);
		next(error);
	}
};
