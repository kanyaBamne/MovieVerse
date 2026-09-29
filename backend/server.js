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
// GET LATEST REVIEWS
// ==================================================

app.get("/reviews/latest", async (req, res) => {
    try {

        const db = mongoose.connection.db;

        // Get latest reviews from MongoDB
        const reviews = await db
            .collection("reviews")
            .aggregate([

                // Get user information
                {
                    $lookup: {
                        from: "user",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },

                // Get movie information
                {
                    $lookup: {
                        from: "movie",
                        localField: "movieId",
                        foreignField: "_id",
                        as: "movie"
                    }
                },

                // Latest reviews first
                {
                    $sort: {
                        createdAt: -1
                    }
                },

                // Only get latest 10 reviews
                {
                    $limit: 10
                }

            ])
            .toArray();


        // Convert MongoDB data into frontend-friendly data
        const formattedReviews = reviews.map((review) => {

            const user = review.user[0] || {};
            const movie = review.movie[0] || {};

            return {

                id: review._id.toString(),

                reviewTitle: review.reviewTitle || "",

                reviewText: review.reviewText || "",

                rating: review.rating || 0,

                likesCount: review.likesCount || 0,

                createdAt: review.createdAt || "",


                // User information
                user: {
                    id: user._id
                        ? user._id.toString()
                        : "",

                    username: user.username || "",

                    name: user.name || "",

                    profileImage: user.profileImage || ""
                },


                // Movie information
                movie: {
                    id: movie._id
                        ? movie._id.toString()
                        : "",

                    title: movie.Title || "",

                    poster: movie.Poster || ""
                }

            };

        });


        res.json({
            success: true,
            reviews: formattedReviews
        });


    } catch (error) {

        console.error("Latest reviews error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load latest reviews"
        });

    }
});
// ==================================================
// GET TOP LISTS
// ==================================================

app.get("/userlists/top", async (req, res) => {

    try {

        const db = mongoose.connection.db;

        // Get top lists
        const lists = await db
            .collection("userlist")
            .aggregate([

                // Get user information
                {
                    $lookup: {
                        from: "user",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },

                // Get movie information
                {
                    $lookup: {
                        from: "movie",
                        localField: "movieIds",
                        foreignField: "_id",
                        as: "movies"
                    }
                },

                // Most liked lists first
                {
                    $sort: {
                        likesCount: -1
                    }
                },

                // Get top 10 lists
                {
                    $limit: 10
                }

            ])
            .toArray();


        // Convert MongoDB data
        // into frontend-friendly data

        const formattedLists = lists.map((list) => {

            const user = list.user[0] || {};

            return {

                id: list._id.toString(),

                title: list.title || "",

                description: list.description || "",

                likesCount: list.likesCount || 0,

                movieCount: list.movieIds
                    ? list.movieIds.length
                    : 0,

                createdAt: list.createdAt || "",


                // User
                user: {

                    id: user._id
                        ? user._id.toString()
                        : "",

                    username: user.username || "",

                    name: user.name || "",

                    profileImage: user.profileImage || ""

                },


                // Movies
                movies: list.movies.map((movie) => ({

                    id: movie._id.toString(),

                    title: movie.Title || "",

                    poster: movie.Poster || ""

                }))

            };

        });


        res.json({

            success: true,

            lists: formattedLists

        });


    } catch (error) {

        console.error(
            "Top lists error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Failed to load top lists"

        });

    }

});

// ==================================================
// GET SINGLE USER PROFILE
// ==================================================

app.get("/profile/:id", async (req, res) => {

    try {

        const db = mongoose.connection.db;

        const { id } = req.params;


        // Find user by MongoDB ID

        const user = await db.collection("user").findOne({

            _id: new mongoose.Types.ObjectId(id)

        });


        // User not found

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        // Send only the information needed
        // for the profile page

        res.json({

            success: true,

            user: {

                id: user._id.toString(),

                username: user.username || "",

                name: user.name || "",

                profileImage: user.profileImage || "",

                bio: user.bio || ""

            }

        });


    } catch (error) {

        console.error("Profile error:", error);


        res.status(500).json({

            success: false,

            message: "Failed to load profile"

        });

    }

});

// ==================================================
// ADD MOVIE TO WATCHLIST
// ==================================================

app.post("/watchlist", async (req, res) => {

    try {

        const db = mongoose.connection.db;

        const { userId, movieId } = req.body;


        // Check required data

        if (!userId || !movieId) {

            return res.status(400).json({

                success: false,

                message: "userId and movieId are required"

            });

        }


        // Check if movie is already in watchlist

        const existingMovie = await db
            .collection("watchlists")
            .findOne({

                userId: new mongoose.Types.ObjectId(userId),

                movieId: new mongoose.Types.ObjectId(movieId)

            });


        if (existingMovie) {

            return res.status(400).json({

                success: false,

                message: "Movie is already in watchlist"

            });

        }


        // Add movie

        const result = await db
            .collection("watchlists")
            .insertOne({

                userId: new mongoose.Types.ObjectId(userId),

                movieId: new mongoose.Types.ObjectId(movieId),

                addedAt: new Date()

            });


        res.json({

            success: true,

            message: "Movie added to watchlist",

            watchlistId: result.insertedId

        });


    } catch (error) {

        console.error(
            "Add watchlist error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to add movie to watchlist"

        });

    }

});
// ==================================================
// GET USER WATCHLIST
// ==================================================

app.get("/watchlist/:userId", async (req, res) => {

    try {

        const db = mongoose.connection.db;

        const { userId } = req.params;


        const watchlist = await db
            .collection("watchlists")
            .aggregate([

                {
                    $match: {

                        userId:
                            new mongoose.Types.ObjectId(userId)

                    }

                },

                {
                    $lookup: {

                        from: "movie",

                        localField: "movieId",

                        foreignField: "_id",

                        as: "movie"

                    }

                },

                {
                    $unwind: "$movie"

                },

                {
                    $sort: {

                        addedAt: -1

                    }

                }

            ])
            .toArray();


        res.json({

            success: true,

            watchlist: watchlist

        });


    } catch (error) {

        console.error(
            "Watchlist fetch error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to fetch watchlist"

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
            name: user.name || "",
            email: user.email || "",
            joined: user.createdAt || "",
            status: user.status || "active",
            profileImage: user.profileImage || "",
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