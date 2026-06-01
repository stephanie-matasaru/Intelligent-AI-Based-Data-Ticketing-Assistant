USE TicketingSystem;
GO

CREATE OR ALTER PROCEDURE dbo.GetTicketsByPriority
    @StartDate  DATETIME2 = NULL,
    @EndDate    DATETIME2 = NULL,
    @Priority   NVARCHAR(50) = NULL,
    @Status     NVARCHAR(50) = NULL,
    @Team       NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT p.priority_name AS name, COUNT(*) AS count
    FROM dbo.tickets t
    JOIN dbo.priorities p ON t.priority_id = p.priority_id
    WHERE
        (@StartDate IS NULL OR t.submit_datetime >= @StartDate) AND
        (@EndDate   IS NULL OR t.submit_datetime <  DATEADD(DAY, 1, CAST(@EndDate AS DATE))) AND
        (@Priority  IS NULL OR p.priority_name = @Priority) AND
        (@Status    IS NULL OR t.status = @Status) AND
        (@Team      IS NULL OR t.team = @Team)
    GROUP BY p.priority_name
    ORDER BY
        CASE p.priority_name
            WHEN 'Critical' THEN 1
            WHEN 'High'     THEN 2
            WHEN 'Medium'   THEN 3
            WHEN 'Low'      THEN 4
            ELSE 5
        END;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetTicketsByStatus
    @StartDate  DATETIME2 = NULL,
    @EndDate    DATETIME2 = NULL,
    @Priority   NVARCHAR(50) = NULL,
    @Status     NVARCHAR(50) = NULL,
    @Team       NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT t.status AS name, COUNT(*) AS count
    FROM dbo.tickets t
    JOIN dbo.priorities p ON t.priority_id = p.priority_id
    WHERE
        (@StartDate IS NULL OR t.submit_datetime >= @StartDate) AND
        (@EndDate   IS NULL OR t.submit_datetime <  DATEADD(DAY, 1, CAST(@EndDate AS DATE))) AND
        (@Priority  IS NULL OR p.priority_name = @Priority) AND
        (@Status    IS NULL OR t.status = @Status) AND
        (@Team      IS NULL OR t.team = @Team)
    GROUP BY t.status
    ORDER BY
        CASE t.status
            WHEN 'Open'        THEN 1
            WHEN 'In Progress' THEN 2
            WHEN 'Pending'     THEN 3
            WHEN 'Resolved'    THEN 4
            WHEN 'Closed'      THEN 5
            ELSE 6
        END;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetSLACompliance
    @StartDate  DATE = NULL,
    @EndDate    DATE = NULL,
    @Priority   NVARCHAR(50) = NULL,
    @Status     NVARCHAR(50) = NULL,
    @Team       NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        SUM(CASE
            WHEN (t.resolved_datetime IS NOT NULL AND t.resolved_datetime <= t.estimated_resolution)
              OR (t.resolved_datetime IS NULL     AND t.estimated_resolution >= GETDATE())
            THEN 1 ELSE 0
        END) AS sla_met,
        SUM(CASE
            WHEN (t.resolved_datetime IS NOT NULL AND t.resolved_datetime > t.estimated_resolution)
              OR (t.resolved_datetime IS NULL     AND t.estimated_resolution < GETDATE())
            THEN 1 ELSE 0
        END) AS sla_breached
    FROM dbo.tickets t
    JOIN dbo.priorities p ON t.priority_id = p.priority_id
    WHERE
        (@StartDate IS NULL OR t.submit_datetime >= @StartDate) AND
        (@EndDate   IS NULL OR t.submit_datetime <  DATEADD(DAY, 1, @EndDate)) AND
        (@Priority  IS NULL OR @Priority = 'all' OR p.priority_name = @Priority) AND
        (@Status    IS NULL OR @Status   = 'all' OR t.status = @Status) AND
        (@Team      IS NULL OR @Team     = 'all' OR t.team = @Team);
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetTicketsOverTime
    @StartDate  DATE = NULL,
    @EndDate    DATE = NULL,
    @Priority   NVARCHAR(50) = NULL,
    @Status     NVARCHAR(50) = NULL,
    @Team       NVARCHAR(255) = NULL,
    @GroupBy    NVARCHAR(10) = 'weekly'
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        CASE
            WHEN @GroupBy = 'daily'   THEN CAST(t.submit_datetime AS DATE)
            WHEN @GroupBy = 'weekly'  THEN DATEADD(DAY, -(DATEDIFF(DAY, 0, t.submit_datetime) % 7), CAST(t.submit_datetime AS DATE))
            WHEN @GroupBy = 'monthly' THEN DATEFROMPARTS(YEAR(t.submit_datetime), MONTH(t.submit_datetime), 1)
        END AS period_start,
        CASE
            WHEN @GroupBy = 'daily'   THEN CAST(t.submit_datetime AS DATE)
            WHEN @GroupBy = 'weekly'  THEN DATEADD(DAY, 6 - (DATEDIFF(DAY, 0, t.submit_datetime) % 7), CAST(t.submit_datetime AS DATE))
            WHEN @GroupBy = 'monthly' THEN EOMONTH(t.submit_datetime)
        END AS period_end,
        COUNT(*) AS count
    FROM dbo.tickets t
    JOIN dbo.priorities p ON t.priority_id = p.priority_id
    WHERE
        (@StartDate IS NULL OR t.submit_datetime >= @StartDate) AND
        (@EndDate   IS NULL OR t.submit_datetime <  DATEADD(DAY, 1, @EndDate)) AND
        (@Priority  IS NULL OR @Priority = 'all' OR p.priority_name = @Priority) AND
        (@Status    IS NULL OR @Status   = 'all' OR t.status = @Status) AND
        (@Team      IS NULL OR @Team     = 'all' OR t.team = @Team)
    GROUP BY
        CASE
            WHEN @GroupBy = 'daily'   THEN CAST(t.submit_datetime AS DATE)
            WHEN @GroupBy = 'weekly'  THEN DATEADD(DAY, -(DATEDIFF(DAY, 0, t.submit_datetime) % 7), CAST(t.submit_datetime AS DATE))
            WHEN @GroupBy = 'monthly' THEN DATEFROMPARTS(YEAR(t.submit_datetime), MONTH(t.submit_datetime), 1)
        END,
        CASE
            WHEN @GroupBy = 'daily'   THEN CAST(t.submit_datetime AS DATE)
            WHEN @GroupBy = 'weekly'  THEN DATEADD(DAY, 6 - (DATEDIFF(DAY, 0, t.submit_datetime) % 7), CAST(t.submit_datetime AS DATE))
            WHEN @GroupBy = 'monthly' THEN EOMONTH(t.submit_datetime)
        END
    ORDER BY period_start;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetTicketsByCategory
    @StartDate  DATETIME2 = NULL,
    @EndDate    DATETIME2 = NULL,
    @Priority   NVARCHAR(50) = NULL,
    @Status     NVARCHAR(50) = NULL,
    @Team       NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT t.cat_t1 AS name, COUNT(*) AS count
    FROM dbo.tickets t
    JOIN dbo.priorities p ON t.priority_id = p.priority_id
    WHERE
        (@StartDate IS NULL OR t.submit_datetime >= @StartDate) AND
        (@EndDate   IS NULL OR t.submit_datetime <  DATEADD(DAY, 1, CAST(@EndDate AS DATE))) AND
        (@Priority  IS NULL OR p.priority_name = @Priority) AND
        (@Status    IS NULL OR t.status = @Status) AND
        (@Team      IS NULL OR t.team = @Team)
    GROUP BY t.cat_t1
    ORDER BY count DESC;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GetTicketsByTeam
    @StartDate  DATETIME2 = NULL,
    @EndDate    DATETIME2 = NULL,
    @Priority   NVARCHAR(50) = NULL,
    @Status     NVARCHAR(50) = NULL,
    @Team       NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT t.team AS name, COUNT(*) AS count
    FROM dbo.tickets t
    JOIN dbo.priorities p ON t.priority_id = p.priority_id
    WHERE
        (@StartDate IS NULL OR t.submit_datetime >= @StartDate) AND
        (@EndDate   IS NULL OR t.submit_datetime <  DATEADD(DAY, 1, CAST(@EndDate AS DATE))) AND
        (@Priority  IS NULL OR p.priority_name = @Priority) AND
        (@Status    IS NULL OR t.status = @Status) AND
        (@Team      IS NULL OR t.team = @Team)
    GROUP BY t.team
    ORDER BY count DESC;
END;
GO