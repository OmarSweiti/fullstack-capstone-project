import React, { useState } from 'react';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState('');
    
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    const handleRegister = async () => {
        // Basic validation
        if (!firstName || !lastName || !email || !password) {
            setShowerr('Please fill in all fields');
            return;
        }
        
        if (!/\S+@\S+\.\S+/.test(email)) {
            setShowerr('Please enter a valid email address');
            return;
        }
        
        if (password.length < 6) {
            setShowerr('Password must be at least 6 characters long');
            return;
        }

        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            });

            const json = await response.json();
            console.log('json data', json);
            
            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', `${firstName} ${lastName}`);
                sessionStorage.setItem('email', json.email);
                setIsLoggedIn(true);
                navigate('/app');
            } else if (json.error) {
                setShowerr(json.error);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setShowerr('An error occurred during registration. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <div className="card-header auth-header">
                    <h2 className="card-title">Join GiftLink</h2>
                    <p className="card-subtitle">Create your account to get started</p>
                </div>
                
                <div className="card-body auth-body">
                    {showerr && (
                        <div className="alert alert-danger">
                            {showerr}
                        </div>
                    )}
                    
                    <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="firstName" className="form-label">First Name</label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        className="form-control"
                                        placeholder="First name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form-label">Last Name</label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        className="form-control"
                                        placeholder="Last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="form-group mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-group mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <small className="form-text text-muted">Password must be at least 6 characters long</small>
                        </div>
                        
                        <div className="form-group mb-4">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="terms" required />
                                <label className="form-check-label" htmlFor="terms">
                                    I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>
                                </label>
                            </div>
                        </div>
                        
                        <button type="submit" className="btn btn-primary w-100">Create Account</button>
                    </form>
                </div>
                
                <div className="card-footer auth-footer">
                    <p>Already have an account? <a href="/app/login" className="text-primary">Sign In</a></p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;