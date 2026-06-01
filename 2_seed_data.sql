USE TicketingSystem;
GO

INSERT INTO priorities (priority_name, max_minutes)
VALUES
(N'Critical', 480),
(N'High', 960),
(N'Medium', 1440),
(N'Low', 2880);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0001', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Vodafone', N'Billing', N'Support', N'Popescu Ion', N'API', N'API 500 error', NULL, NULL, N'App', N'Backend', N'API Error', N'2026-03-20T10:00:00', NULL, NULL, N'2026-03-20T10:00:00', N'2026-03-20T14:00:00', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0002', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'Network', N'Network', N'Ionescu Maria', N'Network', N'Packet loss', N'Investigating', NULL, N'Infra', N'Network', N'Packet Loss', N'2026-03-19T08:00:00', NULL, NULL, N'2026-03-20T09:00:00', N'2026-03-19T12:00:00', NULL, 30);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0003', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Digi', N'Portal', N'Frontend', N'Georgescu Ana', N'UI', N'Login issue', N'Replicated', N'Fixed JS', N'App', N'Frontend', N'UI Bug', N'2026-03-18T14:00:00', N'2026-03-18T16:30:00', NULL, N'2026-03-18T16:30:00', N'2026-03-18T18:00:00', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0004', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Reports', N'Data', N'Vasilescu Dan', N'DB', N'Slow query', N'Index issue', N'Added index', N'Infra', N'DB', N'Performance', N'2026-03-17T09:00:00', N'2026-03-17T12:00:00', N'2026-03-17T13:00:00', N'2026-03-17T13:00:00', N'2026-03-17T17:00:00', N'Optimization', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0005', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Vodafone', N'CRM', N'Support', N'Popa Elena', N'Backend', N'Sync issue', N'Waiting client', NULL, N'App', N'Backend', N'Sync', N'2026-03-21T11:00:00', NULL, NULL, N'2026-03-21T12:00:00', N'2026-03-21T15:00:00', NULL, 120);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0006', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Mobile App', N'Frontend', N'Radu Mihai', N'UI', N'Button misaligned', NULL, NULL, N'App', N'Frontend', N'UI Issue', N'2026-03-22T09:30:00', NULL, NULL, N'2026-03-22T09:30:00', N'2026-03-22T13:00:00', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0007', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Digi', N'API Gateway', N'Backend', N'Enache Paul', N'API', N'Timeout error', N'Logs checked', N'Increased timeout', N'App', N'Backend', N'Timeout', N'2026-03-20T07:00:00', N'2026-03-20T10:00:00', NULL, N'2026-03-20T10:00:00', N'2026-03-20T11:00:00', N'Config Change', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0008', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Telekom', N'Infra', N'DevOps', N'Marin Sorin', N'Server', N'Server down', N'Restarted', N'Restart server', N'Infra', N'Server', N'Crash', N'2026-03-16T02:00:00', N'2026-03-16T03:00:00', N'2026-03-16T04:00:00', N'2026-03-16T04:00:00', N'2026-03-16T03:00:00', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0009', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Vodafone', N'Analytics', N'Data', N'Ilie Cristina', N'DB', N'Data mismatch', N'Checking ETL', NULL, N'App', N'Data', N'ETL Issue', N'2026-03-23T10:00:00', NULL, NULL, N'2026-03-23T11:00:00', N'2026-03-23T16:00:00', NULL, 15);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0010', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Orange', N'CRM', N'Support', N'Tudor Alex', N'Backend', N'Email not sent', N'Waiting SMTP', NULL, N'App', N'Backend', N'Email', N'2026-03-24T08:00:00', NULL, NULL, N'2026-03-24T09:00:00', N'2026-03-24T12:00:00', NULL, 60);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0011', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'NOC Dashboard', N'Support', N'Georgescu Ana', N'Voice', N'BGP flap in regional POP', N'Logs reviewed', N'Cleared stuck messages', N'Infra', N'Network', N'Packet Loss', N'2026-01-22T03:59:20', N'2026-01-22T14:04:20', N'2026-01-22T18:25:20', N'2026-01-22T18:25:20', N'2026-01-23T03:59:20', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0012', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Telekom', N'CRM', N'Network', N'Marin Sorin', N'Billing', N'SMS queue backlog', N'Vendor update received', N'Added missing index', N'Infra', N'Messaging', N'SMS Delivery', N'2026-01-21T01:29:40', N'2026-01-21T05:39:40', NULL, N'2026-01-21T05:39:40', N'2026-01-21T09:29:40', N'Optimization', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0013', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Vodafone', N'Customer Care', N'Frontend', N'Vasilescu Dan', N'Auth', N'Role mapping issue after deploy', N'Vendor update received', N'Resized worker pool', N'App', N'Security', N'Authentication', N'2025-12-12T07:29:54', N'2025-12-12T18:50:54', N'2025-12-13T00:26:54', N'2025-12-13T00:26:54', N'2025-12-12T23:29:54', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0014', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Fiber Rollout', N'Data', N'Marin Sorin', N'UI', N'Optical power low on backbone route', N'Logs reviewed', N'Added missing index', N'Infra', N'Network', N'Fiber Cut', N'2025-10-16T21:28:19', N'2025-10-18T15:46:19', NULL, N'2025-10-18T15:46:19', N'2025-10-18T21:28:19', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0015', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Telekom', N'Portal', N'DevOps', N'Popa Elena', N'SMS', N'Data mismatch in KPI ETL', N'Root cause isolated', N'Rolled back faulty deployment', N'App', N'Data', N'ETL Issue', N'2026-02-07T18:06:41', N'2026-02-08T00:46:41', N'2026-02-08T11:09:41', N'2026-02-08T11:09:41', N'2026-02-08T02:06:41', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0016', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Mobile App', N'Network', N'Ilie Cristina', N'SMS', N'Fiber cut affecting enterprise customers', N'Vendor update received', N'Added missing index', N'Infra', N'Network', N'Fiber Cut', N'2025-10-12T18:44:24', N'2025-10-14T05:11:24', NULL, N'2025-10-14T05:11:24', N'2025-10-14T18:44:24', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0017', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Vodafone', N'Messaging', N'DevOps', N'Radu Mihai', N'Auth', N'VPN tunnel instability', NULL, N'Cleared stuck messages', N'Infra', N'Network', N'Packet Loss', N'2025-10-12T10:44:51', N'2025-10-13T06:04:51', N'2025-10-13T07:41:51', N'2025-10-13T07:41:51', N'2025-10-13T10:44:51', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0018', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'NOC Dashboard', N'Data', N'Popa Elena', N'ETL', N'Voice gateway timeout', N'Logs reviewed', N'Updated configuration', N'Infra', N'Voice', N'SIP', N'2026-02-15T04:02:50', N'2026-02-15T18:12:50', N'2026-02-15T21:27:50', N'2026-02-15T21:27:50', N'2026-02-15T20:02:50', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0019', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Orange', N'Analytics', N'Support', N'Stan Ioana', N'Auth', N'Customer profile page blank', N'Issue reproduced in test', N'Updated configuration', N'App', N'Frontend', N'UI Bug', N'2025-11-24T17:53:32', N'2025-11-25T03:31:32', N'2025-11-25T11:33:32', N'2025-11-25T11:33:32', N'2025-11-25T09:53:32', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0020', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'NOC Dashboard', N'Security', N'Vasilescu Dan', N'SMS', N'Missing DLR acknowledgements', N'Issue reproduced in test', N'Rolled back faulty deployment', N'Infra', N'Messaging', N'SMS Delivery', N'2025-10-13T02:05:45', N'2025-10-16T09:02:45', N'2025-10-16T11:01:45', N'2025-10-16T11:01:45', N'2025-10-15T02:05:45', N'Config Change', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0021', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'Self-Care', N'Network', N'Stoica Larisa', N'Auth', N'API 500 error', N'Root cause isolated', N'Adjusted timeout threshold', N'App', N'Backend', N'API Error', N'2026-03-19T18:41:03', N'2026-03-20T00:40:03', N'2026-03-20T09:00:03', N'2026-03-20T09:00:03', N'2026-03-20T02:41:03', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0022', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Infra', N'NOC', N'Stan Ioana', N'SMS', N'CRM sync issue', N'Issue reproduced in test', N'Patched validation rule', N'App', N'Backend', N'Sync', N'2025-10-28T23:38:10', N'2025-10-29T03:59:10', N'2025-10-29T07:44:10', N'2025-10-29T07:44:10', N'2025-10-29T07:38:10', N'Optimization', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0023', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Self-Care', N'Support', N'Dumitru Vlad', N'Server', N'SMS queue backlog', N'Root cause isolated', N'Corrected ETL mapping', N'Infra', N'Messaging', N'SMS Delivery', N'2026-02-13T04:30:43', N'2026-02-14T02:05:43', NULL, N'2026-02-14T02:05:43', N'2026-02-14T04:30:43', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0024', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Orange', N'Analytics', N'Security', N'Marin Sorin', N'DB', N'Call setup delay', N'Customer confirmed symptoms', N'Added missing index', N'Infra', N'Voice', N'SIP', N'2025-12-09T01:02:29', N'2025-12-10T10:53:29', NULL, N'2025-12-10T10:53:29', N'2025-12-09T17:02:29', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0025', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'Fiber Rollout', N'DevOps', N'Georgescu Ana', N'DB', N'Latency spike on MPLS circuit', N'Root cause isolated', N'Resized worker pool', N'Infra', N'Network', N'Packet Loss', N'2025-12-31T06:43:53', N'2026-01-01T00:33:53', N'2026-01-01T11:46:53', N'2026-01-01T11:46:53', N'2026-01-01T06:43:53', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0026', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'NOC Dashboard', N'Backend', N'Stan Ioana', N'UI', N'ETL job failed on transform step', N'Escalated to L2', N'Restarted affected service', N'App', N'Data', N'ETL Issue', N'2025-10-17T20:17:01', N'2025-10-18T08:57:01', NULL, N'2025-10-18T08:57:01', N'2025-10-18T04:17:01', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0027', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Orange', N'Billing', N'Frontend', N'Neagu Florin', N'SMS', N'OTP delivery delayed', N'Escalated to L2', N'Updated configuration', N'Infra', N'Messaging', N'SMS Delivery', N'2026-01-27T18:08:17', N'2026-01-29T01:07:17', NULL, N'2026-01-29T01:07:17', N'2026-01-28T10:08:17', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0028', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Network', N'Frontend', N'Nistor Bianca', N'DB', N'Slow query on billing DB', N'Vendor update received', N'Added missing index', N'Infra', N'DB', N'Performance', N'2025-11-18T21:38:07', N'2025-11-19T04:11:07', N'2025-11-19T06:40:07', N'2025-11-19T06:40:07', N'2025-11-19T05:38:07', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0029', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Digi', N'Messaging', N'Security', N'Dumitru Vlad', N'UI', N'Dropped call spike on SIP trunk', N'Escalated to L2', N'Updated configuration', N'Infra', N'Voice', N'SIP', N'2026-01-10T15:43:03', N'2026-01-11T08:30:03', N'2026-01-11T11:09:03', N'2026-01-11T11:09:03', N'2026-01-10T23:43:03', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0030', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Vodafone', N'Self-Care', N'Support', N'Dobre Andrei', N'Billing', N'Call setup delay', N'Issue reproduced in test', N'Added missing index', N'Infra', N'Voice', N'SIP', N'2026-03-02T06:58:28', N'2026-03-04T13:02:28', NULL, N'2026-03-04T13:02:28', N'2026-03-04T06:58:28', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0031', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Telekom', N'Self-Care', N'Support', N'Georgescu Ana', N'SMS', N'Nginx worker crash', N'Monitored after change', N'Patched validation rule', N'Infra', N'Server', N'Crash', N'2026-02-12T12:21:37', N'2026-02-12T19:06:37', N'2026-02-13T04:53:37', N'2026-02-13T04:53:37', N'2026-02-12T20:21:37', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0032', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'API Gateway', N'Security', N'Vasilescu Dan', N'ETL', N'SMTP relay timeout', N'Escalated to L2', N'Restarted affected service', N'App', N'Backend', N'Email', N'2025-10-15T02:05:21', N'2025-10-15T10:21:21', NULL, N'2025-10-15T10:21:21', N'2025-10-15T18:05:21', N'Data Correction', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0033', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Provisioning', N'Frontend', N'Matei Ovidiu', N'DB', N'Fiber cut affecting enterprise customers', N'Pending customer test results', NULL, N'Infra', N'Network', N'Fiber Cut', N'2025-12-17T08:00:41', NULL, NULL, N'2025-12-17T08:51:41', N'2025-12-18T08:00:41', NULL, 45);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0034', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Roaming', N'Security', N'Enache Paul', N'Backend', N'Application server down', N'Root cause isolated', N'Cleared stuck messages', N'Infra', N'Server', N'Crash', N'2026-02-18T05:28:00', N'2026-02-19T12:46:00', N'2026-02-19T21:50:00', N'2026-02-19T21:50:00', N'2026-02-20T05:28:00', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0035', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Vodafone', N'Network', N'Backend', N'Vasilescu Dan', N'Network', N'Order sync stuck in queue', N'Waiting maintenance window', NULL, N'App', N'Backend', N'Sync', N'2025-10-08T16:29:39', NULL, NULL, N'2025-10-08T18:27:39', N'2025-10-09T16:29:39', NULL, 45);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0036', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'API Gateway', N'NOC', N'Dobre Andrei', N'Network', N'CRM sync issue', N'Monitored after change', N'Restarted affected service', N'App', N'Backend', N'Sync', N'2026-03-05T06:20:53', N'2026-03-05T16:53:53', NULL, N'2026-03-05T16:53:53', N'2026-03-06T06:20:53', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0037', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'Mobile App', N'Data', N'Vasilescu Dan', N'SMS', N'Provisioning callback failure', N'Customer confirmed symptoms', N'Patched validation rule', N'App', N'Backend', N'API Error', N'2026-01-16T09:27:56', N'2026-01-17T00:33:56', N'2026-01-17T02:40:56', N'2026-01-17T02:40:56', N'2026-01-16T17:27:56', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0038', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Digi', N'CRM', N'Frontend', N'Enache Paul', N'Server', N'SMPP reconnect loop', N'Root cause isolated', N'Added missing index', N'Infra', N'Messaging', N'SMS Delivery', N'2026-01-12T03:02:21', N'2026-01-12T13:50:21', NULL, N'2026-01-12T13:50:21', N'2026-01-12T19:02:21', N'Optimization', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0039', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Digi', N'CRM', N'Support', N'Popescu Ion', N'Gateway', N'Dropped call spike on SIP trunk', N'Vendor update received', N'Resized worker pool', N'Infra', N'Voice', N'SIP', N'2026-01-08T20:30:30', N'2026-01-09T06:02:30', N'2026-01-09T14:55:30', N'2026-01-09T14:55:30', N'2026-01-09T04:30:30', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0040', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Analytics', N'DevOps', N'Enache Paul', N'Gateway', N'Optical power low on backbone route', NULL, NULL, N'Infra', N'Network', N'Fiber Cut', N'2025-12-18T14:01:40', NULL, NULL, N'2025-12-18T14:01:40', N'2025-12-19T14:01:40', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0041', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Provisioning', N'Security', N'Radu Mihai', N'API', N'VPN tunnel instability', N'Need packet capture from field team', NULL, N'Infra', N'Network', N'Packet Loss', N'2026-03-19T01:00:01', NULL, NULL, N'2026-03-19T02:25:01', N'2026-03-19T09:00:01', NULL, 90);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0042', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Telekom', N'Portal', N'Frontend', N'Ilie Cristina', N'SMS', N'Provisioning callback failure', N'Patch under validation', NULL, N'App', N'Backend', N'API Error', N'2025-12-10T17:01:18', NULL, NULL, N'2025-12-10T17:38:18', N'2025-12-11T01:01:18', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0043', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Fiber Rollout', N'Frontend', N'Popescu Ion', N'Backend', N'Data mismatch in KPI ETL', N'Monitored after change', N'Restarted affected service', N'App', N'Data', N'ETL Issue', N'2026-01-01T03:59:58', N'2026-01-01T16:51:58', N'2026-01-01T18:37:58', N'2026-01-01T18:37:58', N'2026-01-02T03:59:58', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0044', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'CRM', N'Security', N'Popescu Ion', N'Server', N'Subscriber data sync delayed', NULL, N'Rolled back faulty deployment', N'App', N'Backend', N'Sync', N'2025-10-17T09:43:04', N'2025-10-17T22:43:04', NULL, N'2025-10-17T22:43:04', N'2025-10-18T01:43:04', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0045', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Digi', N'API Gateway', N'Support', N'Dumitru Vlad', N'Billing', N'Missing rows in churn report', N'Need packet capture from field team', NULL, N'App', N'Data', N'ETL Issue', N'2026-03-26T16:23:01', NULL, NULL, N'2026-03-26T23:24:01', N'2026-03-27T08:23:01', NULL, 360);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0046', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'Mobile App', N'Support', N'Ionescu Maria', N'UI', N'SMPP reconnect loop', N'Customer confirmed symptoms', N'Patched validation rule', N'Infra', N'Messaging', N'SMS Delivery', N'2025-10-21T08:56:46', N'2025-10-21T12:21:46', N'2025-10-21T20:57:46', N'2025-10-21T20:57:46', N'2025-10-21T16:56:46', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0047', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Vodafone', N'Messaging', N'Network', N'Dumitru Vlad', N'Voice', N'Packet loss on metro link', N'Customer confirmed symptoms', N'Corrected ETL mapping', N'Infra', N'Network', N'Packet Loss', N'2026-02-22T19:20:38', N'2026-02-23T05:54:38', NULL, N'2026-02-23T05:54:38', N'2026-02-23T19:20:38', N'Data Correction', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0048', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'Infra', N'Security', N'Georgescu Ana', N'SMS', N'SMPP reconnect loop', N'Monitored after change', N'Rolled back faulty deployment', N'Infra', N'Messaging', N'SMS Delivery', N'2026-02-26T22:20:23', N'2026-02-27T06:28:23', N'2026-02-27T17:50:23', N'2026-02-27T17:50:23', N'2026-02-27T14:20:23', N'Optimization', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0049', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Billing', N'NOC', N'Ionescu Maria', N'SMS', N'CRM sync issue', NULL, N'Resized worker pool', N'App', N'Backend', N'Sync', N'2026-02-12T09:49:00', N'2026-02-13T04:46:00', N'2026-02-13T12:58:00', N'2026-02-13T12:58:00', N'2026-02-13T09:49:00', N'Data Correction', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0050', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'Customer Care', N'Network', N'Stan Ioana', N'API', N'Inventory sync mismatch', N'Customer confirmed symptoms', N'Cleared stuck messages', N'App', N'Backend', N'Sync', N'2025-10-15T20:20:57', N'2025-10-16T09:35:57', NULL, N'2025-10-16T09:35:57', N'2025-10-16T04:20:57', N'Data Correction', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0051', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Vodafone', N'Mobile App', N'Frontend', N'Dumitru Vlad', N'Server', N'Nginx worker crash', NULL, N'Corrected ETL mapping', N'Infra', N'Server', N'Crash', N'2026-01-26T03:53:17', N'2026-01-26T18:05:17', NULL, N'2026-01-26T18:05:17', N'2026-01-26T19:53:17', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0052', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Billing', N'Frontend', N'Popescu Ion', N'SMS', N'Missing DLR acknowledgements', N'Root cause isolated', N'Restarted affected service', N'Infra', N'Messaging', N'SMS Delivery', N'2025-12-18T17:23:27', N'2025-12-19T21:39:27', N'2025-12-19T21:55:27', N'2025-12-19T21:55:27', N'2025-12-20T17:23:27', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0053', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Digi', N'NOC Dashboard', N'Network', N'Enache Paul', N'Gateway', N'Provisioning callback failure', N'Vendor update received', N'Rolled back faulty deployment', N'App', N'Backend', N'API Error', N'2025-11-19T04:03:16', N'2025-11-20T02:50:16', N'2025-11-20T07:46:16', N'2025-11-20T07:46:16', N'2025-11-20T04:03:16', N'Config Change', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0054', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Digi', N'Network', N'Support', N'Tudor Alex', N'Billing', N'Button misaligned on payments screen', N'Vendor update received', N'Applied hotfix', N'App', N'Frontend', N'UI Bug', N'2025-11-21T14:22:56', N'2025-11-21T20:58:56', N'2025-11-22T06:40:56', N'2025-11-22T06:40:56', N'2025-11-21T22:22:56', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0055', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Vodafone', N'CRM', N'Security', N'Matei Ovidiu', N'Auth', N'Customer profile page blank', N'Root cause isolated', N'Cleared stuck messages', N'App', N'Frontend', N'UI Bug', N'2026-01-03T06:56:38', N'2026-01-04T02:28:38', N'2026-01-04T07:31:38', N'2026-01-04T07:31:38', N'2026-01-03T22:56:38', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0056', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Digi', N'Provisioning', N'Security', N'Marin Sorin', N'Server', N'Notification template rendering failed', N'Customer confirmed symptoms', N'Patched validation rule', N'App', N'Backend', N'Email', N'2025-10-24T06:02:26', N'2025-10-24T18:22:26', N'2025-10-25T02:20:26', N'2025-10-25T02:20:26', N'2025-10-25T06:02:26', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0057', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'Voice Core', N'Frontend', N'Petrescu Alina', N'DB', N'Slow query on billing DB', N'Customer confirmed symptoms', N'Adjusted timeout threshold', N'Infra', N'DB', N'Performance', N'2025-11-03T22:08:17', N'2025-11-04T10:53:17', N'2025-11-04T11:28:17', N'2025-11-04T11:28:17', N'2025-11-04T22:08:17', N'Data Correction', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0058', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Voice Core', N'Backend', N'Preda Cătălin', N'Server', N'Application server down', N'Monitored after change', N'Restarted affected service', N'Infra', N'Server', N'Crash', N'2026-01-05T17:31:41', N'2026-01-08T04:04:41', N'2026-01-08T08:33:41', N'2026-01-08T08:33:41', N'2026-01-07T17:31:41', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0059', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Messaging', N'Security', N'Tudor Alex', N'API', N'Login form validation issue', N'Logs reviewed', N'Applied hotfix', N'App', N'Frontend', N'UI Bug', N'2025-12-22T13:34:30', N'2025-12-25T22:38:30', NULL, N'2025-12-25T22:38:30', N'2025-12-24T13:34:30', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0060', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Messaging', N'Backend', N'Vasilescu Dan', N'DB', N'Button misaligned on payments screen', N'Ticket created by NOC monitoring', NULL, N'App', N'Frontend', N'UI Bug', N'2026-01-10T10:24:00', NULL, NULL, N'2026-01-10T10:24:00', N'2026-01-12T10:24:00', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0061', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Vodafone', N'Self-Care', N'Support', N'Popescu Ion', N'UI', N'Slow query on billing DB', N'Logs reviewed', N'Restarted affected service', N'Infra', N'DB', N'Performance', N'2026-02-03T08:16:29', N'2026-02-07T03:15:29', NULL, N'2026-02-07T03:15:29', N'2026-02-05T08:16:29', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0062', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Digi', N'Retail POS', N'Backend', N'Preda Cătălin', N'Server', N'Slow query on billing DB', NULL, N'Corrected ETL mapping', N'Infra', N'DB', N'Performance', N'2025-10-03T00:45:17', N'2025-10-03T12:09:17', N'2025-10-03T21:22:17', N'2025-10-03T21:22:17', N'2025-10-03T08:45:17', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0063', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Orange', N'Billing', N'Security', N'Tudor Alex', N'API', N'Timeout on invoice endpoint', N'Awaiting business approval', NULL, N'App', N'Backend', N'API Error', N'2026-01-05T18:17:38', NULL, NULL, N'2026-01-05T22:20:38', N'2026-01-06T10:17:38', NULL, 720);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0064', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Digi', N'Analytics', N'NOC', N'Ionescu Maria', N'Gateway', N'Disk full on batch server', NULL, N'Corrected ETL mapping', N'Infra', N'Server', N'Crash', N'2025-12-10T08:31:59', N'2025-12-12T00:45:59', NULL, N'2025-12-12T00:45:59', N'2025-12-12T08:31:59', N'Config Change', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0065', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Digi', N'Reports', N'Backend', N'Matei Ovidiu', N'DB', N'Order sync stuck in queue', N'Traffic rerouted', NULL, N'App', N'Backend', N'Sync', N'2025-10-22T04:00:51', NULL, NULL, N'2025-10-22T19:37:51', N'2025-10-22T20:00:51', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0066', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'Voice Core', N'Support', N'Munteanu Raluca', N'UI', N'Data mismatch in KPI ETL', N'Vendor update received', N'Updated configuration', N'App', N'Data', N'ETL Issue', N'2025-11-11T08:24:52', N'2025-11-11T18:27:52', N'2025-11-12T02:22:52', N'2025-11-12T02:22:52', N'2025-11-12T00:24:52', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0067', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Vodafone', N'Mobile App', N'Frontend', N'Dobre Andrei', N'DB', N'Dashboard widget overlap', N'Escalated to L2', N'Resized worker pool', N'App', N'Frontend', N'UI Bug', N'2025-10-07T04:38:07', N'2025-10-09T09:01:07', N'2025-10-09T11:07:07', N'2025-10-09T11:07:07', N'2025-10-08T04:38:07', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0068', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Provisioning', N'Network', N'Stoica Larisa', N'ETL', N'Latency spike on MPLS circuit', N'Issue reproduced in test', N'Restarted affected service', N'Infra', N'Network', N'Packet Loss', N'2025-12-13T19:31:57', N'2025-12-14T12:47:57', N'2025-12-14T21:06:57', N'2025-12-14T21:06:57', N'2025-12-14T03:31:57', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0069', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Digi', N'Self-Care', N'NOC', N'Enache Paul', N'Backend', N'Disk full on batch server', N'Vendor update received', N'Applied hotfix', N'Infra', N'Server', N'Crash', N'2025-10-06T21:07:28', N'2025-10-07T09:01:28', NULL, N'2025-10-07T09:01:28', N'2025-10-07T13:07:28', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0070', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Telekom', N'Mobile App', N'Support', N'Ilie Cristina', N'DB', N'Fiber cut affecting enterprise customers', N'Waiting maintenance window', NULL, N'Infra', N'Network', N'Fiber Cut', N'2026-03-24T11:33:17', NULL, NULL, N'2026-03-24T14:20:17', N'2026-03-24T19:33:17', NULL, 120);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0071', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Digi', N'Roaming', N'Data', N'Tudor Alex', N'API', N'Fiber cut affecting enterprise customers', N'Monitored after change', N'Cleared stuck messages', N'Infra', N'Network', N'Fiber Cut', N'2025-10-05T17:02:39', N'2025-10-05T23:22:39', NULL, N'2025-10-05T23:22:39', N'2025-10-06T01:02:39', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0072', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'API Gateway', N'NOC', N'Radu Mihai', N'API', N'Microwave failover not triggered', N'Root cause isolated', N'Resized worker pool', N'Infra', N'Network', N'Fiber Cut', N'2026-03-09T18:19:02', N'2026-03-10T19:45:02', NULL, N'2026-03-10T19:45:02', N'2026-03-11T18:19:02', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0073', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'NOC Dashboard', N'Frontend', N'Marin Sorin', N'ETL', N'Packet loss on metro link', N'Monitored after change', N'Restarted affected service', N'Infra', N'Network', N'Packet Loss', N'2026-01-02T12:50:15', N'2026-01-02T20:20:15', NULL, N'2026-01-02T20:20:15', N'2026-01-02T20:50:15', N'Config Change', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0074', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'Network', N'Security', N'Stan Ioana', N'Gateway', N'Password reset email delayed', N'Logs reviewed', N'Patched validation rule', N'App', N'Backend', N'Email', N'2025-11-15T11:26:01', N'2025-11-15T18:33:01', N'2025-11-15T23:48:01', N'2025-11-15T23:48:01', N'2025-11-15T19:26:01', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0075', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Digi', N'Provisioning', N'DevOps', N'Ilie Cristina', N'Gateway', N'Subscriber data sync delayed', N'Logs reviewed', N'Rolled back faulty deployment', N'App', N'Backend', N'Sync', N'2025-12-25T07:44:31', N'2025-12-25T19:21:31', N'2025-12-26T02:21:31', N'2025-12-26T02:21:31', N'2025-12-26T07:44:31', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0076', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Retail POS', N'Backend', N'Vasilescu Dan', N'Billing', N'Email not sent after payment', N'Issue reproduced in test', N'Rolled back faulty deployment', N'App', N'Backend', N'Email', N'2025-10-20T20:54:13', N'2025-10-22T05:35:13', N'2025-10-22T10:50:13', N'2025-10-22T10:50:13', N'2025-10-21T20:54:13', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0077', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Vodafone', N'CRM', N'Backend', N'Munteanu Raluca', N'Auth', N'Slow query on billing DB', N'Root cause isolated', N'Restarted affected service', N'Infra', N'DB', N'Performance', N'2025-12-12T06:44:59', N'2025-12-12T18:26:59', N'2025-12-12T22:23:59', N'2025-12-12T22:23:59', N'2025-12-12T22:44:59', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0078', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Digi', N'Roaming', N'Frontend', N'Ionescu Maria', N'DB', N'CRM sync issue', N'Root cause isolated', N'Cleared stuck messages', N'App', N'Backend', N'Sync', N'2026-01-25T09:30:55', N'2026-01-26T02:41:55', NULL, N'2026-01-26T02:41:55', N'2026-01-25T17:30:55', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0079', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Digi', N'Mobile App', N'Backend', N'Ionescu Maria', N'SMS', N'Call setup delay', N'Logs reviewed', N'Patched validation rule', N'Infra', N'Voice', N'SIP', N'2025-10-13T06:51:52', N'2025-10-14T13:59:52', N'2025-10-15T01:22:52', N'2025-10-15T01:22:52', N'2025-10-13T22:51:52', N'Optimization', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0080', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'Provisioning', N'Security', N'Tudor Alex', N'Billing', N'Inventory sync mismatch', N'Root cause isolated', N'Applied hotfix', N'App', N'Backend', N'Sync', N'2025-10-10T23:21:29', N'2025-10-11T08:53:29', N'2025-10-11T20:07:29', N'2025-10-11T20:07:29', N'2025-10-11T15:21:29', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0081', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'NOC Dashboard', N'Backend', N'Popescu Ion', N'ETL', N'Dashboard widget overlap', N'Escalated to L2', N'Updated configuration', N'App', N'Frontend', N'UI Bug', N'2025-10-23T01:07:53', N'2025-10-23T15:17:53', NULL, N'2025-10-23T15:17:53', N'2025-10-23T17:07:53', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0082', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Self-Care', N'Frontend', N'Preda Cătălin', N'Network', N'MFA challenge loop', N'Logs reviewed', N'Restarted affected service', N'App', N'Security', N'Authentication', N'2026-02-21T03:49:44', N'2026-02-21T08:15:44', N'2026-02-21T15:02:44', N'2026-02-21T15:02:44', N'2026-02-21T11:49:44', N'Optimization', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0083', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Orange', N'Customer Care', N'Frontend', N'Ionescu Maria', N'SMS', N'Application server down', N'Waiting customer confirmation', NULL, N'Infra', N'Server', N'Crash', N'2026-01-26T23:49:46', NULL, NULL, N'2026-01-27T01:21:46', N'2026-01-28T23:49:46', NULL, 180);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0084', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'Reports', N'NOC', N'Radu Mihai', N'Auth', N'Slow query on billing DB', N'Logs checked', NULL, N'Infra', N'DB', N'Performance', N'2025-12-17T14:56:57', NULL, NULL, N'2025-12-17T17:22:57', N'2025-12-18T06:56:57', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0085', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Orange', N'Reports', N'Support', N'Petrescu Alina', N'Billing', N'Provisioning callback failure', N'Monitored after change', N'Cleared stuck messages', N'App', N'Backend', N'API Error', N'2025-10-23T20:39:58', N'2025-10-24T10:31:58', N'2025-10-24T20:42:58', N'2025-10-24T20:42:58', N'2025-10-24T12:39:58', N'Data Correction', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0086', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'NOC Dashboard', N'DevOps', N'Matei Ovidiu', N'Voice', N'Password reset email delayed', NULL, N'Adjusted timeout threshold', N'App', N'Backend', N'Email', N'2025-10-05T12:56:12', N'2025-10-06T15:46:12', N'2025-10-06T19:04:12', N'2025-10-06T19:04:12', N'2025-10-06T04:56:12', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0087', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Network', N'Network', N'Popa Elena', N'Backend', N'ETL job failed on transform step', N'Logs reviewed', N'Updated configuration', N'App', N'Data', N'ETL Issue', N'2025-10-18T19:24:51', N'2025-10-20T07:56:51', NULL, N'2025-10-20T07:56:51', N'2025-10-20T19:24:51', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0088', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Vodafone', N'CRM', N'Security', N'Popa Elena', N'API', N'Packet loss on metro link', N'Logs reviewed', N'Corrected ETL mapping', N'Infra', N'Network', N'Packet Loss', N'2025-11-07T14:44:29', N'2025-11-09T01:15:29', N'2025-11-09T07:29:29', N'2025-11-09T07:29:29', N'2025-11-08T14:44:29', N'Optimization', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0089', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Roaming', N'Data', N'Matei Ovidiu', N'UI', N'Inventory sync mismatch', N'Customer confirmed symptoms', N'Applied hotfix', N'App', N'Backend', N'Sync', N'2025-11-10T10:51:25', N'2025-11-10T23:35:25', NULL, N'2025-11-10T23:35:25', N'2025-11-11T10:51:25', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0090', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'Portal', N'Data', N'Dobre Andrei', N'ETL', N'Customer profile page blank', N'Logs reviewed', N'Patched validation rule', N'App', N'Frontend', N'UI Bug', N'2025-10-23T08:18:20', N'2025-10-23T22:15:20', NULL, N'2025-10-23T22:15:20', N'2025-10-24T00:18:20', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0091', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'Fiber Rollout', N'Data', N'Preda Cătălin', N'Backend', N'Role mapping issue after deploy', N'Monitored after change', N'Added missing index', N'App', N'Security', N'Authentication', N'2025-12-09T22:53:35', N'2025-12-10T11:31:35', N'2025-12-10T17:03:35', N'2025-12-10T17:03:35', N'2025-12-10T22:53:35', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0092', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Vodafone', N'CRM', N'Backend', N'Popa Elena', N'Server', N'Expired signing certificate', N'Issue reproduced in test', N'Adjusted timeout threshold', N'App', N'Security', N'Authentication', N'2025-12-21T02:33:44', N'2025-12-22T08:01:44', N'2025-12-22T08:38:44', N'2025-12-22T08:38:44', N'2025-12-22T02:33:44', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0093', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Fiber Rollout', N'Data', N'Vasilescu Dan', N'Voice', N'Nginx worker crash', N'Escalated to L2', N'Updated configuration', N'Infra', N'Server', N'Crash', N'2025-12-20T05:49:50', N'2025-12-20T09:54:50', NULL, N'2025-12-20T09:54:50', N'2025-12-20T13:49:50', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0094', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'API Gateway', N'NOC', N'Vasilescu Dan', N'Network', N'OTP delivery delayed', N'Issue assigned to backend team', NULL, N'Infra', N'Messaging', N'SMS Delivery', N'2026-03-19T04:29:06', NULL, NULL, N'2026-03-19T07:04:06', N'2026-03-19T12:29:06', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0095', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Self-Care', N'DevOps', N'Munteanu Raluca', N'Billing', N'Expired signing certificate', N'Reproduced in staging', NULL, N'App', N'Security', N'Authentication', N'2026-01-25T20:58:15', NULL, NULL, N'2026-01-25T22:42:15', N'2026-01-26T04:58:15', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0096', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'CRM', N'Support', N'Preda Cătălin', N'UI', N'Deadlock in CRM database', N'Waiting customer confirmation', NULL, N'Infra', N'DB', N'Performance', N'2025-10-12T08:04:00', NULL, NULL, N'2025-10-12T09:04:00', N'2025-10-12T16:04:00', NULL, 30);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0097', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'Reports', N'Security', N'Munteanu Raluca', N'UI', N'Voice gateway timeout', N'Issue reproduced in test', N'Patched validation rule', N'Infra', N'Voice', N'SIP', N'2025-10-13T09:10:35', N'2025-10-13T23:23:35', N'2025-10-14T06:02:35', N'2025-10-14T06:02:35', N'2025-10-14T01:10:35', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0098', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Mobile App', N'NOC', N'Radu Mihai', N'DB', N'BGP flap in regional POP', N'Monitored after change', N'Applied hotfix', N'Infra', N'Network', N'Packet Loss', N'2025-11-15T02:34:51', N'2025-11-16T21:17:51', NULL, N'2025-11-16T21:17:51', N'2025-11-17T02:34:51', N'Data Correction', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0099', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Digi', N'Customer Care', N'Backend', N'Georgescu Ana', N'Voice', N'Timeout on invoice endpoint', N'Waiting third-party vendor', NULL, N'App', N'Backend', N'API Error', N'2025-11-20T13:24:21', NULL, NULL, N'2025-11-21T15:02:21', N'2025-11-22T13:24:21', NULL, 1440);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0100', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'NOC Dashboard', N'DevOps', N'Munteanu Raluca', N'DB', N'Daily load delayed', N'Monitored after change', N'Corrected ETL mapping', N'App', N'Data', N'ETL Issue', N'2025-12-31T16:20:03', N'2026-01-01T13:15:03', NULL, N'2026-01-01T13:15:03', N'2026-01-01T16:20:03', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0101', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'Mobile App', N'Frontend', N'Popa Elena', N'API', N'API 500 error', N'Issue reproduced in test', N'Applied hotfix', N'App', N'Backend', N'API Error', N'2025-10-21T17:09:26', N'2025-10-22T08:09:26', NULL, N'2025-10-22T08:09:26', N'2025-10-22T09:09:26', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0102', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Vodafone', N'Mobile App', N'Support', N'Georgescu Ana', N'Auth', N'Nginx worker crash', N'Patch under validation', NULL, N'Infra', N'Server', N'Crash', N'2026-03-08T18:06:47', NULL, NULL, N'2026-03-08T19:33:47', N'2026-03-09T10:06:47', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0103', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Vodafone', N'Analytics', N'Backend', N'Enache Paul', N'Network', N'API 500 error', NULL, NULL, N'App', N'Backend', N'API Error', N'2026-03-14T14:38:55', NULL, NULL, N'2026-03-14T14:38:55', N'2026-03-16T14:38:55', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0104', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'Network', N'Frontend', N'Vasilescu Dan', N'Billing', N'Index fragmentation causing slowness', N'Root cause isolated', N'Applied hotfix', N'Infra', N'DB', N'Performance', N'2025-12-01T23:17:41', N'2025-12-02T13:30:41', N'2025-12-02T19:13:41', N'2025-12-02T19:13:41', N'2025-12-02T23:17:41', N'Data Correction', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0105', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Digi', N'Billing', N'Security', N'Popescu Ion', N'ETL', N'SIP registration failures', N'Monitored after change', N'Adjusted timeout threshold', N'Infra', N'Voice', N'SIP', N'2025-12-07T08:07:10', N'2025-12-08T18:15:10', N'2025-12-08T21:24:10', N'2025-12-08T21:24:10', N'2025-12-09T08:07:10', N'Config Change', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0106', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Vodafone', N'Retail POS', N'Backend', N'Tudor Alex', N'API', N'Provisioning callback failure', N'Root cause isolated', N'Adjusted timeout threshold', N'App', N'Backend', N'API Error', N'2026-01-04T07:24:03', N'2026-01-06T00:23:03', N'2026-01-06T09:25:03', N'2026-01-06T09:25:03', N'2026-01-06T07:24:03', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0107', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Customer Care', N'Backend', N'Marin Sorin', N'SMS', N'Login form validation issue', N'Awaiting business approval', NULL, N'App', N'Frontend', N'UI Bug', N'2026-03-29T06:42:42', NULL, NULL, N'2026-03-29T07:18:42', N'2026-03-30T06:42:42', NULL, 30);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0108', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Digi', N'Network', N'Security', N'Preda Cătălin', N'Gateway', N'VPN tunnel instability', N'Waiting third-party vendor', NULL, N'Infra', N'Network', N'Packet Loss', N'2026-03-22T12:28:17', NULL, NULL, N'2026-03-22T14:27:17', N'2026-03-23T12:28:17', NULL, 120);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0109', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'Analytics', N'NOC', N'Popa Elena', N'Voice', N'SSO login failure', N'Root cause isolated', N'Patched validation rule', N'App', N'Security', N'Authentication', N'2025-12-07T16:03:35', N'2025-12-08T06:05:35', NULL, N'2025-12-08T06:05:35', N'2025-12-08T08:03:35', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0110', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'Messaging', N'Data', N'Neagu Florin', N'DB', N'Customer profile page blank', N'Escalated to L2', N'Added missing index', N'App', N'Frontend', N'UI Bug', N'2025-12-29T17:09:35', N'2025-12-30T04:01:35', NULL, N'2025-12-30T04:01:35', N'2025-12-30T09:09:35', N'Data Correction', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0111', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Orange', N'Roaming', N'DevOps', N'Radu Mihai', N'DB', N'Nginx worker crash', NULL, NULL, N'Infra', N'Server', N'Crash', N'2025-11-20T05:34:27', NULL, NULL, N'2025-11-20T05:34:27', N'2025-11-20T21:34:27', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0112', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'NOC Dashboard', N'Frontend', N'Popa Elena', N'Server', N'Microwave failover not triggered', N'Vendor update received', N'Corrected ETL mapping', N'Infra', N'Network', N'Fiber Cut', N'2025-12-24T10:53:17', N'2025-12-24T18:05:17', N'2025-12-25T02:15:17', N'2025-12-25T02:15:17', N'2025-12-24T18:53:17', N'Data Correction', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0113', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'NOC Dashboard', N'Security', N'Marin Sorin', N'Voice', N'SMPP reconnect loop', N'Vendor update received', N'Corrected ETL mapping', N'Infra', N'Messaging', N'SMS Delivery', N'2025-12-29T23:02:16', N'2025-12-30T05:28:16', N'2025-12-30T15:30:16', N'2025-12-30T15:30:16', N'2025-12-30T07:02:16', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0114', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Orange', N'Analytics', N'Frontend', N'Vasilescu Dan', N'SMS', N'ETL job failed on transform step', N'Monitored after change', N'Updated configuration', N'App', N'Data', N'ETL Issue', N'2025-11-20T10:47:36', N'2025-11-21T17:03:36', NULL, N'2025-11-21T17:03:36', N'2025-11-22T10:47:36', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0115', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Messaging', N'Support', N'Munteanu Raluca', N'ETL', N'Dropped call spike on SIP trunk', N'Investigating', NULL, N'Infra', N'Voice', N'SIP', N'2026-03-23T16:38:46', NULL, NULL, N'2026-03-25T02:24:46', N'2026-03-25T16:38:46', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0116', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Provisioning', N'Backend', N'Radu Mihai', N'Gateway', N'Index fragmentation causing slowness', N'Issue reproduced in test', N'Patched validation rule', N'Infra', N'DB', N'Performance', N'2025-10-20T15:05:58', N'2025-10-20T19:11:58', NULL, N'2025-10-20T19:11:58', N'2025-10-20T23:05:58', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0117', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Digi', N'Voice Core', N'NOC', N'Enache Paul', N'Billing', N'Dashboard widget overlap', N'Monitored after change', N'Applied hotfix', N'App', N'Frontend', N'UI Bug', N'2026-01-08T18:26:40', N'2026-01-09T17:01:40', NULL, N'2026-01-09T17:01:40', N'2026-01-09T18:26:40', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0118', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'NOC Dashboard', N'Support', N'Popescu Ion', N'Network', N'Daily load delayed', N'Vendor update received', N'Added missing index', N'App', N'Data', N'ETL Issue', N'2026-01-31T01:19:26', N'2026-01-31T14:25:26', NULL, N'2026-01-31T14:25:26', N'2026-02-01T01:19:26', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0119', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Orange', N'Provisioning', N'Security', N'Ilie Cristina', N'ETL', N'SMTP relay timeout', NULL, NULL, N'App', N'Backend', N'Email', N'2026-04-01T11:30:00', NULL, NULL, N'2026-04-01T11:30:00', N'2026-04-02T03:30:00', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0120', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Vodafone', N'Billing', N'Backend', N'Georgescu Ana', N'Billing', N'Customer profile page blank', N'Investigating', NULL, N'App', N'Frontend', N'UI Bug', N'2026-04-04T08:00:00', NULL, NULL, N'2026-04-04T09:30:00', N'2026-04-05T08:00:00', NULL, 0);
GO
