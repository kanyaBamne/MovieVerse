import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileLists() {
    const navigate = useNavigate();

    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] =
        useState("");

    const [isPrivate, setIsPrivate] =
        useState(false);

    const [creating, setCreating] =
        useState(false);

    // ==========================================
    // GET USER LISTS
    // ==========================================

    const fetchLists = async () => {
        try {
            const storedUser =
                sessionStorage.getItem("user");

            if (!storedUser) {
                setLoading(false);
                return;
            }

            const loggedInUser =
                JSON.parse(storedUser);

            const userId =
                loggedInUser.id ||
                loggedInUser._id;

            if (!userId) {
                setLoading(false);
                return;
            }

            const response = await fetch(
                `http://localhost:5000/userlists/${userId}`
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load lists"
                );
            }

            setLists(data.lists || []);

        } catch (error) {
            console.error(
                "Lists error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLists();
    }, []);

    // ==========================================
    // CREATE LIST
    // ==========================================

    const handleCreateList = async (e) => {
        e.preventDefault();

        try {
            const storedUser =
                sessionStorage.getItem("user");

            if (!storedUser) {
                alert("Please login first.");
                return;
            }

            const loggedInUser =
                JSON.parse(storedUser);

            const userId =
                loggedInUser.id ||
                loggedInUser._id;

            if (!userId) {
                alert(
                    "User ID not found. Please login again."
                );
                return;
            }

            if (!title.trim()) {
                alert(
                    "Please enter a list name."
                );
                return;
            }

            setCreating(true);

            const response = await fetch(
                "http://localhost:5000/userlists",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        userId: userId,
                        title: title.trim(),
                        description:
                            description.trim(),
                        isPrivate: isPrivate
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to create list"
                );
            }

            setLists((previousLists) => [
                data.list,
                ...previousLists
            ]);

            setTitle("");
            setDescription("");
            setIsPrivate(false);

            setShowCreateForm(false);

        } catch (error) {
            console.error(
                "Create list error:",
                error
            );

            alert(
                error.message ||
                "Failed to create list."
            );
        } finally {
            setCreating(false);
        }
    };

    // ==========================================
    // REMOVE MOVIE FROM LIST
    // ==========================================

    const handleRemoveMovie = async (
        listId,
        movieId,
        movieTitle
    ) => {
        const confirmRemove = window.confirm(
            `Remove "${movieTitle}" from this list?`
        );

        if (!confirmRemove) {
            return;
        }

        try {
            const storedUser =
                sessionStorage.getItem("user");

            if (!storedUser) {
                alert("Please login first.");
                return;
            }

            const loggedInUser =
                JSON.parse(storedUser);

            const userId =
                loggedInUser.id ||
                loggedInUser._id;

            if (!userId) {
                alert(
                    "User ID not found. Please login again."
                );
                return;
            }

            const response = await fetch(
                `http://localhost:5000/userlists/${listId}/movies/${movieId}`,
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        userId: userId
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to remove movie"
                );
            }

            setLists((previousLists) =>
                previousLists.map((list) => {

                    if (list.id !== listId) {
                        return list;
                    }

                    const updatedMovies =
                        (list.movies || []).filter(
                            (movie) =>
                                movie.id !== movieId
                        );

                    return {
                        ...list,
                        movies: updatedMovies,
                        movieCount:
                            updatedMovies.length
                    };
                })
            );

        } catch (error) {
            console.error(
                "Remove movie error:",
                error
            );

            alert(
                error.message ||
                "Failed to remove movie."
            );
        }
    };

    // ==========================================
    // DELETE ENTIRE LIST
    // ==========================================

    const handleDeleteList = async (
        listId,
        listTitle
    ) => {
        const confirmDelete = window.confirm(
            `Delete "${listTitle}" permanently?\n\nThis will remove the entire list.`
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const storedUser =
                sessionStorage.getItem("user");

            if (!storedUser) {
                alert("Please login first.");
                return;
            }

            const loggedInUser =
                JSON.parse(storedUser);

            const userId =
                loggedInUser.id ||
                loggedInUser._id;

            if (!userId) {
                alert(
                    "User ID not found. Please login again."
                );
                return;
            }

            const response = await fetch(
                `http://localhost:5000/userlists/${listId}`,
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        userId: userId
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete list"
                );
            }

            setLists((previousLists) =>
                previousLists.filter(
                    (list) =>
                        list.id !== listId
                )
            );

            alert(
                "List deleted successfully."
            );

        } catch (error) {
            console.error(
                "Delete list error:",
                error
            );

            alert(
                error.message ||
                "Failed to delete list."
            );
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <section className="profile-lists-page">

                <div className="profile-lists-loading">

                    <div className="lists-spinner">
                    </div>

                    <p>
                        Loading your lists...
                    </p>

                </div>

            </section>
        );
    }

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <section className="profile-lists-page">

            {/* ==================================
                PAGE HEADER
            ================================== */}

            <div className="profile-lists-top">

                <div>

                    <h1>
                        My Lists
                    </h1>

                    <p>
                        Organize your favourite movies
                        into collections.
                    </p>

                </div>

                <button
                    className="profile-lists-create-top"
                    onClick={() =>
                        setShowCreateForm(true)
                    }
                >
                    + Create List
                </button>

            </div>

            {/* ==================================
                LISTS
            ================================== */}

            {lists.length === 0 ? (

                <div className="profile-lists-empty">

                    <div className="lists-empty-icon">
                        +
                    </div>

                    <h2>
                        No lists yet
                    </h2>

                    <p>
                        Create your first movie list
                        and start building your
                        collection.
                    </p>

                    <button
                        onClick={() =>
                            setShowCreateForm(true)
                        }
                    >
                        Create Your First List
                    </button>

                </div>

            ) : (

                <div className="profile-lists-grid">

                    {lists.map((list) => (

                        <article
                            className="profile-list-card"
                            key={list.id}
                        >

                            {/* ==================================
                                LIST HEADER
                            ================================== */}

                            <div className="profile-list-header">

                                <div className="profile-list-title-area">

                                    <h2>
                                        {list.title}
                                    </h2>

                                    {list.description && (
                                        <p>
                                            {list.description}
                                        </p>
                                    )}

                                </div>

                                <div className="profile-list-header-right">

                                    <div className="profile-list-count">

                                        <strong>
                                            {list.movieCount || 0}
                                        </strong>

                                        <span>
                                            {list.movieCount === 1
                                                ? "film"
                                                : "films"}
                                        </span>

                                        {list.isPrivate && (
                                            <span
                                                className="profile-list-private"
                                                title="Private list"
                                            >
                                                🔒
                                            </span>
                                        )}

                                    </div>

                                    {/* DELETE LIST */}

                                    <button
                                        className="profile-list-delete-button"
                                        onClick={() =>
                                            handleDeleteList(
                                                list.id,
                                                list.title
                                            )
                                        }
                                        title="Delete list"
                                    >
                                        🗑
                                    </button>

                                </div>

                            </div>

                            {/* ==================================
                                MOVIE POSTERS
                            ================================== */}

                            <div className="profile-list-posters">

                                {list.movies &&
                                list.movies.length > 0 ? (

                                    list.movies.map(
                                        (movie) => (

                                            <div
                                                className="profile-list-poster"
                                                key={movie.id}
                                            >

                                                {/* POSTER */}

                                                <img
                                                    src={
                                                        movie.poster
                                                    }
                                                    alt={
                                                        movie.title
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/movies/${movie.id}`
                                                        )
                                                    }
                                                />

                                                {/* REMOVE MOVIE */}

                                                <button
                                                    className="profile-list-remove-movie"
                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        handleRemoveMovie(
                                                            list.id,
                                                            movie.id,
                                                            movie.title
                                                        );

                                                    }}
                                                    title="Remove from list"
                                                >
                                                    ×
                                                </button>

                                            </div>

                                        )
                                    )

                                ) : (

                                    <div className="profile-list-empty-movies">

                                        <span>
                                            +
                                        </span>

                                        <p>
                                            No movies in
                                            this list yet
                                        </p>

                                    </div>

                                )}

                            </div>

                            {/* ==================================
                                LIST FOOTER
                            ================================== */}

                            <div className="profile-list-footer">

                                <span>
                                    {list.likesCount || 0} likes
                                </span>

                                <span>
                                    {list.movieCount || 0}{" "}
                                    {list.movieCount === 1
                                        ? "movie"
                                        : "movies"}
                                </span>

                            </div>

                        </article>

                    ))}

                </div>

            )}

            {/* ==================================
                CREATE LIST MODAL
            ================================== */}

            {showCreateForm && (

                <div className="profile-list-modal-overlay">

                    <div className="profile-list-modal">

                        <div className="profile-list-modal-header">

                            <div>

                                <span>
                                    NEW COLLECTION
                                </span>

                                <h2>
                                    Create a List
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCreateForm(
                                        false
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={
                                handleCreateList
                            }
                        >

                            {/* LIST NAME */}

                            <div className="profile-list-form-group">

                                <label>
                                    List name
                                </label>

                                <input
                                    type="text"
                                    placeholder="My All Time Favourite Movies"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                    maxLength={80}
                                    autoFocus
                                />

                            </div>

                            {/* DESCRIPTION */}

                            <div className="profile-list-form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    placeholder="What is this list about?"
                                    value={
                                        description
                                    }
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                    rows="4"
                                    maxLength={250}
                                />

                            </div>

                            {/* PRIVATE LIST */}

                            <label className="profile-list-private-option">

                                <input
                                    type="checkbox"
                                    checked={
                                        isPrivate
                                    }
                                    onChange={(e) =>
                                        setIsPrivate(
                                            e.target.checked
                                        )
                                    }
                                />

                                <div>

                                    <strong>
                                        Make this list private
                                    </strong>

                                    <span>
                                        Only you can see
                                        this list.
                                    </span>

                                </div>

                            </label>

                            {/* FORM BUTTONS */}

                            <div className="profile-list-form-actions">

                                <button
                                    type="button"
                                    className="profile-list-cancel"
                                    onClick={() =>
                                        setShowCreateForm(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="profile-list-create"
                                    disabled={
                                        creating
                                    }
                                >
                                    {creating
                                        ? "Creating..."
                                        : "Create List"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </section>
    );
}

export default ProfileLists;