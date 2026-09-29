const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ==================================================
// MOVIE POSTER UPLOAD
// ==================================================

  const uploadDir = path.join(__dirname, "uploads");

  if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
  }

  const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, uploadDir);
      },

      filename: (req, file, cb) => {
          const uniqueName =
              Date.now() +
              "-" +
              file.originalname.replace(/\s+/g, "-");

          cb(null, uniqueName);
      },
  });

  const upload = multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
          const allowedTypes = [
              "image/jpeg",
              "image/png",
          ];

          if (allowedTypes.includes(file.mimetype)) {
              cb(null, true);
          } else {
              cb(new Error("Only JPG and PNG images are allowed."));
          }
      },
  });

  app.use("/uploads", express.static(uploadDir));

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(cors());
app.use(express.json());


// --------------------------------------------------
// MongoDB Connection
// --------------------------------------------------

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });


// --------------------------------------------------
// Test Route
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    message: "MovieVerse Backend API is running",
  });
});


// ==================================================
// DASHBOARD API
// ==================================================

app.get("/dashboard", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    // Total movies
    const totalMovies = await db.collection("movie").countDocuments();

    // Total users
    const totalUsers = await db.collection("user").countDocuments();

    // Total reviews
    const totalReviews = await db.collection("reviews").countDocuments();

    // Average movie rating
    const ratingResult = await db
      .collection("movie")
      .aggregate([
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: "$Rating",
            },
          },
        },
      ])
      .toArray();

    const averageRating =
      ratingResult.length > 0
        ? Number(ratingResult[0].averageRating.toFixed(1))
        : 0;

    // Recent movies
    const recentMoviesData = await db
      .collection("movie")
      .find({})
      .sort({ Year: -1 })
      .limit(5)
      .toArray();

    const recentMovies = recentMoviesData.map((movie) => ({
      id: movie._id.toString(),
      title: movie.Title || "",
      genre: movie.Genre || "",
      year: movie.Year || "",
      rating: movie.Rating || 0,
      poster: movie.Poster || "",
    }));

    // Recent users
    const recentUsersData = await db
      .collection("user")
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const recentUsers = recentUsersData.map((user) => ({
      id: user._id.toString(),
      username: user.username || "",
      joined: user.createdAt || "",
      profileImage: user.profileImage || "",
    }));

    res.json({
      totalMovies,
      totalUsers,
      averageRating,
      totalReviews,
      recentMovies,
      recentUsers,
      recentActivity: [],
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Failed to load dashboard data",
    });
  }
});


// ==================================================
// GET MOVIES
// ==================================================

app.get("/movies", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    // Query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const search = req.query.search || "";
    const genre = req.query.genre || "";
    const year = req.query.year || "";

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // MongoDB filter
    const filter = {};

    // Search by movie title or director
    if (search) {
      filter.$or = [
        {
          Title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          Director: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by genre
    if (genre) {
      filter.Genre = {
        $regex: genre,
        $options: "i",
      };
    }

    // Filter by year
    if (year) {
      filter.Year = parseInt(year);
    }

    // Count matching movies
    const totalMovies = await db
      .collection("movie")
      .countDocuments(filter);

    // Get movies
    const movies = await db
      .collection("movie")
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Convert MongoDB data into frontend-friendly data
    const formattedMovies = movies.map((movie) => ({
      id: movie._id.toString(),

      title: movie.Title || "",

      year: movie.Year || "",

      genre: movie.Genre || "",

      rating: movie.Rating || 0,

      poster: movie.Poster || "",

      certificate: movie.Certificate || "",

      duration: movie["Duration (min)"] || "",

      director: movie.Director || "",

      cast: movie.Cast || "",

      metascore: movie.Metascore || 0,

      votes: movie.Votes || "",

      description: movie.Description || "",
    }));

    // Calculate total pages
    const totalPages = Math.ceil(totalMovies / limit);

    res.json({
      movies: formattedMovies,

      pagination: {
        currentPage: page,
        totalPages,
        totalMovies,
        limit,
      },
    });
  } catch (error) {
    console.error("Movies error:", error);

    res.status(500).json({
      message: "Failed to load movies",
    });
  }
});


// ==================================================
// ADD MOVIE
// ==================================================

app.post("/movies", upload.single("poster"), async (req, res) => {
  try {
    const db = mongoose.connection.db;

    // Get data sent from frontend
    const {
      title,
      year,
      certificate,
      duration,
      genre,
      rating,
      director,
      cast,
      description,
      poster,
      metascore,
      votes,
    } = req.body;

    // Basic validation
    if (!title || !year || !genre || !director) {
      return res.status(400).json({
        success: false,
        message:
          "Title, year, genre and director are required.",
      });
    }

    // Create movie document
    const newMovie = {
      Poster: req.file
        ? `http://localhost:5000/uploads/${req.file.filename}`
        : "",

      Title: title,

      Year: Number(year),

      Certificate: certificate || "",

      "Duration (min)": duration !== "" && duration !== undefined
        ? Number(duration)
        : 0,

      Genre: genre,

      Rating: rating
        ? Number(rating)
        : 0,

      Metascore: metascore
        ? Number(metascore)
        : 0,

      Director: director,

      Cast: cast || "",

      Votes: votes || "",

      Description: description || "",

      // Default review information
      "Review Count": 0,

      "Review Title": "",

      Review: "",
    };

    // Insert movie into MongoDB
    const result = await db
      .collection("movie")
      .insertOne(newMovie);

    // Return successful response
    res.status(201).json({
      success: true,

      message: "Movie added successfully",

      movie: {
        id: result.insertedId.toString(),

        ...newMovie,
      },
    });
  } catch (error) {
    console.error("Add movie error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add movie",
      error: error.message,
    });
  }
});




