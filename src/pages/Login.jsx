import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed");
                return;
            }

            console.log("Login successful:", data.user);
            console.log("Profile image:", data.user.profileImage);

            // Save logged-in user/admin information
            sessionStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // Check the role returned by the backend
            if (data.user.role === "admin") {

                sessionStorage.setItem(
                    "admin",
                    JSON.stringify(data.user)
                );

                navigate("/admin");

            } else if (data.user.role === "user") {

                navigate("/");

            }

        } catch (error) {
            console.error("Login error:", error);

            alert("Unable to connect to the server.");
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">
                    🎬
                </div>

                <h1>MovieVerse</h1>

                <p className="login-subtitle">
                    Sign In
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

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

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Sign In
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;