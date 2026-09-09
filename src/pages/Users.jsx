import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

function Users() {
    const [search, setSearch] = useState("");
    const [userToDelete, setUserToDelete] = useState(null);

    const users = [
        {
            id: 1,
            username: "alex_23",
            name: "Alex",
            email: "alex23@email.com",
            joined: "Sep 9, 2026",
            status: "Active",
        },
        {
            id: 2,
            username: "moviebuff99",
            name: "Movie Buff",
            email: "moviebuff99@email.com",
            joined: "Sep 8, 2026",
            status: "Active",
        },
        {
            id: 3,
            username: "sara_movies",
            name: "Sara",
            email: "sara_movies@email.com",
            joined: "Sep 7, 2026",
            status: "Active",
        },
        {
            id: 4,
            username: "cinephile",
            name: "Cinephile",
            email: "cinephile@email.com",
            joined: "Sep 6, 2026",
            status: "Inactive",
        },
        {
            id: 5,
            username: "john_doe",
            name: "John Doe",
            email: "john@email.com",
            joined: "Sep 5, 2026",
            status: "Active",
        },
        {
            id: 6,
            username: "filmfan",
            name: "Film Fan",
            email: "filmfan@email.com",
            joined: "Sep 4, 2026",
            status: "Active",
        },
        {
            id: 7,
            username: "screenqueen",
            name: "Screen Queen",
            email: "screenqueen@email.com",
            joined: "Sep 3, 2026",
            status: "Active",
        },
        {
            id: 8,
            username: "reeladdict",
            name: "Reel Addict",
            email: "reeladdict@email.com",
            joined: "Sep 2, 2026",
            status: "Inactive",
        },
    ];

    const filteredUsers = users.filter((user) => {
        const searchValue = search.toLowerCase();

        return (
            user.username.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue) ||
            user.name.toLowerCase().includes(searchValue)
        );
    });

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

                            {filteredUsers.length > 0 ? (

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
                                                    onClick={() =>
                                                        console.log(
                                                            "Viewing user:",
                                                            user
                                                        )
                                                    }
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
                        {filteredUsers.length} of 1,284 users
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


            {/* Delete Modal */}

            {userToDelete && (

                <ConfirmModal
                    title="Delete User?"
                    itemName={userToDelete.username}
                    onCancel={() => setUserToDelete(null)}
                    onConfirm={() => {
                        console.log(
                            "Deleting user:",
                            userToDelete
                        );

                        setUserToDelete(null);
                    }}
                />

            )}

        </div>
    );
}

export default Users;