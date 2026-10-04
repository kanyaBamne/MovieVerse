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
      .sort({ _id: -1 })
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
// GET REVIEWS FOR SINGLE MOVIE
// ==================================================

app.get("/reviews/movie/:movieId", async (req, res) => {
    try {

        const db = mongoose.connection.db;

        const { movieId } = req.params;

        const reviews = await db
            .collection("reviews")
            .aggregate([

                // Only reviews for this movie
                {
                    $match: {
                        movieId: new mongoose.Types.ObjectId(movieId)
                    }
                },

                // Get user information
                {
                    $lookup: {
                        from: "user",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },

                // Convert user array into object
                {
                    $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true
                    }
                },

                // Latest reviews first
                {
                    $sort: {
                        createdAt: -1
                    }
                }

            ])
            .toArray();


        // Convert to frontend-friendly data
        const formattedReviews = reviews.map((review) => {

            return {

                id: review._id.toString(),

                reviewTitle: review.reviewTitle || "",

                reviewText: review.reviewText || "",

                rating: review.rating || 0,

                likesCount: review.likesCount || 0,

                createdAt: review.createdAt || "",

                user: {

                    id: review.user?._id
                        ? review.user._id.toString()
                        : "",

                    username: review.user?.username || "",

                    name: review.user?.name || "",

                    profileImage: review.user?.profileImage || ""

                }

            };

        });


        res.json({

            success: true,

            reviews: formattedReviews

        });


    } catch (error) {

        console.error(
            "Movie reviews error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Failed to load movie reviews"

        });

    }

});

/* ==================================================
   GET REVIEWS BY USER
================================================== */

app.get("/reviews/user/:userId", async (req, res) => {

    try {

        const db = mongoose.connection.db;

        const { userId } = req.params;


        const reviews = await db
            .collection("reviews")
            .aggregate([

                // Only reviews written by this user
                {
                    $match: {
                        userId:
                            new mongoose.Types.ObjectId(userId)
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

                // Convert movie array into object
                {
                    $unwind: {
                        path: "$movie",
                        preserveNullAndEmptyArrays: true
                    }
                },

                // Latest reviews first
                {
                    $sort: {
                        createdAt: -1
                    }
                }

            ])
            .toArray();


        // Convert into frontend-friendly data
        const formattedReviews = reviews.map((review) => {

            return {

                id: review._id.toString(),

                reviewTitle:
                    review.reviewTitle || "",

                reviewText:
                    review.reviewText || "",

                rating:
                    review.rating || 0,

                likesCount:
                    review.likesCount || 0,

                createdAt:
                    review.createdAt || "",

                movie: {

                    id: review.movie?._id
                        ? review.movie._id.toString()
                        : "",

                    title:
                        review.movie?.Title || "",

                    poster:
                        review.movie?.Poster || "",

                    year:
                        review.movie?.Year || ""

                }

            };

        });


        res.json({

            success: true,

            reviews: formattedReviews

        });


    } catch (error) {

        console.error(
            "User reviews error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to load user reviews"

        });

    }

});

// ==================================================
// ADD REVIEW
// ==================================================

app.post("/reviews", async (req, res) => {

 console.log("POST /reviews HIT");

    try {

        const db = mongoose.connection.db;

        const {
            userId,
            movieId,
            rating,
            reviewTitle,
            reviewText
        } = req.body;

        // Check required data
        if (!userId || !movieId || !rating) {

            return res.status(400).json({
                success: false,
                message: "User, movie and rating are required"
            });

        }

        // Create review
        const newReview = {

            userId:
                new mongoose.Types.ObjectId(userId),

            movieId:
                new mongoose.Types.ObjectId(movieId),

            rating: Number(rating),

            reviewTitle:
                reviewTitle || "",

            reviewText:
                reviewText || "",

            likesCount: 0,

            createdAt: new Date(),

            updatedAt: new Date()

        };

        // Insert into reviews collection
        const result = await db
            .collection("reviews")
            .insertOne(newReview);

        res.status(201).json({

            success: true,

            message: "Review added successfully",

            reviewId: result.insertedId

        });

    } catch (error) {

        console.error(
            "Add review error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Failed to add review"

        });

    }

});

