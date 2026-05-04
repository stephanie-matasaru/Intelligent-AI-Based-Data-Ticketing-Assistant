CREATE PROCEDURE dbo.GetTicketsByCategory
    @StartDate  DATETIME2 = NULL,
    @EndDate    DATETIME2 = NULL,
    @Priority   NVARCHAR(50) = NULL,
    @Status     NVARCHAR(50) = NULL,
    @Team       NVARCHAR(100) = NULL
AS
BEGIN
    SELECT t.cat_t1 AS name, COUNT(*) AS count
    FROM dbo.tickets t
    JOIN dbo.priorities p ON t.priority_id = p.priority_id
    WHERE
        (@StartDate IS NULL OR t.submit_datetime >= @StartDate) AND
        (@EndDate   IS NULL OR t.submit_datetime <= @EndDate)   AND
        (@Priority  IS NULL OR p.priority_name = @Priority)     AND
        (@Status    IS NULL OR t.status = @Status)              AND
        (@Team      IS NULL OR t.team = @Team)
    GROUP BY t.cat_t1
    ORDER BY count DESC
END
GO

CREATE PROCEDURE dbo.GetTicketsByTeam
    @StartDate  DATETIME2 = NULL,
    @EndDate    DATETIME2 = NULL,
    @Priority   NVARCHAR(50) = NULL,
    @Status     NVARCHAR(50) = NULL,
    @Team       NVARCHAR(100) = NULL
AS
BEGIN
    SELECT t.team AS name, COUNT(*) AS count
    FROM dbo.tickets t
    JOIN dbo.priorities p ON t.priority_id = p.priority_id
    WHERE
        (@StartDate IS NULL OR t.submit_datetime >= @StartDate) AND
        (@EndDate   IS NULL OR t.submit_datetime <= @EndDate)   AND
        (@Priority  IS NULL OR p.priority_name = @Priority)     AND
        (@Status    IS NULL OR t.status = @Status)              AND
        (@Team      IS NULL OR t.team = @Team)
    GROUP BY t.team
    ORDER BY count DESC
END
GO