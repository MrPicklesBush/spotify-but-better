import { connectDB } from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js";

// Helper function for Cloudinary uploads
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error("Error uploading to Cloudinary");
  }
};

// Create a new song
export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    const connection = await connectDB();
    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const query = `
      INSERT INTO Song (title, artist, audioUrl, imageUrl, duration, albumId)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [title, artist, audioUrl, imageUrl, duration, albumId || null];

    connection.query(query, values, (err, results) => {
      connection.end(); // Close the connection
      if (err) {
        console.error("Error inserting song:", err);
        return next(err);
      }

      const song = {
        id: results.insertId,
        title,
        artist,
        audioUrl,
        imageUrl,
        duration,
        albumId: albumId || null,
      };

      res.status(201).json(song);
    });
  } catch (error) {
    console.log("Error in createSong:", error);
    next(error);
  }
};

// Delete a song
export const deleteSong = async (req, res, next) => {
  try {
    const connection = await connectDB();
    const { id } = req.params;

    const query = `DELETE FROM Song WHERE id = ?`;
    connection.query(query, [id], (err, results) => {
      connection.end(); // Close the connection
      if (err) {
        console.error("Error deleting song:", err);
        return next(err);
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Song not found" });
      }

      res.status(200).json({ message: "Song deleted successfully" });
    });
  } catch (error) {
    console.log("Error in deleteSong:", error);
    next(error);
  }
};

// Create a new album
export const createAlbum = async (req, res, next) => {
  try {
    const connection = await connectDB();
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;

    const imageUrl = await uploadToCloudinary(imageFile);

    const query = `
      INSERT INTO Album (title, artist, imageUrl, releaseYear)
      VALUES (?, ?, ?, ?)
    `;
    const values = [title, artist, imageUrl, releaseYear];

    connection.query(query, values, (err, results) => {
      connection.end(); // Close the connection
      if (err) {
        console.error("Error creating album:", err);
        return next(err);
      }

      const album = {
        id: results.insertId,
        title,
        artist,
        imageUrl,
        releaseYear,
      };

      res.status(201).json(album);
    });
  } catch (error) {
    console.log("Error in createAlbum:", error);
    next(error);
  }
};

// Delete an album and associated songs
export const deleteAlbum = async (req, res, next) => {
  try {
    const connection = await connectDB();
    const { id } = req.params;

    // Delete all songs associated with the album
    const deleteSongsQuery = `DELETE FROM Song WHERE albumId = ?`;
    connection.query(deleteSongsQuery, [id], (err) => {
      if (err) {
        console.error("Error deleting songs:", err);
        return next(err);
      }

      // Delete the album
      const deleteAlbumQuery = `DELETE FROM Album WHERE id = ?`;
      connection.query(deleteAlbumQuery, [id], (err, results) => {
        connection.end(); // Close the connection
        if (err) {
          console.error("Error deleting album:", err);
          return next(err);
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Album not found" });
        }

        res.status(200).json({ message: "Album deleted successfully" });
      });
    });
  } catch (error) {
    console.log("Error in deleteAlbum:", error);
    next(error);
  }
};

// Check if the user is an admin
export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ admin: true });
};
