import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {

  // useState hook variables for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // handleLogin function
  const handleLogin = () => {
    console.log("Login button clicked!");
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Login</h2>

            {/* Input elements */}
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {/* Login button */}
            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handleLogin}
            >
              Login
            </button>

            <p className="mt-4 text-center">
              New here? <a href="/app/register" className="text-primary">Register Here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;
