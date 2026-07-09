import './Login.css'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {

    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        phone,
                        password,
                    }),
                }
            );

            const user = await response.json();

            if (!response.ok) {
                throw new Error(user.message || "Login failed");
            }

            console.log("Login User:", user);

            // Save user data
            localStorage.setItem("email", user.email);
            localStorage.setItem("phone", user.phone);
            localStorage.setItem("fullname", user.fullname);

            navigate("/Dashboard");

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <>
            <div id="main_container">

                {/* LEFT LOGIN BOX */}
                <div id="side_container_login">

                    {/* LOGO */}
                    <div id="logo_section">

                        <div id="logo_circle">
                            ⚙
                        </div>

                        <div>
                            <h2 id="logo_text">ATS</h2>
                            <p id="logo_subtext">Mini Application tracker</p>
                        </div>

                    </div>

                    {/* HEADING */}
                    <h1 id="header_login">
                        Welcome Back 👋
                    </h1>

                    <p id="sub_text">
                        Login to continue ...
                    </p>

                    <form onSubmit={handleSubmit}>

                        {/* PHONE */}
                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            className="input_box"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />

                        {/* PASSWORD */}
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="input_box"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* LOGIN BUTTON */}
                        <button id="login_button" type="submit">
                            Login
                        </button>

                    </form>

                    {/* OPTIONS */}
                    <div id="extra_options">

                        <p id="forgot_password">
                            Forgot Password?
                        </p>

                    </div>

                    {/* DIVIDER */}
                    <div id="divider">
                        <span></span>
                        OR
                        <span></span>
                    </div>

                    {/* REGISTER */}
                    <p id="register_text">
                        Don’t have an account?
                        <Link to="/Registration"> Register</Link>
                    </p>

                </div>

                {/* RIGHT SIDE LOTTIE */}
                <div id="animation_container_login">

                    <DotLottieReact
                        src="https://lottie.host/c2731230-298f-4c24-a104-033bfaf1ffa3/pXu3fHS13m.lottie"
                        loop
                        autoplay
                    />

                </div>

            </div>
        </>
    );
}

export default Login;