import { useEffect, useState } from "react";

function Users() {
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:5000/users"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }

                const data = await response.json();

                setUsers(data.users || []);
            } catch (err) {
                console.error("Users error:", err);
                setError("Unable to load users.");
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const searchValue = search.toLowerCase();

        return (
            (user.username || "")
                .toLowerCase()
                .includes(searchValue) ||
            (user.email || "")
                .toLowerCase()
                .includes(searchValue) ||
            (user.name || "")
                .toLowerCase()
                .includes(searchValue)
        );
    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / usersPerPage)
    );

    const startIndex = (currentPage - 1) * usersPerPage;

    const paginatedUsers = filteredUsers.slice(
        startIndex,
        startIndex + usersPerPage
    );

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) {
            return;
        }

        setCurrentPage(page);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2)
        );

        let endPage = Math.min(
            totalPages,
            startPage + maxVisiblePages - 1
        );

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(
                1,
                endPage - maxVisiblePages + 1
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };



    return (
        <div className="users-page">

            {/* Page Header */}

            <div className="page-header">
                <h1>Users</h1>
                <p>Manage registered users on your platform.</p>
            </div>


            {/* Search */}

            <div className="user-search-card">

                <div className="search-box">
                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search by username or email..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

            </div>


            {/* Users Table */}

            <div className="users-table-card">

                <div className="users-table-wrapper">

                    <table className="users-table">

                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Joined</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>
                                    <td colSpan="5">
                                        <div className="empty-state">
                                            <span>⏳</span>

                                            <h3>Loading users...</h3>

                                            <p>
                                                Fetching users from the database.
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                            ) : error ? (

                                <tr>
                                    <td colSpan="5">
                                        <div className="empty-state">
                                            <span>⚠️</span>

                                            <h3>Unable to load users</h3>

                                            <p>{error}</p>
                                        </div>
                                    </td>
                                </tr>

                            ) : filteredUsers.length > 0 ? (

                                paginatedUsers.map((user) => (

                                    <tr key={user.id}>

                                        {/* User */}

                                        <td>
                                            <div className="user-table-info">

                                                <div className="user-table-avatar">
                                                    👤
                                                </div>

                                                <div>
                                                    <strong>
                                                        {user.username || "-"}
                                                    </strong>

                                                    <span>
                                                        {user.name || "-"}
                                                    </span>
                                                </div>

                                            </div>
                                        </td>


                                        {/* Email */}

                                        <td>
                                            {user.email || "-"}
                                        </td>


                                        {/* Joined */}

                                        <td>
                                            {user.joined || user.createdAt || "-"}
                                        </td>


                                        {/* Status */}

                                        <td>

                                            <span
                                                className={`status-badge ${(
                                                    user.status || "active"
                                                ).toLowerCase()}`}
                                            >
                                                {user.status || "active"}
                                            </span>

                                        </td>


                                        {/* Actions */}

                                        <td>

                                            <div className="user-table-actions">

                                                <button
                                                    className="view-user-button"
                                                    onClick={() =>
                                                        setSelectedUser(user)
                                                    }
                                                >
                                                    View
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="5">

                                        <div className="empty-state">
                                            <span>🔍</span>

                                            <h3>No users found</h3>

                                            <p>
                                                Try changing your search.
                                            </p>
                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* Pagination */}

                <div className="pagination">

                    <span>
                        {filteredUsers.length > 0
                            ? `Showing ${startIndex + 1}–${Math.min(
                                startIndex + usersPerPage,
                                filteredUsers.length
                            )} of ${filteredUsers.length} users`
                            : "Showing 0 users"}
                    </span>

                    <div className="pagination-buttons">

                        {/* Previous */}
                        <button
                            onClick={() =>
                                handlePageChange(currentPage - 1)
                            }
                            disabled={currentPage === 1}
                        >
                            ←
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((page) => (
                            <button
                                key={page}
                                className={
                                    currentPage === page
                                        ? "active-page"
                                        : ""
                                }
                                onClick={() =>
                                    handlePageChange(page)
                                }
                            >
                                {page}
                            </button>
                        ))}

                        {/* Next */}
                        <button
                            onClick={() =>
                                handlePageChange(currentPage + 1)
                            }
                            disabled={currentPage === totalPages}
                        >
                            →
                        </button>

                    </div>

                </div>

            </div>


            {/* View User Modal */}

            {selectedUser && (
                <div className="modal-overlay">

                    <div className="user-view-modal">

                        {/* Header */}

                        <div className="user-view-header">

                            <div>
                                <h2>User Details</h2>

                                <p>
                                    Complete information about this user.
                                </p>
                            </div>

                            <button
                                className="modal-close-button"
                                onClick={() => setSelectedUser(null)}
                            >
                                ×
                            </button>

                        </div>


                        {/* User Details */}

                        <div className="user-view-content">

                            <div className="user-view-avatar">

                                {selectedUser.profileImage ? (
                                    <img
                                        src={
                                            selectedUser.profileImage.startsWith("http")
                                                ? selectedUser.profileImage
                                                : `http://localhost:5000${selectedUser.profileImage}`
                                        }
                                        alt={selectedUser.name || selectedUser.username}
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    "👤"
                                )}

                            </div>


                            <div className="user-view-info">

                                <div className="user-detail">
                                    <span>User ID</span>
                                    <strong>{selectedUser.id}</strong>
                                </div>

                                <div className="user-detail">
                                    <span>Username</span>
                                    <strong>{selectedUser.username || "-"}</strong>
                                </div>

                                <div className="user-detail">
                                    <span>Name</span>
                                    <strong>{selectedUser.name || "-"}</strong>
                                </div>

                                <div className="user-detail">
                                    <span>Email</span>
                                    <strong>{selectedUser.email || "-"}</strong>
                                </div>

                                <div className="user-detail">
                                    <span>Bio</span>
                                    <strong>{selectedUser.bio || "-"}</strong>
                                </div>

                                <div className="user-detail">
                                    <span>Role</span>
                                    <strong>{selectedUser.role || "-"}</strong>
                                </div>

                                <div className="user-detail">
                                    <span>Status</span>
                                    <strong className="user-status">
                                        {selectedUser.status || "-"}
                                    </strong>
                                </div>

                                <div className="user-detail">
                                    <span>Joined</span>
                                    <strong>
                                        {selectedUser.createdAt
                                            ? new Date(
                                                selectedUser.createdAt
                                            ).toLocaleString()
                                            : "-"}
                                    </strong>
                                </div>

                                <div className="user-detail">
                                    <span>Last Updated</span>
                                    <strong>
                                        {selectedUser.updatedAt
                                            ? new Date(
                                                selectedUser.updatedAt
                                            ).toLocaleString()
                                            : "-"}
                                    </strong>
                                </div>



                            </div>

                        </div>


                        {/* Footer */}

                        <div className="user-view-footer">

                            <button
                                className="close-user-button"
                                onClick={() => setSelectedUser(null)}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}

export default Users;
