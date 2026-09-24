import { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

function Users() {
    const [search, setSearch] = useState("");
    const [userToDelete, setUserToDelete] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
            user.username.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue) ||
            user.name.toLowerCase().includes(searchValue)
        );
    });

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            const response = await fetch(
                `http://localhost:5000/users/${userToDelete.id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete user");
            }

            // Remove the deleted user from the table
            setUsers((currentUsers) =>
                currentUsers.filter(
                    (user) => user.id !== userToDelete.id
                )
            );

            setUserToDelete(null);

        } catch (error) {
            console.error("Delete user error:", error);
            alert("Failed to delete user.");
        }
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
                        onChange={(e) => setSearch(e.target.value)}
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

                                        <p>
                                            {error}
                                        </p>
                                    </div>
                                </td>
                            </tr>

                        ) : filteredUsers.length > 0 ? (

                                filteredUsers.map((user) => (

                                    <tr key={user.id}>

                                        {/* User */}

                                        <td>
                                            <div className="user-table-info">

                                                <div className="user-table-avatar">
                                                    👤
                                                </div>

                                                <div>
                                                    <strong>
                                                        {user.username}
                                                    </strong>

                                                    <span>
                                                        {user.name}
                                                    </span>
                                                </div>

                                            </div>
                                        </td>


                                        {/* Email */}

                                        <td>
                                            {user.email}
                                        </td>


                                        {/* Joined */}

                                        <td>
                                            {user.joined}
                                        </td>


                                        {/* Status */}

                                        <td>

                                            <span
                                                className={`status-badge ${user.status.toLowerCase()
                                                    }`}
                                            >
                                                {user.status}
                                            </span>

                                        </td>


                                        {/* Actions */}

                                        <td>

                                            <div className="user-table-actions">

                                                <button
                                                    className="view-user-button"
                                                    onClick={() => setSelectedUser(user)}
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className="delete-user-button"
                                                    onClick={() =>
                                                        setUserToDelete(user)
                                                    }
                                                >
                                                    Delete
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
                        Showing {filteredUsers.length > 0 ? 1 : 0}–
                        {filteredUsers.length} of {users.length} users
                    </span>

                    <div className="pagination-buttons">

                        <button>←</button>

                        <button className="active-page">
                            1
                        </button>

                        <button>2</button>
                        <button>3</button>
                        <button>4</button>
                        <button>5</button>

                        <button>→</button>

                    </div>

                </div>

            </div>

            {/* View User Modal */}

            {selectedUser && (
                <div className="modal-overlay">
                    <div className="user-view-modal">

                        <div className="user-view-header">
                            <div>
                                <h2>User Details</h2>
                                <p>View registered user information.</p>
                            </div>

                            <button
                                className="modal-close-button"
                                onClick={() => setSelectedUser(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="user-view-content">

                            <div className="user-view-avatar">
                                👤
                            </div>

                            <div className="user-view-info">

                                <div className="user-detail">
                                    <span>Username</span>
                                    <strong>{selectedUser.username}</strong>
                                </div>

                                <div className="user-detail">
                                    <span>Name</span>
                                    <strong>{selectedUser.name}</strong>
                                </div>

                                <div className="user-detail">
                                    <span>Email</span>
                                    <strong>{selectedUser.email}</strong>
                                </div>

                                <div className="user-detail">
                                    <span>Status</span>
                                    <strong className="user-status">
                                        {selectedUser.status}
                                    </strong>
                                </div>

                                <div className="user-detail">
                                    <span>Joined</span>
                                    <strong>
                                        {new Date(
                                            selectedUser.joined
                                        ).toLocaleDateString()}
                                    </strong>
                                </div>

                            </div>

                        </div>

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


            {/* Delete Modal */}

            {userToDelete && (

                <ConfirmModal
                    title="Delete User?"
                    itemName={userToDelete.username}
                    onCancel={() => setUserToDelete(null)}
                    onConfirm={handleDeleteUser}
                />

            )}

        </div>
    );
}

export default Users;