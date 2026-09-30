import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import "../UserHome.css";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    username,
                    email,
                    password,
                }),
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

            <UserNavbar />

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