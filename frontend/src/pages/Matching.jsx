import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Matching.css';

const Matching = () => {
    const [preferences, setPreferences] = useState({
        ageRange: [25, 35],
        location: '',
        interests: [],
        education: '',
        occupation: ''
    });

    const [matches, setMatches] = useState([
        {
            id: 1,
            name: 'Sarah Johnson',
            age: 28,
            compatibility: '95%',
            location: 'New York',
            interests: ['Travel', 'Photography', 'Cooking'],
            image: 'https://via.placeholder.com/150'
        },
        {
            id: 2,
            name: 'Michael Chen',
            age: 30,
            compatibility: '92%',
            location: 'San Francisco',
            interests: ['Music', 'Hiking', 'Technology'],
            image: 'https://via.placeholder.com/150'
        }
        // Add more mock matches as needed
    ]);

    const handlePreferenceChange = (e) => {
        const { name, value } = e.target;
        setPreferences(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement matching algorithm logic here
        console.log('Updated preferences:', preferences);
    };

    return (
        <motion.div 
            className="matching-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container">
                <motion.h1 
                    className="page-title"
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    Find Your Perfect Match
                </motion.h1>

                <div className="matching-content">
                    <motion.div 
                        className="preferences-section"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2>Your Preferences</h2>
                        <form onSubmit={handleSubmit}>
                            <motion.div 
                                className="form-group"
                                whileHover={{ scale: 1.02 }}
                            >
                                <label>Age Range</label>
                                <div className="age-range">
                                    <input
                                        type="number"
                                        name="ageMin"
                                        value={preferences.ageRange[0]}
                                        onChange={(e) => setPreferences(prev => ({
                                            ...prev,
                                            ageRange: [parseInt(e.target.value), prev.ageRange[1]]
                                        }))}
                                        min="18"
                                        max="70"
                                    />
                                    <span>to</span>
                                    <input
                                        type="number"
                                        name="ageMax"
                                        value={preferences.ageRange[1]}
                                        onChange={(e) => setPreferences(prev => ({
                                            ...prev,
                                            ageRange: [prev.ageRange[0], parseInt(e.target.value)]
                                        }))}
                                        min="18"
                                        max="70"
                                    />
                                </div>
                            </motion.div>

                            <motion.div 
                                className="form-group"
                                whileHover={{ scale: 1.02 }}
                            >
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={preferences.location}
                                    onChange={handlePreferenceChange}
                                    placeholder="Enter preferred location"
                                />
                            </motion.div>

                            <motion.div 
                                className="form-group"
                                whileHover={{ scale: 1.02 }}
                            >
                                <label>Education</label>
                                <select
                                    name="education"
                                    value={preferences.education}
                                    onChange={handlePreferenceChange}
                                >
                                    <option value="">Select Education Level</option>
                                    <option value="high-school">High School</option>
                                    <option value="bachelors">Bachelor's Degree</option>
                                    <option value="masters">Master's Degree</option>
                                    <option value="phd">Ph.D.</option>
                                </select>
                            </motion.div>

                            <motion.button
                                type="submit"
                                className="update-btn"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Update Preferences
                            </motion.button>
                        </form>
                    </motion.div>

                    <motion.div 
                        className="matches-section"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2>Your Matches</h2>
                        <AnimatePresence>
                            <div className="matches-grid">
                                {matches.map((match) => (
                                    <motion.div
                                        key={match.id}
                                        className="match-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        whileHover={{ 
                                            scale: 1.05,
                                            boxShadow: "0 8px 16px rgba(0,0,0,0.2)"
                                        }}
                                    >
                                        <div className="compatibility-badge">
                                            {match.compatibility}
                                        </div>
                                        <img src={match.image} alt={match.name} />
                                        <div className="match-info">
                                            <h3>{match.name}</h3>
                                            <p>{match.age} years • {match.location}</p>
                                            <div className="interests">
                                                {match.interests.map((interest, index) => (
                                                    <span key={index}>{interest}</span>
                                                ))}
                                            </div>
                                            <motion.button
                                                className="connect-btn"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Connect
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Matching; 