// ==================================================
// GET SINGLE MOVIE
// ==================================================

app.get("/movies/:id", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const { id } = req.params;

    const movie = await db.collection("movie").findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.json({
      success: true,
      movie: {
        id: movie._id.toString(),
        title: movie.Title || "",
        year: movie.Year || "",
        certificate: movie.Certificate || "",
        duration: movie["Duration (min)"] || "",
        genre: movie.Genre || "",
        rating: movie.Rating || 0,
        director: movie.Director || "",
        cast: movie.Cast || "",
        description: movie.Description || "",
        poster: movie.Poster || "",
        metascore: movie.Metascore || 0,
        votes: movie.Votes || "",
      },
    });
  } catch (error) {
    console.error("Get movie error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load movie",
    });
  }
});


// ==================================================
// UPDATE MOVIE
// ==================================================

app.put("/movies/:id", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const { id } = req.params;

    const {
      title,
      year,
      certificate,
      duration,
      genre,
      rating,
      director,
      cast,
      description,
    } = req.body;

    // Basic validation
    if (!title || !year || !genre || !director) {
      return res.status(400).json({
        success: false,
        message:
          "Title, year, genre and director are required.",
      });
    }

    const updatedMovie = {
      Title: title,
      Year: Number(year),
      Certificate: certificate || "",
      "Duration (min)": duration !== "" && duration !== undefined
        ? Number(duration)
        : 0,
      Genre: genre,
      Rating: rating !== "" && rating !== undefined
        ? Number(rating)
        : 0,
      Director: director,
      Cast: cast || "",
      Description: description || "",
    };

    const result = await db.collection("movie").updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      {
        $set: updatedMovie,
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.json({
      success: true,
      message: "Movie updated successfully",
      movie: {
        id,
        ...updatedMovie,
      },
    });
  } catch (error) {
    console.error("Update movie error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update movie",
      error: error.message,
    });
  }
});

// ==================================================
// DELETE MOVIE
// ==================================================

app.delete("/movies/:id", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const { id } = req.params;

    const result = await db.collection("movie").deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error("Delete movie error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete movie",
      error: error.message,
    });
  }
});

// ==================================================
// GET USERS
// ==================================================

app.get("/users", async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const users = await db
            .collection("user")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        const formattedUsers = users.map((user) => ({
            id: user._id.toString(),

            username: user.username || "",
            email: user.email || "",
            name: user.name || "",

            profileImage: user.profileImage || "",
            bio: user.bio || "",

            role: user.role || "user",
            status: user.status || "active",

            createdAt: user.createdAt || "",
            updatedAt: user.updatedAt || "",

            joined: user.createdAt || "",
        }));

        res.json({
            success: true,
            users: formattedUsers,
            totalUsers: formattedUsers.length,
        });

    } catch (error) {
        console.error("Users error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load users",
        });
    }
});

// ==================================================
// DELETE USER
// ==================================================

app.delete("/users/:id", async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const { id } = req.params;

        const result = await db.collection("user").deleteOne({
            _id: new mongoose.Types.ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        console.error("Delete user error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message,
        });
    }
});

// ==================================================
// ADMIN LOGIN
// ==================================================

app.post("/login", async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const admin = await db.collection("admin").findOne({
            email: email,
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (admin.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (admin.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Admin account is inactive",
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            admin: {
                id: admin._id.toString(),
                username: admin.username,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
});


// ==================================================
// START SERVER
// ==================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});