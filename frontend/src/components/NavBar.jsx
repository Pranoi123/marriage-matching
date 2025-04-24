import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/register', label: 'Register' },
        { path: '/search', label: 'Search' },
        { path: '/matching', label: 'Matching' },
        { path: '/stories', label: 'Stories' },
        { path: '/contact', label: 'Contact' }
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/" className="brand-link">
                        Marriage Matching
                    </Link>
                </div>
                
                <div className="navbar-links">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="navbar-auth">
                    <Link to="/login" className="auth-link login">
                        Login
                    </Link>
                    <Link to="/register" className="auth-link register">
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
  