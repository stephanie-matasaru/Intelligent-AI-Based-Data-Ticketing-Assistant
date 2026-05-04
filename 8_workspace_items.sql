USE TicketingSystem;
GO

CREATE TABLE workspace_items (
    id INT IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    type NVARCHAR(20),
    label NVARCHAR(255),
    chart_spec NVARCHAR(MAX),
    excel_spec NVARCHAR(MAX),
    saved_at DATETIME2 DEFAULT GETDATE()
)
GO