/* ==================================================
   DELETE USER REVIEW
================================================== */

app.delete("/reviews/:reviewId", async (req, res) => {

    try {

        const db = mongoose.connection.db;

        const { reviewId } = req.params;

        const result = await db
            .collection("reviews")
            .deleteOne({
                _id: new mongoose.Types.ObjectId(reviewId)
            });


        if (result.deletedCount === 0) {

            return res.status(404).json({
                success: false,
                message: "Review not found"
            });

        }


        res.json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete review error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete review"
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

        // Check user ID
        if (!userId) {

            return res.status(400).json({

                success: false,

                message: "User ID is required"

            });

        }

        // Get watchlist for this user
        const watchlist = await db
            .collection("watchlists")
            .aggregate([

                // Find watchlist items
                {
                    $match: {

                        userId:
                            new mongoose.Types.ObjectId(userId)

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

                // Convert movie array into object
                {
                    $unwind: {

                        path: "$movie",

                        preserveNullAndEmptyArrays: false

                    }

                },

                // Latest added movies first
                {
                    $sort: {

                        addedAt: -1

                    }

                }

            ])
            .toArray();


        // Convert MongoDB data into
        // frontend-friendly format

        const formattedWatchlist =
            watchlist.map((item) => {

                return {

                    id: item._id.toString(),

                    userId:
                        item.userId.toString(),

                    movieId:
                        item.movieId.toString(),

                    addedAt:
                        item.addedAt,

                    movie: {

                        id:
                            item.movie._id.toString(),

                        title:
                            item.movie.Title || "",

                        poster:
                            item.movie.Poster || "",

                        year:
                            item.movie.Year || "",

                        genre:
                            item.movie.Genre || "",

                        rating:
                            item.movie.Rating || 0

                    }

                };

            });


        res.json({

            success: true,

            watchlist:
                formattedWatchlist

        });


    } catch (error) {

        console.error(
            "Watchlist fetch error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to fetch watchlist"

        });

    }

});

// ==========================================
// REMOVE MOVIE FROM WATCHLIST
// ==========================================

app.delete("/watchlist/:userId/:movieId", async (req, res) => {

    try {

        const db = mongoose.connection.db;

        const { userId, movieId } = req.params;

        if (!userId || !movieId) {

            return res.status(400).json({
                success: false,
                message: "userId and movieId are required"
            });

        }

        const result = await db
            .collection("watchlists")
            .deleteOne({
                userId: new mongoose.Types.ObjectId(userId),
                movieId: new mongoose.Types.ObjectId(movieId)
            });

        if (result.deletedCount === 0) {

            return res.status(404).json({
                success: false,
                message: "Movie not found in watchlist"
            });

        }

        res.json({
            success: true,
            message: "Movie removed from watchlist"
        });

    } catch (error) {

        console.error(
            "Remove watchlist error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to remove movie from watchlist"
        });

    }

});

// ==================================================
// GET USER LISTS
// ==================================================

app.get("/userlists/:userId", async (req, res) => {

    try {

        const db = mongoose.connection.db;

        const { userId } = req.params;


        if (!userId) {

            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });

        }


        const lists = await db
            .collection("userlist")
            .aggregate([

                // Get only this user's lists
                {
                    $match: {
                        userId:
                            new mongoose.Types.ObjectId(userId)
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


                // Latest lists first
                {
                    $sort: {
                        createdAt: -1
                    }
                }

            ])
            .toArray();


        const formattedLists = lists.map((list) => {

            return {

                id: list._id.toString(),

                title: list.title || "",

                description:
                    list.description || "",

                movieCount: list.movieIds
                    ? list.movieIds.length
                    : 0,

                likesCount:
                    list.likesCount || 0,

                isPrivate:
                    list.isPrivate || false,

                createdAt:
                    list.createdAt || "",


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
            "User lists error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to load user lists"

        });

    }

});

// ==================================================
// CREATE USER LIST
// ==================================================

app.post("/userlists", async (req, res) => {

    try {

        const db = mongoose.connection.db;

        const {
            userId,
            title,
            description,
            isPrivate
        } = req.body;


        // Check required data
        if (!userId || !title) {

            return res.status(400).json({
                success: false,
                message: "User ID and list title are required"
            });

        }


        const newList = {

            userId:
                new mongoose.Types.ObjectId(userId),

            title:
                title.trim(),

            description:
                description
                    ? description.trim()
                    : "",

            movieIds: [],

            likesCount: 0,

            isPrivate:
                isPrivate || false,

            createdAt: new Date(),

            updatedAt: new Date()

        };


        const result = await db
            .collection("userlist")
            .insertOne(newList);


        res.status(201).json({

            success: true,

            message: "List created successfully",

            list: {

                id:
                    result.insertedId.toString(),

                title:
                    newList.title,

                description:
                    newList.description,

                movieCount: 0,

                likesCount: 0,

                isPrivate:
                    newList.isPrivate,

                movies: []

            }

        });


    } catch (error) {

        console.error(
            "Create list error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to create list"

        });

    }

});

