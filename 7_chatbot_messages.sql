USE TicketingSystem;
GO

CREATE TABLE chat_messages (
    id INT IDENTITY(1,1) PRIMARY KEY,
    group_id UNIQUEIDENTIFIER NOT NULL,
    user_id INT NULL,
    agent_id INT NULL,
    sender NVARCHAR(10) NOT NULL CHECK (sender IN ('user', 'agent')),
    message NVARCHAR(MAX) NOT NULL,
    query NVARCHAR(MAX) NULL,
    json_export NVARCHAR(MAX) NULL,
    json_chart NVARCHAR(MAX) NULL,
    request_tokens INT NULL,
    response_status NVARCHAR(20) NULL DEFAULT 'pending',
    delete_flag BIT NOT NULL DEFAULT 0,
    date_added DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

ALTER TABLE chat_messages ADD title NVARCHAR(255) NULL;
GO
