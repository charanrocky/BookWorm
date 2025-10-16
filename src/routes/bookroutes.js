import express from "express";
import Book from "../models/Book.js";
import cloudinary from "../lib/cloudinary.js";
import protectRoute from "../middleware/auth.middleware.js";
const bookRouter = express.Router();

bookRouter.post("/", protectRoute, async (req, res) => {
  const { title, caption, rating, image, userId } = req.body;

  if (!title || !caption || !rating || !image || !userId)
    return res.status(400).json({ message: "All Fileds are required!" });

  try {
    const uploadResponse = await cloudinary.uploader.upload(image);

    const imageUrl = uploadResponse.secure_url;

    const book = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await book.save();

    return res.status(201).json({ message: "Book is created" });
  } catch (error) {
    console.log("Error found: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

bookRouter.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");
    const totalBooks = Book.countDocuments();
    res.status(200).json({
      books,
      totalBooks,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

bookRouter.delete("/:id", protectRoute, async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);

    if (book.user.toString() != req.user._id)
      return res.status(400).json({ message: "Unauthorized" });

    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log("Error found: ", error);
      }
    }

    await book.deleteOne();

    res.status(200).json({ message: "Book Deleted Successfully" });
  } catch (error) {
    console.log("Error found: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default bookRouter;