// ==================================================
// REMOVE MOVIE FROM USER LIST
// ==================================================

app.delete("/userlists/:listId/movies/:movieId", async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const { listId, movieId } = req.params;
        const { userId } = req.body;

        if (!listId || !movieId || !userId) {
            return res.status(400).json({
                success: false,
                message:
                    "List ID, movie ID and user ID are required"
            });
        }

        const list = await db
            .collection("userlist")
            .findOne({
                _id: new mongoose.Types.ObjectId(listId)
            });

        if (!list) {
            return res.status(404).json({
                success: false,
                message: "List not found"
            });
        }

        if (
            list.userId.toString() !==
            userId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You cannot modify this list"
            });
        }

        const result = await db
            .collection("userlist")
            .updateOne(
                {
                    _id: new mongoose.Types.ObjectId(
                        listId
                    )
                },
                {
                    $pull: {
                        movieIds:
                            new mongoose.Types.ObjectId(
                                movieId
                            )
                    },
                    $set: {
                        updatedAt: new Date()
                    }
                }
            );

        if (result.modifiedCount === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Movie was not found in this list"
            });
        }

        res.json({
            success: true,
            message:
                "Movie removed from list"
        });

    } catch (error) {
        console.error(
            "Remove movie from list error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to remove movie from list"
        });
    }
});

// ==================================================
// DELETE USER LIST
// ==================================================

app.delete("/userlists/:listId", async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const { listId } = req.params;
        const { userId } = req.body;

        if (!listId || !userId) {
            return res.status(400).json({
                success: false,
                message:
                    "List ID and user ID are required"
            });
        }

        const list = await db
            .collection("userlist")
            .findOne({
                _id: new mongoose.Types.ObjectId(
                    listId
                )
            });

        if (!list) {
            return res.status(404).json({
                success: false,
                message: "List not found"
            });
        }

        if (
            list.userId.toString() !==
            userId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You cannot delete this list"
            });
        }

        const result = await db
            .collection("userlist")
            .deleteOne({
                _id: new mongoose.Types.ObjectId(
                    listId
                )
            });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "List could not be deleted"
            });
        }

        res.json({
            success: true,
            message: "List deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete list error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to delete list"
        });
    }
});

// ==================================================
// ADD MOVIE TO USER LIST
// ==================================================

app.post("/userlists/:listId/movies", async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const { listId } = req.params;
        const { movieId, userId } = req.body;

        if (!listId || !movieId || !userId) {
            return res.status(400).json({
                success: false,
                message:
                    "List ID, movie ID and user ID are required"
            });
        }

        // Find the list
        const list = await db
            .collection("userlist")
            .findOne({
                _id: new mongoose.Types.ObjectId(listId)
            });

        if (!list) {
            return res.status(404).json({
                success: false,
                message: "List not found"
            });
        }

        // Check list owner
        if (
            list.userId.toString() !==
            userId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You cannot modify this list"
            });
        }

        // Check if movie already exists
        const alreadyExists =
            list.movieIds?.some(
                (movie) =>
                    movie.toString() ===
                    movieId.toString()
            );

        if (alreadyExists) {
            return res.status(400).json({
                success: false,
                message:
                    "Movie is already in this list"
            });
        }

        // Add movie to list
        await db
            .collection("userlist")
            .updateOne(
                {
                    _id: new mongoose.Types.ObjectId(
                        listId
                    )
                },
                {
                    $push: {
                        movieIds:
                            new mongoose.Types.ObjectId(
                                movieId
                            )
                    },

                    $set: {
                        updatedAt: new Date()
                    }
                }
            );

        return res.json({
            success: true,
            message: "Movie added to list"
        });

    } catch (error) {
        console.error(
            "Add movie to list error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to add movie to list"
        });
    }
});

