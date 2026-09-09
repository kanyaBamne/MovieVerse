function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-title">
        Admin Panel
      </div>

      <div className="navbar-profile">
        <div className="profile-avatar">
          A
        </div>

        <div className="profile-info">
          <span className="profile-name">Admin</span>
          <span className="profile-role">Administrator</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;