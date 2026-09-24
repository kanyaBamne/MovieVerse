import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StarCard";

function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalMovies: 0,
    totalUsers: 0,
    averageRating: 0,
    totalReviews: 0,
    recentMovies: [],
    recentUsers: [],
    recentActivity: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:5000/dashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();

        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const {
    totalMovies,
    totalUsers,
    averageRating,
    totalReviews,
    recentMovies,
    recentUsers,
    recentActivity,
  } = dashboardData;

  const stats = [
    {
      title: "Total Movies",
      value: loading ? "..." : totalMovies,
      icon: "🎬",
      change: "From movie catalogue",
    },
    {
      title: "Total Users",
      value: loading ? "..." : totalUsers,
      icon: "👥",
      change: "Registered users",
    },
    {
      title: "Average Rating",
      value: loading ? "..." : averageRating,
      icon: "⭐",
      change: "Across all movies",
    },
    {
      title: "Reviews",
      value: loading ? "..." : totalReviews,
      icon: "📝",
      change: "Total reviews",
    },
  ];

  const activityIcons = {
    user: "👤",
    movie: "🎬",
    review: "📝",
  };

  return (
    <div className="dashboard-page">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back, Admin. Here's what's happening with your movie
            platform.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
          />
        ))}
      </div>

      {/* Recent Content */}
      <div className="dashboard-grid">

        {/* Recent Movies */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Recently Added Movies</h2>
              <p>Latest movies added to the catalogue</p>
            </div>

            <button
              className="text-button"
              onClick={() => navigate("/admin/movies")}
            >
              View all →
            </button>
          </div>

          <div className="recent-list">
            {recentMovies.length > 0 ? (
              recentMovies.map((movie) => (
                <div className="recent-movie" key={movie.id}>

                  <div className="movie-poster-placeholder">
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                      />
                    ) : (
                      "🎬"
                    )}
                  </div>

                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p>
                      {movie.genre} · {movie.year}
                    </p>
                  </div>

                  <div className="movie-rating">
                    ⭐ {movie.rating}
                  </div>

                </div>
              ))
            ) : (
              <p className="empty-message">
                {loading ? "Loading movies..." : "No recent movies found."}
              </p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Recent Users</h2>
              <p>Latest registered users</p>
            </div>
          <button
            className="text-button"
            onClick={() => navigate("/admin/users")}
          >
            View all →
          </button>
          </div>

          <div className="recent-list">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div className="recent-user" key={user.id}>

                  <div className="user-avatar">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.username}
                      />
                    ) : (
                      "👤"
                    )}
                  </div>

                  <div className="user-info">
                    <h3>{user.username}</h3>
                    <p>{user.joined}</p>
                  </div>

                </div>
              ))
            ) : (
              <p className="empty-message">
                {loading ? "Loading users..." : "No recent users found."}
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="dashboard-card activity-card">

        <div className="card-header">
          <div>
            <h2>Recent Activity</h2>
            <p>Latest activity across the platform</p>
          </div>
        </div>

        <div className="activity-list">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div className="activity-item" key={activity.id}>

                <div className={`activity-icon ${activity.type}`}>
                  {activityIcons[activity.type]}
                </div>

                <div className="activity-info">
                  <p>{activity.text}</p>
                  <span>{activity.time}</span>
                </div>

              </div>
            ))
          ) : (
            <p className="empty-message">
              {loading ? "Loading activity..." : "No recent activity found."}
            </p>
          )}
        </div>

      </div>

    </div>
  );
}

export default Dashboard;