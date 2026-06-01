CREATE DATABASE TicketingSystem;
GO
USE TicketingSystem;
GO
CREATE TABLE priorities (
    priority_id INT IDENTITY(1,1) PRIMARY KEY,
    priority_name NVARCHAR(20) NOT NULL UNIQUE,
    max_minutes INT NOT NULL
);
GO
CREATE TABLE tickets (
    ticket_id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_number VARCHAR(20) NOT NULL UNIQUE,

    status NVARCHAR(30) NOT NULL,
    priority_id INT NOT NULL,

    company NVARCHAR(100) NOT NULL,
    project NVARCHAR(100) NOT NULL,
    team NVARCHAR(100) NOT NULL,
    assigned_person NVARCHAR(100) NULL,
    service NVARCHAR(100) NOT NULL,

    description NVARCHAR(255) NOT NULL,
    notes NVARCHAR(1000) NULL,
    resolution NVARCHAR(1000) NULL,

    cat_t1 NVARCHAR(50) NULL,
    cat_t2 NVARCHAR(50) NULL,
    cat_t3 NVARCHAR(50) NULL,

    submit_datetime DATETIME2 NOT NULL,
    resolved_datetime DATETIME2 NULL,
    closed_datetime DATETIME2 NULL,
    last_modified DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    estimated_resolution DATETIME2 NULL,

    resolution_category NVARCHAR(100) NULL,
    pending_duration INT NOT NULL DEFAULT 0,

    CONSTRAINT FK_tickets_priorities
        FOREIGN KEY (priority_id) REFERENCES priorities(priority_id)
);
GO
CREATE TABLE users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL
);
GO