CREATE DATABASE MarriageMatching;
USE MarriageMatching;
-- Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    gender ENUM('Male', 'Female', 'Other'),
    dob DATE,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15) UNIQUE,
    password_hash VARCHAR(255),
    city VARCHAR(50),
    country VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Profiles Table (Extended user details)
CREATE TABLE Profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    bio TEXT,
    religion VARCHAR(50),
    caste VARCHAR(50),
    education VARCHAR(100),
    occupation VARCHAR(100),
    income_range VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
-- Preferences Table (Partner preferences)
CREATE TABLE Preferences (
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    preferred_age_min INT,
    preferred_age_max INT,
    preferred_religion VARCHAR(50),
    preferred_caste VARCHAR(50),
    preferred_education VARCHAR(100),
    preferred_occupation VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
-- Hobbies Table (New)
CREATE TABLE Hobbies (
    hobby_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    hobby_name VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
CREATE TABLE EducationDetails (
    edu_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    degree VARCHAR(100),
    university VARCHAR(100),
    graduation_year YEAR,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
-- Family Details Table (New)
CREATE TABLE FamilyDetails (
    family_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    siblings_count INT,
    family_income VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
-- Profile Views Table (New)
CREATE TABLE ProfileViews (
    view_id INT AUTO_INCREMENT PRIMARY KEY,
    viewer_id INT,
    viewed_id INT,
    view_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (viewer_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (viewed_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
-- Matches Table (Stores successful matches)
CREATE TABLE Matches (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT,
    user2_id INT,
    match_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
    FOREIGN KEY (user1_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
desc Matches;
INSERT INTO Users (
        first_name,
        last_name,
        gender,
        dob,
        email,
        phone,
        password_hash,
        city,
        country
    )
VALUES (
        'Rahul',
        'Sharma',
        'Male',
        '1992-06-15',
        'rahul.sharma@email.com',
        '9876543210',
        'hashed_password1',
        'Mumbai',
        'India'
    ),
    (
        'Priya',
        'Agarwal',
        'Female',
        '1995-02-20',
        'priya.agarwal@email.com',
        '8765432109',
        'hashed_password2',
        'Delhi',
        'India'
    ),
    (
        'Amit',
        'Kumar',
        'Male',
        '1990-11-10',
        'amit.kumar@email.com',
        '7654321098',
        'hashed_password3',
        'Bangalore',
        'India'
    ),
    (
        'Neha',
        'Verma',
        'Female',
        '1994-09-25',
        'neha.verma@email.com',
        '6543210987',
        'hashed_password4',
        'Pune',
        'India'
    ),
    (
        'Rohan',
        'Singh',
        'Male',
        '1993-07-05',
        'rohan.singh@email.com',
        '5432109876',
        'hashed_password5',
        'Chennai',
        'India'
    );
INSERT INTO Profiles (
        user_id,
        bio,
        religion,
        caste,
        education,
        occupation,
        income_range
    )
VALUES (
        1,
        'Software Engineer, loves trekking',
        'Hindu',
        'Brahmin',
        'B.Tech',
        'Software Engineer',
        '10L-15L'
    ),
    (
        2,
        'Doctor, interested in books',
        'Hindu',
        'Agarwal',
        'MBBS',
        'Doctor',
        '15L-20L'
    ),
    (
        3,
        'Entrepreneur, likes travel',
        'Hindu',
        'Kshatriya',
        'MBA',
        'Business Owner',
        '20L-30L'
    ),
    (
        4,
        'Data Scientist, foodie',
        'Hindu',
        'Gupta',
        'M.Tech',
        'Data Scientist',
        '12L-18L'
    ),
    (
        5,
        'Banker, enjoys photography',
        'Hindu',
        'Rajput',
        'B.Com',
        'Bank Manager',
        '8L-12L'
    );
INSERT INTO Preferences (
        user_id,
        preferred_age_min,
        preferred_age_max,
        preferred_religion,
        preferred_caste,
        preferred_education,
        preferred_occupation
    )
VALUES (1, 25, 30, 'Hindu', 'Agarwal', 'MBBS', 'Doctor'),
    (
        2,
        26,
        32,
        'Hindu',
        'Brahmin',
        'B.Tech',
        'Software Engineer'
    ),
    (
        3,
        24,
        29,
        'Hindu',
        'Kshatriya',
        'MBA',
        'Business Owner'
    ),
    (
        4,
        26,
        30,
        'Hindu',
        'Gupta',
        'M.Tech',
        'Data Scientist'
    ),
    (
        5,
        27,
        33,
        'Hindu',
        'Rajput',
        'B.Com',
        'Bank Manager'
    );
INSERT INTO Matches (user1_id, user2_id, match_date, status)
VALUES (1, 2, '2025-03-20', 'Accepted'),
    (3, 4, '2025-03-21', 'Pending'),
    (2, 5, '2025-03-22', 'Rejected'),
    (4, 1, '2025-03-23', 'Pending'),
    (5, 3, '2025-03-24', 'Accepted');
INSERT INTO Hobbies (user_id, hobby_name)
VALUES (1, 'Trekking'),
    (2, 'Reading'),
    (3, 'Traveling'),
    (4, 'Cooking'),
    (5, 'Photography');
-- Insert into EducationDetails
INSERT INTO EducationDetails (user_id, degree, university, graduation_year)
VALUES (1, 'B.Tech', 'IIT Bombay', 2014),
    (2, 'MBBS', 'AIIMS Delhi', 2018),
    (3, 'MBA', 'IIM Bangalore', 2015),
    (4, 'M.Tech', 'BITS Pilani', 2016),
    (5, 'B.Com', 'Delhi University', 2013);
-- Insert into FamilyDetails
INSERT INTO FamilyDetails (
        user_id,
        father_name,
        mother_name,
        siblings_count,
        family_income
    )
VALUES (
        1,
        'Rajesh Sharma',
        'Sunita Sharma',
        2,
        '15L-20L'
    ),
    (2, 'Anil Agarwal', 'Meena Agarwal', 1, '20L-25L'),
    (3, 'Mahesh Kumar', 'Kavita Kumar', 3, '12L-18L'),
    (4, 'Suresh Verma', 'Rita Verma', 2, '10L-15L'),
    (5, 'Dinesh Singh', 'Poonam Singh', 1, '8L-12L');
-- Insert into ProfileViews
INSERT INTO ProfileViews (viewer_id, viewed_id, view_date)
VALUES (1, 2, '2025-03-20 10:00:00'),
    (2, 1, '2025-03-20 10:05:00'),
    (3, 4, '2025-03-21 14:30:00'),
    (4, 3, '2025-03-21 14:35:00'),
    (5, 3, '2025-03-24 09:00:00');