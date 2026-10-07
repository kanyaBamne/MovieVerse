import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../UserHome.css";
import PageNavigation from "../components/PageNavigation";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [bio, setBio] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("name", name);
            formData.append("username", username);
            formData.append("email", email);
            formData.append("bio", bio);
            formData.append("password", password);

            if (profileImage) {
                formData.append("profileImage", profileImage);
            }

            const response = await fetch(
                "http://localhost:5000/register",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Registration failed");
                return;
            }

            alert("Registration successful!");

            navigate("/login");

        } catch (error) {
            console.error("Registration error:", error);

            alert("Unable to connect to the server.");
        }
    };

    return (
        <div className="register-page">

            <PageNavigation to="/" />

            <main className="register-main">

                <div className="register-card">

                    <div className="register-brand">
                        MOVIEVERSE
                    </div>

                    <h1>Create your account</h1>

                    <p className="register-description">
                        Join MovieVerse and keep track of the movies you love.
                    </p>

                    <form onSubmit={handleSubmit}>

                        {/* Full Name + Username */}

                        <div className="register-form-row">

                            <div className="register-form-group">
                                <label htmlFor="name">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="register-form-group">
                                <label htmlFor="username">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                />
                            </div>

                        </div>


                        {/* Email */}

                        <div className="register-form-group">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>


                        {/* Profile Image */}

                        <div className="register-form-group">
                            <label htmlFor="profileImage">
                                Profile Image
                            </label>

                            <div className="profile-image-upload">
                                <input
                                    type="file"
                                    id="profileImage"
                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                    onChange={(e) =>
                                        setProfileImage(
                                            e.target.files[0] || null
                                        )
                                    }
                                />

                                <span className="profile-image-help">
                                    JPG, PNG or WEBP
                                </span>
                            </div>
                        </div>


                        {/* Bio */}

                        <div className="register-form-group">
                            <label htmlFor="bio">
                                Bio
                            </label>

                            <textarea
                                id="bio"
                                className="register-bio"
                                placeholder="Tell us a little about yourself"
                                value={bio}
                                onChange={(e) =>
                                    setBio(e.target.value)
                                }
                                rows="4"
                                maxLength="250"
                            />

                            <div className="bio-counter">
                                {bio.length}/250
                            </div>
                        </div>


                        {/* Password + Confirm Password */}

                        <div className="register-form-row">

                            <div className="register-form-group">
                                <label htmlFor="password">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="register-form-group">
                                <label htmlFor="confirmPassword">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>

                        </div>


                        <button
                            type="submit"
                            className="register-submit-button"
                        >
                            Join MovieVerse
                        </button>

                    </form>


                    <div className="register-login">

                        <span>
                            Already have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            Sign in
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Register;