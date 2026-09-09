import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-section">
        <Navbar />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;