// ==================================================
// GET USER WATCHED MOVIES
// ==================================================

app.get("/watchedMovies/:userId", async (req, res) => {

    try {

        const db = mongoose.connection.db;

        const { userId } = req.params;


        const watchedMovies = await db
            .collection("watchedMovies")
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

                        watchedAt: -1

                    }

                }

            ])
            .toArray();


        res.json({

            success: true,

            watchedMovies: watchedMovies

        });


    } catch (error) {

        console.error(
            "Watched movies fetch error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to fetch watched movies"

        });

    }

});

app.post("/favorites", async (req, res) => {

    try {

        const db = mongoose.connection.db;

        const { userId, movieId } = req.body;

        if (!userId || !movieId) {
            return res.status(400).json({
                success: false,
                message: "userId and movieId are required"
            });
        }

        const existingFavorite = await db
            .collection("favorites")
            .findOne({
                userId: new mongoose.Types.ObjectId(userId),
                movieId: new mongoose.Types.ObjectId(movieId)
            });

        if (existingFavorite) {
            return res.status(400).json({
                success: false,
                message: "Movie is already in favorites"
            });
        }

        await db.collection("favorites").insertOne({
            userId: new mongoose.Types.ObjectId(userId),
            movieId: new mongoose.Types.ObjectId(movieId),
            addedAt: new Date()
        });

        res.json({
            success: true,
            message: "Movie added to favorites"
        });

    } catch (error) {

        console.error("Add favorite error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add favorite"
        });

    }

});

app.get("/favorites/:userId", async (req, res) => {

    try {

        const db = mongoose.connection.db;

        const { userId } = req.params;

        const favorites = await db
            .collection("favorites")
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
            favorites: favorites
        });

    } catch (error) {

        console.error(
            "Favorites fetch error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch favorites"
        });

    }

});

app.delete("/favorites/:userId/:movieId", async (req, res) => {

    try {

        const db = mongoose.connection.db;

        const { userId, movieId } = req.params;

        const result = await db
            .collection("favorites")
            .deleteOne({
                userId: new mongoose.Types.ObjectId(userId),
                movieId: new mongoose.Types.ObjectId(movieId)
            });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Movie not found in favorites"
            });
        }

        res.json({
            success: true,
            message: "Movie removed from favorites"
        });

    } catch (error) {

        console.error(
            "Remove favorite error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to remove favorite"
        });

    }

});

// ==================================================
// ADD MOVIE TO WATCHED MOVIES
// ==================================================

app.post("/watchedMovies", async (req, res) => {

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


        // Check if movie is already marked as watched

        const existingMovie = await db
            .collection("watchedMovies")
            .findOne({

                userId: new mongoose.Types.ObjectId(userId),

                movieId: new mongoose.Types.ObjectId(movieId)

            });


        if (existingMovie) {

            return res.status(400).json({

                success: false,

                message: "Movie is already marked as watched"

            });

        }


        // Add movie

        const result = await db
            .collection("watchedMovies")
            .insertOne({

                userId: new mongoose.Types.ObjectId(userId),

                movieId: new mongoose.Types.ObjectId(movieId),

                watchedAt: new Date(),

                rewatched: false,

                watchCount: 1

            });


        res.json({

            success: true,

            message: "Movie marked as watched",

            watchedMovieId: result.insertedId

        });


    } catch (error) {

        console.error(
            "Add watched movie error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to mark movie as watched"

        });

    }

});


// ==================================================
// REMOVE MOVIE FROM WATCHED MOVIES
// ==================================================

