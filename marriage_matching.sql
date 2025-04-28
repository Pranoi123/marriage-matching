-- Marriage Matching Database Schema

-- Create database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'marriage_matching')
BEGIN
    CREATE DATABASE marriage_matching;
END
GO

USE marriage_matching;
GO

-- Users table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        user_id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(100) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        gender NVARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
        age INT NOT NULL CHECK (age >= 18),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        is_active BIT DEFAULT 1
    );
END
GO

-- UserProfiles table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserProfiles')
BEGIN
    CREATE TABLE UserProfiles (
        profile_id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        location NVARCHAR(100),
        education NVARCHAR(20) CHECK (education IN ('high-school', 'bachelors', 'masters', 'phd')),
        occupation NVARCHAR(100),
        bio NVARCHAR(MAX),
        profile_picture NVARCHAR(255),
        interests NVARCHAR(MAX),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
    );
END
GO

-- UserPreferences table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserPreferences')
BEGIN
    CREATE TABLE UserPreferences (
        preference_id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        min_age INT NOT NULL,
        max_age INT NOT NULL,
        preferred_gender NVARCHAR(10) CHECK (preferred_gender IN ('male', 'female', 'other')),
        preferred_location NVARCHAR(100),
        preferred_education NVARCHAR(20) CHECK (preferred_education IN ('high-school', 'bachelors', 'masters', 'phd')),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
        CHECK (min_age >= 18 AND max_age >= min_age)
    );
END
GO

-- Matches table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Matches')
BEGIN
    CREATE TABLE Matches (
        match_id INT IDENTITY(1,1) PRIMARY KEY,
        user1_id INT NOT NULL,
        user2_id INT NOT NULL,
        compatibility_score DECIMAL(5,2),
        status NVARCHAR(10) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user1_id) REFERENCES Users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (user2_id) REFERENCES Users(user_id) ON DELETE CASCADE,
        CONSTRAINT unique_match UNIQUE (user1_id, user2_id)
    );
END
GO

-- Messages table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Messages')
BEGIN
    CREATE TABLE Messages (
        message_id INT IDENTITY(1,1) PRIMARY KEY,
        match_id INT NOT NULL,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message_text NVARCHAR(MAX) NOT NULL,
        is_read BIT DEFAULT 0,
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (match_id) REFERENCES Matches(match_id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES Users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES Users(user_id) ON DELETE CASCADE
    );
END
GO

-- Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_users_email')
BEGIN
    CREATE INDEX idx_users_email ON Users(email);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_matches_users')
BEGIN
    CREATE INDEX idx_matches_users ON Matches(user1_id, user2_id);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_messages_match')
BEGIN
    CREATE INDEX idx_messages_match ON Messages(match_id);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_messages_sender')
BEGIN
    CREATE INDEX idx_messages_sender ON Messages(sender_id);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_messages_receiver')
BEGIN
    CREATE INDEX idx_messages_receiver ON Messages(receiver_id);
END
GO

-- Create triggers for data validation
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'before_user_insert')
BEGIN
    CREATE TRIGGER before_user_insert
    ON Users
    AFTER INSERT
    AS
    BEGIN
        IF EXISTS (SELECT 1 FROM inserted WHERE age < 18)
        BEGIN
            RAISERROR('User must be at least 18 years old', 16, 1);
            ROLLBACK TRANSACTION;
        END
    END;
END
GO

IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'before_preference_insert')
BEGIN
    CREATE TRIGGER before_preference_insert
    ON UserPreferences
    AFTER INSERT
    AS
    BEGIN
        IF EXISTS (SELECT 1 FROM inserted WHERE min_age < 18 OR max_age < min_age)
        BEGIN
            RAISERROR('Invalid age range', 16, 1);
            ROLLBACK TRANSACTION;
        END
    END;
END
GO 