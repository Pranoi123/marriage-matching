import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import Register from './pages/Register';
import Search from './pages/Search';
import Matching from './pages/Matching';
// import Stories from './pages/Stories';
// import Contact from './pages/Contact';
// import Login from './pages/Login';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/matching" element={<Matching />} />
                        <Route path="/stories" element={<Stories />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};


export default App;