app.delete("/watchedMovies", async (req, res) => {

    console.log("DELETE /watchedMovies HIT");

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

        // Remove watched movie
        const result = await db
            .collection("watchedMovies")
            .deleteOne({
                userId: new mongoose.Types.ObjectId(userId),
                movieId: new mongoose.Types.ObjectId(movieId)
            });

        if (result.deletedCount === 0) {

            return res.status(404).json({
                success: false,
                message: "Movie is not in watched movies"
            });

        }

        res.json({
            success: true,
            message: "Movie removed from watched movies"
        });

    } catch (error) {

        console.error(
            "Remove watched movie error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to remove movie from watched movies"
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

const profileUploadDir = path.join(
    __dirname,
    "uploads",
    "profiles"
);

if (!fs.existsSync(profileUploadDir)) {
    fs.mkdirSync(profileUploadDir, {
        recursive: true,
    });
}

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, profileUploadDir);
    },

    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);

        const fileName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            extension;

        cb(null, fileName);
    },
});

const profileUpload = multer({
    storage: profileStorage,

    fileFilter: function (req, file, cb) {
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only JPG, JPEG, PNG and WEBP images are allowed."
                )
            );
        }
    },

    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

app.post(
    "/register",
    profileUpload.single("profileImage"),
    async (req, res) => {
        try {
            const db = mongoose.connection.db;

            const {
                name,
                username,
                email,
                password,
                bio,
            } = req.body;

            if (!name || !username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "All required fields must be filled",
                });
            }

            const existingEmail = await db
                .collection("user")
                .findOne({ email });

            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    message: "Email already registered",
                });
            }

            const existingUsername = await db
                .collection("user")
                .findOne({ username });

            if (existingUsername) {
                return res.status(409).json({
                    success: false,
                    message: "Username already taken",
                });
            }

            const bcrypt = require("bcrypt");

            const hashedPassword = await bcrypt.hash(
                password,
                10
            );

            let profileImage = "";

            if (req.file) {
                profileImage =
                    "/uploads/profiles/" +
                    req.file.filename;
            }

            const newUser = {
                name,
                username,
                email,
                password: hashedPassword,
                profileImage,
                bio: bio || "",
                role: "user",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await db
                .collection("user")
                .insertOne(newUser);

            res.status(201).json({
                success: true,
                message: "Registration successful",
                user: {
                    id: result.insertedId.toString(),
                    name,
                    username,
                    email,
                    profileImage,
                    bio: bio || "",
                    role: "user",
                },
            });

        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Registration failed",
            });
        }
    }
);
// ==================================================
// ADMIN LOGIN
// ==================================================

