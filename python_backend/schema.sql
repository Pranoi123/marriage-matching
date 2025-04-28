-- Create database
CREATE DATABASE marriage_matching;
GO

USE marriage_matching;
GO

-- Users table
CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    gender NVARCHAR(10) CHECK (gender IN ('male', 'female', 'other')) NOT NULL,
    age INT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);
GO

-- UserProfiles table
CREATE TABLE UserProfiles (
    profile_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    location NVARCHAR(100),
    education NVARCHAR(100),
    occupation NVARCHAR(100),
    bio NVARCHAR(MAX),
    profile_picture NVARCHAR(255),
    interests NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_UserProfiles_Users FOREIGN KEY (user_id) 
        REFERENCES Users(user_id) ON DELETE CASCADE
);
GO

-- Matches table
CREATE TABLE Matches (
    match_id INT IDENTITY(1,1) PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    status NVARCHAR(10) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Matches_Users1 FOREIGN KEY (user1_id) 
        REFERENCES Users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_Matches_Users2 FOREIGN KEY (user2_id) 
        REFERENCES Users(user_id) ON DELETE CASCADE
);
GO

-- Messages table
CREATE TABLE Messages (
    message_id INT IDENTITY(1,1) PRIMARY KEY,
    match_id INT NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_text NVARCHAR(MAX) NOT NULL,
    is_read BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Messages_Matches FOREIGN KEY (match_id) 
        REFERENCES Matches(match_id) ON DELETE CASCADE,
    CONSTRAINT FK_Messages_Users_Sender FOREIGN KEY (sender_id) 
        REFERENCES Users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_Messages_Users_Receiver FOREIGN KEY (receiver_id) 
        REFERENCES Users(user_id) ON DELETE CASCADE
);
GO

-- Create trigger for Users updated_at
CREATE TRIGGER TR_Users_UpdateTimestamp ON Users
AFTER UPDATE AS 
BEGIN
    UPDATE Users
    SET updated_at = GETDATE()
    FROM Users u
    INNER JOIN inserted i ON u.user_id = i.user_id;
END;
GO

-- Create trigger for UserProfiles updated_at
CREATE TRIGGER TR_UserProfiles_UpdateTimestamp ON UserProfiles
AFTER UPDATE AS 
BEGIN
    UPDATE UserProfiles
    SET updated_at = GETDATE()
    FROM UserProfiles up
    INNER JOIN inserted i ON up.profile_id = i.profile_id;
END;
GO

-- Create trigger for Matches updated_at
CREATE TRIGGER TR_Matches_UpdateTimestamp ON Matches
AFTER UPDATE AS 
BEGIN
    UPDATE Matches
    SET updated_at = GETDATE()
    FROM Matches m
    INNER JOIN inserted i ON m.match_id = i.match_id;
END;
GO 