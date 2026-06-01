USE TicketingSystem;
GO
CREATE OR ALTER PROCEDURE dbo.GetTicketsFiltered
    @Page INT = 1,
    @PageSize INT = 25,
    @Search NVARCHAR(200) = NULL,
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @Status NVARCHAR(50) = NULL,
    @Priority NVARCHAR(50) = NULL,
    @Project NVARCHAR(255) = NULL,
    @Service NVARCHAR(255) = NULL,
    @Assignee NVARCHAR(255) = NULL,
    @Team NVARCHAR(100) = NULL,
    @CatT1 NVARCHAR(100) = NULL,
    @SlaStatus NVARCHAR(10) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @Page < 1 SET @Page = 1;
    IF @PageSize < 1 SET @PageSize = 25;
    IF @PageSize > 5000 SET @PageSize = 5000;

    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    ;WITH FilteredTickets AS
    (
        SELECT
            t.ticket_id,
            t.ticket_number,
            t.status,
            p.priority_name AS priority,
            t.company,
            t.project,
            t.team,
            t.assigned_person,
            t.service,
            t.description,
            t.notes,
            t.resolution,
            t.cat_t1,
            t.cat_t2,
            t.cat_t3,
            t.submit_datetime,
            t.resolved_datetime,
            t.closed_datetime,
            t.last_modified,
            t.estimated_resolution,
            t.resolution_category,
            t.pending_duration,
            COUNT(*) OVER() AS total_count
        FROM tickets t
        LEFT JOIN priorities p
            ON t.priority_id = p.priority_id
        WHERE
            (
                @Search IS NULL
                OR t.ticket_number LIKE '%' + @Search + '%'
                OR t.project LIKE '%' + @Search + '%'
                OR t.service LIKE '%' + @Search + '%'
                OR t.team LIKE '%' + @Search + '%'
                OR t.assigned_person LIKE '%' + @Search + '%'
                OR t.company LIKE '%' + @Search + '%'
                OR t.description LIKE '%' + @Search + '%'
                OR t.notes LIKE '%' + @Search + '%'
                OR t.resolution LIKE '%' + @Search + '%'
            )
            AND (@StartDate IS NULL OR t.submit_datetime >= @StartDate)
            AND (@EndDate IS NULL OR t.submit_datetime < DATEADD(DAY, 1, @EndDate))
            AND (@Status IS NULL OR @Status = 'all' OR t.status = @Status)
            AND (@Priority IS NULL OR @Priority = 'all' OR p.priority_name = @Priority)
            AND (@Project IS NULL OR t.project = @Project)
            AND (@Service IS NULL OR t.service = @Service)
            AND (@Assignee IS NULL OR t.assigned_person = @Assignee)
            AND (@Team IS NULL OR t.team = @Team)
            AND (@CatT1 IS NULL OR t.cat_t1 = @CatT1)
            AND (
                @SlaStatus IS NULL
                OR (@SlaStatus = 'met' AND (
                    t.resolved_datetime <= t.estimated_resolution
                    OR (t.resolved_datetime IS NULL AND t.estimated_resolution >= GETDATE())
                ))
                OR (@SlaStatus = 'breached' AND (
                    t.resolved_datetime > t.estimated_resolution
                    OR (t.resolved_datetime IS NULL AND t.estimated_resolution < GETDATE())
                ))
            )
    )
    SELECT *
    FROM FilteredTickets
    ORDER BY submit_datetime DESC, ticket_id DESC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END;
GO