app.post("/login", async (req, res) => {
    try {
        const db = mongoose.connection.db;

        console.log("DATABASE NAME:", mongoose.connection.name);

        const userCount = await db.collection("user").countDocuments();

        console.log("USER COUNT:", userCount);

        const { email, password } = req.body;

        console.log("========== LOGIN DEBUG ==========");
        console.log("EMAIL RECEIVED =", JSON.stringify(email));
        console.log("PASSWORD RECEIVED =", JSON.stringify(password));
        console.log("=================================");

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // =========================
        // CHECK ADMIN
        // =========================

        const admin = await db.collection("admin").findOne({
            email: email,
        });

        if (admin) {

            // Admin passwords are stored as plain text
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

            return res.json({
                success: true,
                message: "Login successful",

                user: {
                    id: admin._id.toString(),
                    username: admin.username,
                    name: admin.name,
                    email: admin.email,
                    role: "admin",
                },
            });
        }


        // =========================
        // CHECK NORMAL USER
        // =========================

        const user = await db.collection("user").findOne({
            email: email,
        });

        const allUsers = await db
            .collection("user")
            .find({})
            .project({ email: 1, username: 1 })
            .toArray();

        console.log("ALL USERS:", allUsers);

        console.log("USER FOUND:", user ? user.email : "NO USER FOUND");
                console.log(
                    "USER FOUND:",
                    user ? user.email : "NO USER FOUND"
                );

        if (user) {

           const bcrypt = require("bcrypt");

            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

             console.log("PASSWORD MATCH:", passwordMatch);

              if (!passwordMatch) {
                  return res.status(401).json({
                      success: false,
                      message: "Invalid email or password",
                  });
              }

            if (user.status !== "active") {
                return res.status(403).json({
                    success: false,
                    message: "User account is inactive",
                });
            }

            return res.json({
                success: true,
                message: "Login successful",

                user: {
                    id: user._id.toString(),
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    profileImage: user.profileImage,
                    role: "user",
                }
            });
        }


        // =========================
        // EMAIL NOT FOUND
        // =========================

        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
});

// ===============================
// TOP REVIEWS
// ===============================

app.get("/top-reviews", async (req, res) => {
    try {
        const db = mongoose.connection.db;

        // =========================
        // TOP REVIEWED MOVIES
        // =========================

        const topReviewedMovies = await db
            .collection("reviews")
            .aggregate([

                // Count reviews for each movie
                {
                    $group: {
                        _id: "$movieId",
                        reviewCount: {
                            $sum: 1
                        },
                        averageRating: {
                            $avg: "$rating"
                        }
                    }
                },

                // Highest number of reviews first
                {
                    $sort: {
                        reviewCount: -1
                    }
                },

                // Show top 5 movies
                {
                    $limit: 1
                },

                // Get movie details
                {
                    $lookup: {
                        from: "movie",
                        localField: "_id",
                        foreignField: "_id",
                        as: "movie"
                    }
                },

                {
                    $unwind: {
                        path: "$movie",
                        preserveNullAndEmptyArrays: true
                    }
                },

                // Get one actual review for this movie
                {
                    $lookup: {
                        from: "reviews",
                        let: {
                            movieId: "$_id"
                        },
                        pipeline: [

                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            "$movieId",
                                            "$$movieId"
                                        ]
                                    }
                                }
                            },

                            // Latest review
                            {
                                $sort: {
                                    createdAt: -1
                                }
                            },

                            {
                                $limit: 1
                            },

                            // Get reviewer information
                            {
                                $lookup: {
                                    from: "user",
                                    localField: "userId",
                                    foreignField: "_id",
                                    as: "user"
                                }
                            },

                            {
                                $unwind: {
                                    path: "$user",
                                    preserveNullAndEmptyArrays: true
                                }
                            },

                            {
                                $project: {
                                    _id: 0,
                                    reviewTitle: 1,
                                    reviewText: 1,
                                    rating: 1,
                                    createdAt: 1,
                                    userName: "$user.name",
                                    username: "$user.username",
                                    profileImage: "$user.profileImage"
                                }
                            }

                        ],
                        as: "latestReview"
                    }
                },

                {
                    $unwind: {
                        path: "$latestReview",
                        preserveNullAndEmptyArrays: true
                    }
                },

                // Final data sent to React
               {
                    $project: {
                        _id: 0,
                        movieId: "$_id",
                        title: "$movie.Title",
                        genre: "$movie.Genre",
                        year: "$movie.Year",
                        duration: "$movie.Duration (min)",
                        description: "$movie.Description",
                        poster: "$movie.Poster",
                        reviewCount: 1,
                        averageRating: {
                            $round: ["$averageRating", 1]
                        },
                        review: "$latestReview"
                    }
                }

            ])
            .toArray();


        // =========================
        // POPULAR REVIEWERS
        // =========================

        const popularReviewers = await db
            .collection("reviews")
            .aggregate([

                // Count reviews written by each user
                {
                    $group: {
                        _id: "$userId",
                        reviewCount: {
                            $sum: 1
                        }
                    }
                },

                // Most reviews first
                {
                    $sort: {
                        reviewCount: -1
                    }
                },

                // Show top 5 reviewers
                {
                    $limit: 5
                },

                // Get user details
                {
                    $lookup: {
                        from: "user",
                        localField: "_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },

                {
                    $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $project: {
                        _id: 0,

                        userId: "$_id",

                        name: "$user.name",

                        username: "$user.username",

                        profileImage: "$user.profileImage",

                        reviewCount: 1
                    }
                }

            ])
            .toArray();


        // =========================
        // RESPONSE
        // =========================

        res.json({
            success: true,
            topReviewedMovies,
            popularReviewers
        });

    } catch (error) {

        console.error(
            "Top reviews error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load top reviews"
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