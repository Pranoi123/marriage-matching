import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Search.css';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        ageRange: [18, 50],
        gender: '',
        location: '',
        interests: []
    });

    // Mock data for demonstration
    const mockProfiles = [
        {
            id: 1,
            name: 'John Doe',
            age: 28,
            location: 'New York',
            interests: ['Reading', 'Traveling', 'Cooking'],
            image: 'https://via.placeholder.com/150'
        },
        {
            id: 2,
            name: 'Jane Smith',
            age: 25,
            location: 'Los Angeles',
            interests: ['Photography', 'Yoga', 'Music'],
            image: 'https://via.placeholder.com/150'
        },
        // Add more mock profiles as needed
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search logic here
        console.log('Searching for:', searchTerm, filters);
    };

    return (
        <motion.div 
            className="search-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container">
                <motion.h1 
                    className="page-title"
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    Find Your Perfect Match
                </motion.h1>

                <motion.div 
                    className="search-container"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <form onSubmit={handleSearch} className="search-form">
                        <motion.div 
                            className="search-input-group"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <input
                                type="text"
                                placeholder="Search by name, location, or interests..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Search
                            </motion.button>
                        </motion.div>

                        <motion.div 
                            className="filters"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3>Filters</h3>
                            <div className="filter-group">
                                <label>Age Range</label>
                                <input
                                    type="range"
                                    min="18"
                                    max="50"
                                    value={filters.ageRange[1]}
                                    onChange={(e) => setFilters({
                                        ...filters,
                                        ageRange: [filters.ageRange[0], e.target.value]
                                    })}
                                />
                            </div>
                            <div className="filter-group">
                                <label>Gender</label>
                                <select
                                    value={filters.gender}
                                    onChange={(e) => setFilters({
                                        ...filters,
                                        gender: e.target.value
                                    })}
                                >
                                    <option value="">Any</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </motion.div>
                    </form>

                    <AnimatePresence>
                        <motion.div 
                            className="results-container"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            {mockProfiles.map((profile) => (
                                <motion.div
                                    key={profile.id}
                                    className="profile-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <img src={profile.image} alt={profile.name} />
                                    <div className="profile-info">
                                        <h3>{profile.name}</h3>
                                        <p>{profile.age} years old</p>
                                        <p>{profile.location}</p>
                                        <div className="interests">
                                            {profile.interests.map((interest, index) => (
                                                <span key={index}>{interest}</span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Search; 