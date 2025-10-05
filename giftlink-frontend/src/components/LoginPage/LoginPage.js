import React, { useState, useEffect } from 'react';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState('');
    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('bearer-token');
    const { setIsLoggedIn } = useAppContext();

    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
          navigate('/app');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        //api call
        const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        });

        const json = await res.json();
        console.log('Json', json);
        
        if (json.authtoken) {
            sessionStorage.setItem('auth-token', json.authtoken);
            sessionStorage.setItem('name', json.userName);
            sessionStorage.setItem('email', json.userEmail);
            setIsLoggedIn(true);
            navigate('/app');
        } else {
            setEmail('');
            setPassword('');
            setIncorrect("Invalid email or password. Please try again.");
            setTimeout(() => {
                setIncorrect("");
            }, 3000);
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <div className="card-header auth-header">
                    <h2 className="card-title">Welcome Back to GiftLink</h2>
                    <p className="card-subtitle">Sign in to your account</p>
                </div>
                
                <div className="card-body auth-body">
                    {incorrect && (
                        <div className="alert alert-danger">
                            {incorrect}
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setIncorrect(""); }}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setIncorrect(""); }}
                                required
                            />
                        </div>
                        
                        <div className="form-group mb-4">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="rememberMe" />
                                <label className="form-check-label" htmlFor="rememberMe">
                                    Remember me
                                </label>
                            </div>
                        </div>
                        
                        <button type="submit" className="btn btn-primary w-100 mb-3">Sign In</button>
                        
                        <div className="text-center mt-4 mb-3">
                            <a href="#" className="text-primary">Forgot your password?</a>
                        </div>
                    </form>
                </div>
                
                <div className="card-footer auth-footer">
                    <p>Don't have an account? <Link to="/app/register" className="text-primary">Register Here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;