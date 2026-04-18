USE TicketingSystem;

GO
    CREATE
    OR ALTER PROCEDURE dbo.GetTicketsByPriority @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @Priority NVARCHAR(50) = NULL,
    @Status NVARCHAR(50) = NULL,
    @Team NVARCHAR(255) = NULL AS BEGIN
SET
    NOCOUNT ON;

SELECT
    p.priority_name AS name,
    COUNT(*) AS count
FROM
    tickets t
    JOIN priorities p ON t.priority_id = p.priority_id
WHERE
    (
        @StartDate IS NULL
        OR t.submit_datetime >= @StartDate
    )
    AND (
        @EndDate IS NULL
        OR t.submit_datetime <= @EndDate
    )
    AND (
        @Priority IS NULL
        OR @Priority = 'all'
        OR p.priority_name = @Priority
    )
    AND (
        @Status IS NULL
        OR @Status = 'all'
        OR t.status = @Status
    )
    AND (
        @Team IS NULL
        OR @Team = 'all'
        OR t.team = @Team
    )
GROUP BY
    p.priority_name;

END;

GO
    CREATE
    OR ALTER PROCEDURE dbo.GetTicketsByStatus @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @Priority NVARCHAR(50) = NULL,
    @Status NVARCHAR(50) = NULL,
    @Team NVARCHAR(255) = NULL AS BEGIN
SET
    NOCOUNT ON;

SELECT
    t.status AS name,
    COUNT(*) AS count
FROM
    tickets t
    JOIN priorities p ON t.priority_id = p.priority_id
WHERE
    (
        @StartDate IS NULL
        OR t.submit_datetime >= @StartDate
    )
    AND (
        @EndDate IS NULL
        OR t.submit_datetime <= @EndDate
    )
    AND (
        @Priority IS NULL
        OR @Priority = 'all'
        OR p.priority_name = @Priority
    )
    AND (
        @Status IS NULL
        OR @Status = 'all'
        OR t.status = @Status
    )
    AND (
        @Team IS NULL
        OR @Team = 'all'
        OR t.team = @Team
    )
GROUP BY
    t.status;

END;

GO
    CREATE
    OR ALTER PROCEDURE dbo.GetSLACompliance @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @Priority NVARCHAR(50) = NULL,
    @Status NVARCHAR(50) = NULL,
    @Team NVARCHAR(255) = NULL AS BEGIN
SET
    NOCOUNT ON;

SELECT
    SUM(
        CASE
            WHEN t.resolved_datetime IS NOT NULL
            AND t.resolved_datetime <= t.estimated_resolution THEN 1
            ELSE 0
        END
    ) AS sla_met,
    SUM(
        CASE
            WHEN (
                t.resolved_datetime IS NOT NULL
                AND t.resolved_datetime > t.estimated_resolution
            )
            OR (
                t.resolved_datetime IS NULL
                AND GETDATE() > t.estimated_resolution
            ) THEN 1
            ELSE 0
        END
    ) AS sla_breached
FROM
    tickets t
    JOIN priorities p ON t.priority_id = p.priority_id
WHERE
    (
        @StartDate IS NULL
        OR t.submit_datetime >= @StartDate
    )
    AND (
        @EndDate IS NULL
        OR t.submit_datetime <= @EndDate
    )
    AND (
        @Priority IS NULL
        OR @Priority = 'all'
        OR p.priority_name = @Priority
    )
    AND (
        @Status IS NULL
        OR @Status = 'all'
        OR t.status = @Status
    )
    AND (
        @Team IS NULL
        OR @Team = 'all'
        OR t.team = @Team
    );

END;

GO
    CREATE
    OR ALTER PROCEDURE dbo.GetTicketsOverTime @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @Priority NVARCHAR(50) = NULL,
    @Status NVARCHAR(50) = NULL,
    @Team NVARCHAR(255) = NULL AS BEGIN
SET
    NOCOUNT ON;

SELECT
    CAST(t.submit_datetime AS DATE) AS day,
    COUNT(*) AS count
FROM
    tickets t
    JOIN priorities p ON t.priority_id = p.priority_id
WHERE
    (
        @StartDate IS NULL
        OR t.submit_datetime >= @StartDate
    )
    AND (
        @EndDate IS NULL
        OR t.submit_datetime <= @EndDate
    )
    AND (
        @Priority IS NULL
        OR @Priority = 'all'
        OR p.priority_name = @Priority
    )
    AND (
        @Status IS NULL
        OR @Status = 'all'
        OR t.status = @Status
    )
    AND (
        @Team IS NULL
        OR @Team = 'all'
        OR t.team = @Team
    )
GROUP BY
    CAST(t.submit_datetime AS DATE)
ORDER BY
    day;

END;

GO