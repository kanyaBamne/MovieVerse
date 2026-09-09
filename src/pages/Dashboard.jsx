import StatCard from "../components/StarCard";

function Dashboard() {
  const stats = [
    {
      title: "Total Movies",
      value: "5,000",
      icon: "🎬",
      change: "+12 this month",
    },
    {
      title: "Total Users",
      value: "1,284",
      icon: "👥",
      change: "+86 this month",
    },
    {
      title: "Average Rating",
      value: "7.8",
      icon: "⭐",
      change: "Across all movies",
    },
    {
      title: "Reviews",
      value: "3,642",
      icon: "📝",
      change: "+124 this month",
    },
  ];

  const recentMovies = [
    {
      id: 1,
      title: "Interstellar",
      year: 2014,
      genre: "Sci-Fi / Drama",
      rating: "8.7",
    },
    {
      id: 2,
      title: "Parasite",
      year: 2019,
      genre: "Drama / Thriller",
      rating: "8.5",
    },
    {
      id: 3,
      title: "Inception",
      year: 2010,
      genre: "Sci-Fi / Thriller",
      rating: "8.8",
    },
    {
      id: 4,
      title: "The Dark Knight",
      year: 2008,
      genre: "Action / Crime",
      rating: "9.0",
    },
    {
      id: 5,
      title: "Whiplash",
      year: 2014,
      genre: "Drama / Music",
      rating: "8.5",
    },
  ];

  const recentUsers = [
    {
      id: 1,
      username: "alex_23",
      joined: "Joined today",
    },
    {
      id: 2,
      username: "moviebuff99",
      joined: "Joined yesterday",
    },
    {
      id: 3,
      username: "sara_movies",
      joined: "Joined 2 days ago",
    },
    {
      id: 4,
      username: "cinephile",
      joined: "Joined 3 days ago",
    },
    {
      id: 5,
      username: "john_doe",
      joined: "Joined 4 days ago",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "user",
      text: "alex_23 joined the platform",
      time: "2m ago",
    },
    {
      id: 2,
      type: "movie",
      text: "Interstellar was added to the catalogue",
      time: "18m ago",
    },
    {
      id: 3,
      type: "review",
      text: "sara_movies reviewed Parasite",
      time: "32m ago",
    },
    {
      id: 4,
      type: "movie",
      text: "Inception's details were updated",
      time: "1h ago",
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
          <p>Welcome back, Admin. Here's what's happening with your movie platform.</p>
        </div>
      </div>

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

            <button className="text-button">
              View all →
            </button>
          </div>

          <div className="recent-list">
            {recentMovies.map((movie) => (
              <div className="recent-movie" key={movie.id}>

                <div className="movie-poster-placeholder">
                  🎬
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
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Recent Users</h2>
              <p>Latest registered users</p>
            </div>

            <button className="text-button">
              View all →
            </button>
          </div>

          <div className="recent-list">
            {recentUsers.map((user) => (
              <div className="recent-user" key={user.id}>

                <div className="user-avatar">
                  👤
                </div>

                <div className="user-info">
                  <h3>{user.username}</h3>
                  <p>{user.joined}</p>
                </div>

              </div>
            ))}
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
          {recentActivity.map((activity) => (
            <div className="activity-item" key={activity.id}>

              <div className={`activity-icon ${activity.type}`}>
                {activityIcons[activity.type]}
              </div>

              <div className="activity-info">
                <p>{activity.text}</p>
                <span>{activity.time}</span>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

export default Dashboard;