import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await API.post("/users/login", {
                email,
                password
            });

            const token = res.data.token;

            // 🔥 store token
            localStorage.setItem("token", token);

            alert("Login successful ✅");

            // 🔥 redirect
            navigate("/dashboard");

        } catch (err) {
            console.log(err.response?.data || err.message);
            alert("Login failed ❌");
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;