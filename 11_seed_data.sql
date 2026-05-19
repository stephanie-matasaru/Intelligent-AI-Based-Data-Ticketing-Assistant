USE TicketingSystem;
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0121', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Digi', N'NOC Dashboard', N'Backend', N'Popa Elena', N'Voice', N'Timeout error', N'Waiting customer confirmation', NULL, N'App', N'Data', N'API Error', N'2025-06-16T02:13:14', NULL, NULL, N'2025-06-17T10:51:14', N'2025-06-16T07:13:14', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0122', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'NOC Dashboard', N'NOC', N'Preda Cătălin', N'Server', N'API 500 error', N'Escalated to L2', N'Fixed JS', N'Infra', N'Security', N'Authentication', N'2025-08-19T06:48:21', N'2025-08-19T14:10:21', N'2025-08-20T02:48:21', N'2025-08-19T12:53:21', N'2025-08-21T08:48:21', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0123', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Vodafone', N'Voice Core', N'Network', N'Munteanu Raluca', N'Server', N'Daily load delayed', N'Awaiting business approval', NULL, N'App', N'Frontend', N'API Error', N'2026-05-05T07:49:18', NULL, NULL, N'2026-05-05T13:43:18', N'2026-05-06T14:49:18', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0124', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Digi', N'Roaming', N'Security', N'Radu Mihai', N'SMS', N'CRM sync issue', N'Monitored after change', NULL, N'Infra', N'Frontend', N'Crash', N'2026-04-22T05:34:46', NULL, NULL, N'2026-04-22T20:44:46', N'2026-04-24T18:34:46', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0125', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Provisioning', N'Support', N'Marin Sorin', N'API', N'SMTP relay timeout', N'Waiting third-party vendor', N'Rolled back faulty deployment', N'App', N'DB', N'Crash', N'2025-11-09T06:41:31', N'2025-11-10T01:57:31', NULL, N'2025-11-10T08:37:31', N'2025-11-11T18:41:31', N'Rollback', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0126', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'Voice Core', N'Security', N'Marin Sorin', N'UI', N'Inventory sync mismatch', N'Reproduced in staging', NULL, N'App', N'Backend', N'UI Bug', N'2025-08-18T20:10:50', NULL, NULL, N'2025-08-20T15:37:50', N'2025-08-19T06:10:50', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0127', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Infra', N'Data', N'Munteanu Raluca', N'API', N'Missing rows in churn report', N'Root cause isolated', N'Resized worker pool', N'Infra', N'Security', N'UI Bug', N'2025-10-29T13:10:29', N'2025-11-01T06:58:29', NULL, N'2025-10-29T13:56:29', N'2025-10-31T00:10:29', N'Rollback', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0128', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Digi', N'Infra', N'Backend', N'Popa Elena', N'SMS', N'BGP flap in regional POP', N'Waiting customer confirmation', N'Increased timeout', N'App', N'Security', N'SMS Delivery', N'2025-06-10T03:59:23', N'2025-06-10T20:55:23', N'2025-06-11T16:00:23', N'2025-06-10T23:14:23', N'2025-06-10T12:59:23', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0129', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'Mobile App', N'NOC', N'Munteanu Raluca', N'UI', N'Voice gateway timeout', N'Need packet capture from field team', N'Adjusted timeout threshold', N'Infra', N'DB', N'Fiber Cut', N'2025-09-11T22:19:25', N'2025-09-14T08:16:25', NULL, N'2025-09-13T17:00:25', N'2025-09-13T23:19:25', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0130', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'NOC Dashboard', N'Network', N'Stan Ioana', N'API', N'SIP registration failures', N'Waiting customer confirmation', N'Restarted affected service', N'App', N'Backend', N'UI Bug', N'2026-04-20T01:14:04', N'2026-04-20T11:46:04', NULL, N'2026-04-20T04:09:04', N'2026-04-21T21:14:04', N'Config Change', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0131', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Orange', N'Retail POS', N'Frontend', N'Preda Cătălin', N'Billing', N'Disk full on batch server', N'Vendor update received', NULL, N'Infra', N'Data', N'Performance', N'2025-07-19T03:42:27', NULL, NULL, N'2025-07-20T02:09:27', N'2025-07-21T09:42:27', NULL, 956);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0132', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Voice Core', N'Security', N'Vasilescu Dan', N'DB', N'Role mapping issue after deploy', N'Monitored after change', NULL, N'Infra', N'Network', N'SIP', N'2025-09-02T08:29:15', NULL, NULL, N'2025-09-02T12:57:15', N'2025-09-05T08:29:15', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0133', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Portal', N'Backend', N'Radu Mihai', N'Auth', N'Dashboard widget overlap', N'Reproduced in staging', NULL, N'App', N'Data', N'API Error', N'2025-08-24T12:00:24', NULL, NULL, N'2025-08-25T04:59:24', N'2025-08-27T00:00:24', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0134', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Mobile App', N'Backend', N'Tudor Alex', N'DB', N'Slow query on billing DB', N'Pending customer test results', NULL, N'App', N'Security', N'API Error', N'2025-06-26T18:30:32', NULL, NULL, N'2025-06-28T03:40:32', N'2025-06-27T03:30:32', NULL, 1040);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0135', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Vodafone', N'Portal', N'Backend', N'Neagu Florin', N'Network', N'Deadlock in CRM database', N'Vendor update received', NULL, N'App', N'Frontend', N'SIP', N'2026-05-03T18:36:33', NULL, NULL, N'2026-05-04T15:35:33', N'2026-05-05T05:36:33', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0136', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Self-Care', N'DevOps', N'Popa Elena', N'Backend', N'Application server down', N'Patch under validation', NULL, N'Infra', N'Security', N'Timeout', N'2025-07-08T00:29:39', NULL, NULL, N'2025-07-09T12:35:39', N'2025-07-08T11:29:39', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0137', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Digi', N'Mobile App', N'Security', N'Georgescu Ana', N'DB', N'OTP delivery delayed', N'Patch under validation', N'Added missing index', N'Infra', N'Voice', N'Email', N'2025-11-02T19:51:41', N'2025-11-03T16:50:41', N'2025-11-04T14:56:41', N'2025-11-04T04:51:41', N'2025-11-05T19:51:41', N'Rollback', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0138', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Retail POS', N'Frontend', N'Ilie Cristina', N'Server', N'Index fragmentation causing slowness', N'Monitored after change', NULL, N'Infra', N'DB', N'Sync', N'2026-04-21T08:32:31', NULL, NULL, N'2026-04-22T01:29:31', N'2026-04-21T16:32:31', NULL, 189);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0139', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Vodafone', N'Billing', N'Security', N'Popa Elena', N'Backend', N'Voice gateway timeout', N'Escalated to L2', N'Fixed JS', N'Infra', N'Voice', N'Email', N'2026-01-05T17:00:07', N'2026-01-08T15:02:07', NULL, N'2026-01-05T21:56:07', N'2026-01-06T14:00:07', N'Optimization', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0140', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'Mobile App', N'Support', N'Tudor Alex', N'SMS', N'Login issue', N'Awaiting business approval', N'Restarted affected service', N'App', N'Frontend', N'ETL Issue', N'2026-03-14T13:39:47', N'2026-03-15T01:30:47', N'2026-03-15T08:26:47', N'2026-03-14T23:38:47', N'2026-03-15T21:39:47', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0141', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Digi', N'Fiber Rollout', N'Backend', N'Ilie Cristina', N'UI', N'Subscriber data sync delayed', N'Root cause isolated', NULL, N'Infra', N'Backend', N'SMS Delivery', N'2025-09-22T06:52:58', NULL, NULL, N'2025-09-23T12:14:58', N'2025-09-23T23:52:58', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0142', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Vodafone', N'Analytics', N'DevOps', N'Stan Ioana', N'Server', N'Sync issue', N'Customer confirmed symptoms', NULL, N'Infra', N'Voice', N'SIP', N'2026-05-14T17:21:01', NULL, NULL, N'2026-05-15T01:17:01', N'2026-05-16T04:21:01', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0143', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Vodafone', N'CRM', N'DevOps', N'Dumitru Vlad', N'Voice', N'SMTP relay timeout', N'Waiting maintenance window', NULL, N'App', N'Data', N'Crash', N'2025-09-06T08:02:45', NULL, NULL, N'2025-09-07T11:02:45', N'2025-09-09T04:02:45', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0144', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Digi', N'Fiber Rollout', N'Network', N'Stan Ioana', N'Billing', N'SMTP relay timeout', N'Root cause isolated', N'Fixed JS', N'Infra', N'Voice', N'Authentication', N'2026-05-08T13:20:25', N'2026-05-08T22:32:25', N'2026-05-09T13:14:25', N'2026-05-10T09:38:25', N'2026-05-11T13:20:25', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0145', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'Retail POS', N'Support', N'Tudor Alex', N'Server', N'Optical power low on backbone route', N'Waiting maintenance window', NULL, N'Infra', N'Messaging', N'SMS Delivery', N'2026-01-13T21:13:32', NULL, NULL, N'2026-01-15T04:03:32', N'2026-01-14T20:13:32', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0146', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Digi', N'Portal', N'Backend', N'Tudor Alex', N'DB', N'Role mapping issue after deploy', N'Issue reproduced in test', NULL, N'App', N'Backend', N'Performance', N'2026-01-30T19:54:49', NULL, NULL, N'2026-01-31T00:23:49', N'2026-02-02T02:54:49', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0147', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'Customer Care', N'DevOps', N'Marin Sorin', N'UI', N'Application server down', NULL, N'Increased timeout', N'App', N'Data', N'Performance', N'2025-08-30T22:33:29', N'2025-08-31T07:02:29', N'2025-08-31T12:53:29', N'2025-08-31T02:08:29', N'2025-09-01T07:33:29', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0148', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'Infra', N'DevOps', N'Munteanu Raluca', N'ETL', N'BGP flap in regional POP', N'Reproduced in staging', N'Patched validation rule', N'Infra', N'DB', N'Sync', N'2025-10-20T16:31:40', N'2025-10-20T22:16:40', N'2025-10-21T08:31:40', N'2025-10-21T07:48:40', N'2025-10-23T02:31:40', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0149', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Vodafone', N'Mobile App', N'Frontend', N'Marin Sorin', N'Auth', N'Subscriber data sync delayed', N'Issue reproduced in test', NULL, N'App', N'Frontend', N'SIP', N'2025-12-26T10:34:29', NULL, NULL, N'2025-12-27T12:37:29', N'2025-12-27T14:34:29', NULL, 860);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0150', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Telekom', N'Customer Care', N'Support', N'Dumitru Vlad', N'Server', N'Dropped call spike on SIP trunk', N'Waiting maintenance window', N'Corrected ETL mapping', N'App', N'Messaging', N'Performance', N'2025-10-18T13:31:01', N'2025-10-19T12:24:01', NULL, N'2025-10-19T13:52:01', N'2025-10-20T18:31:01', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0151', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Telekom', N'Billing', N'Network', N'Nistor Bianca', N'UI', N'SMPP reconnect loop', N'Escalated to L2', NULL, N'App', N'Server', N'SIP', N'2025-11-15T06:29:20', NULL, NULL, N'2025-11-16T04:17:20', N'2025-11-17T08:29:20', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0152', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Digi', N'Portal', N'NOC', N'Popescu Ion', N'Voice', N'Password reset email delayed', N'Logs reviewed', NULL, N'Infra', N'DB', N'Sync', N'2025-07-06T20:02:48', NULL, NULL, N'2025-07-06T21:17:48', N'2025-07-07T23:02:48', NULL, 41);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0153', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Orange', N'Mobile App', N'NOC', N'Vasilescu Dan', N'Billing', N'Optical power low on backbone route', N'Logs checked', N'Fixed JS', N'Infra', N'Security', N'Packet Loss', N'2026-04-07T19:47:45', N'2026-04-08T15:53:45', N'2026-04-09T10:54:45', N'2026-04-08T03:36:45', N'2026-04-08T17:47:45', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0154', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Analytics', N'Network', N'Preda Cătălin', N'Voice', N'Daily load delayed', N'Vendor update received', N'Applied hotfix', N'Infra', N'Frontend', N'Timeout', N'2026-03-17T01:22:34', N'2026-03-17T06:54:34', N'2026-03-18T04:15:34', N'2026-03-18T05:04:34', N'2026-03-19T02:22:34', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0155', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Vodafone', N'Fiber Rollout', N'Security', N'Dobre Andrei', N'Voice', N'Email not sent', N'Waiting maintenance window', N'Added missing index', N'Infra', N'Voice', N'Timeout', N'2026-02-03T14:27:52', N'2026-02-05T09:21:52', NULL, N'2026-02-05T13:04:52', N'2026-02-05T02:27:52', N'Config Change', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0156', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'NOC Dashboard', N'NOC', N'Preda Cătălin', N'Billing', N'Timeout on invoice endpoint', N'Waiting third-party vendor', NULL, N'Infra', N'Backend', N'SMS Delivery', N'2025-11-14T05:31:13', NULL, NULL, N'2025-11-15T04:22:13', N'2025-11-15T16:31:13', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0157', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Digi', N'Retail POS', N'Support', N'Stoica Larisa', N'DB', N'Button misaligned on payments screen', N'Vendor update received', NULL, N'Infra', N'Messaging', N'Fiber Cut', N'2025-10-02T22:30:41', NULL, NULL, N'2025-10-04T20:01:41', N'2025-10-05T09:30:41', NULL, 35);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0158', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Voice Core', N'Backend', N'Tudor Alex', N'Backend', N'SIP registration failures', N'Awaiting business approval', NULL, N'Infra', N'Voice', N'Fiber Cut', N'2025-11-24T13:47:35', NULL, NULL, N'2025-11-25T11:09:35', N'2025-11-27T01:47:35', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0159', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Digi', N'NOC Dashboard', N'Network', N'Enache Paul', N'SMS', N'Server down', N'Waiting customer confirmation', NULL, N'App', N'DB', N'Performance', N'2026-02-03T08:46:37', NULL, NULL, N'2026-02-05T09:19:37', N'2026-02-04T22:46:37', NULL, 205);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0160', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Reports', N'Frontend', N'Tudor Alex', N'API', N'Login form validation issue', N'Waiting customer confirmation', NULL, N'App', N'Server', N'API Error', N'2025-06-28T17:18:44', NULL, NULL, N'2025-06-29T01:58:44', N'2025-07-01T09:18:44', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0161', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Digi', N'Customer Care', N'NOC', N'Dobre Andrei', N'SMS', N'SMS queue backlog', N'Logs reviewed', NULL, N'Infra', N'Messaging', N'UI Bug', N'2025-07-04T12:31:04', NULL, NULL, N'2025-07-06T01:11:04', N'2025-07-04T20:31:04', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0162', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Digi', N'Portal', N'Backend', N'Vasilescu Dan', N'Gateway', N'ETL job failed on transform step', N'Vendor update received', NULL, N'Infra', N'Messaging', N'SMS Delivery', N'2025-10-31T18:27:19', NULL, NULL, N'2025-11-02T07:06:19', N'2025-11-01T03:27:19', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0163', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'Analytics', N'Data', N'Georgescu Ana', N'UI', N'VPN tunnel instability', N'Escalated to L2', N'Corrected ETL mapping', N'App', N'Network', N'API Error', N'2025-12-27T14:44:38', N'2025-12-28T06:02:38', N'2025-12-29T05:20:38', N'2025-12-28T21:02:38', N'2025-12-27T20:44:38', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0164', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Digi', N'Analytics', N'DevOps', N'Vasilescu Dan', N'Gateway', N'Fiber cut affecting enterprise customers', N'Issue reproduced in test', NULL, N'Infra', N'Network', N'UI Bug', N'2025-07-01T05:50:19', NULL, NULL, N'2025-07-02T20:37:19', N'2025-07-02T19:50:19', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0165', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Telekom', N'Messaging', N'DevOps', N'Ilie Cristina', N'Gateway', N'Password reset email delayed', N'Reproduced in staging', N'Patched validation rule', N'App', N'Backend', N'SIP', N'2025-11-13T19:16:01', N'2025-11-15T06:52:01', NULL, N'2025-11-14T00:30:01', N'2025-11-13T23:16:01', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0166', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Self-Care', N'Frontend', N'Preda Cătălin', N'Auth', N'Daily load delayed', N'Reproduced in staging', NULL, N'App', N'Messaging', N'ETL Issue', N'2025-12-27T10:20:42', NULL, NULL, N'2025-12-27T17:14:42', N'2025-12-28T08:20:42', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0167', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Messaging', N'DevOps', N'Munteanu Raluca', N'API', N'SMPP reconnect loop', N'Investigating', NULL, N'Infra', N'Server', N'ETL Issue', N'2025-07-30T12:55:32', NULL, NULL, N'2025-07-30T13:37:32', N'2025-08-02T11:55:32', NULL, 946);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0168', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'Infra', N'Security', N'Petrescu Alina', N'ETL', N'Daily load delayed', N'Logs checked', N'Increased timeout', N'App', N'DB', N'Authentication', N'2026-03-09T04:59:18', N'2026-03-09T21:00:18', NULL, N'2026-03-10T09:55:18', N'2026-03-11T20:59:18', N'Data Correction', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0169', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Digi', N'Retail POS', N'Support', N'Munteanu Raluca', N'Auth', N'Button misaligned on payments screen', N'Vendor update received', NULL, N'App', N'Messaging', N'UI Bug', N'2026-04-28T04:31:59', NULL, NULL, N'2026-04-30T01:49:59', N'2026-04-30T23:31:59', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0170', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Customer Care', N'Backend', N'Dobre Andrei', N'Gateway', N'Email not sent', N'Waiting third-party vendor', NULL, N'App', N'Voice', N'Email', N'2025-08-09T02:17:49', NULL, NULL, N'2025-08-10T04:38:49', N'2025-08-11T20:17:49', NULL, 547);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0171', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Digi', N'Customer Care', N'Frontend', N'Dobre Andrei', N'Gateway', N'Disk full on batch server', N'Awaiting business approval', NULL, N'Infra', N'Voice', N'Timeout', N'2026-03-06T12:29:59', NULL, NULL, N'2026-03-07T09:24:59', N'2026-03-07T14:29:59', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0172', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Orange', N'Fiber Rollout', N'Support', N'Stan Ioana', N'Voice', N'Disk full on batch server', N'Waiting third-party vendor', NULL, N'Infra', N'Network', N'SMS Delivery', N'2025-06-19T04:32:37', NULL, NULL, N'2025-06-20T02:27:37', N'2025-06-19T18:32:37', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0173', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Telekom', N'Billing', N'Frontend', N'Nistor Bianca', N'Backend', N'Email not sent', N'Investigating', N'Patched validation rule', N'Infra', N'Security', N'Crash', N'2025-12-21T20:05:54', N'2025-12-23T21:25:54', NULL, N'2025-12-22T17:59:54', N'2025-12-24T18:05:54', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0174', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'NOC Dashboard', N'Data', N'Marin Sorin', N'Voice', N'Button misaligned on payments screen', N'Waiting maintenance window', N'Applied hotfix', N'App', N'Messaging', N'Packet Loss', N'2025-11-01T00:02:20', N'2025-11-02T00:29:20', N'2025-11-02T05:44:20', N'2025-11-01T03:20:20', N'2025-11-02T23:02:20', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0175', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Orange', N'API Gateway', N'Network', N'Petrescu Alina', N'Auth', N'SSO login failure', N'Vendor update received', N'Patched validation rule', N'App', N'DB', N'SMS Delivery', N'2026-04-23T08:29:16', N'2026-04-24T22:12:16', NULL, N'2026-04-25T02:29:16', N'2026-04-25T21:29:16', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0176', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Telekom', N'Reports', N'Data', N'Nistor Bianca', N'Voice', N'Voice gateway timeout', N'Logs checked', NULL, N'Infra', N'DB', N'SIP', N'2026-02-03T03:15:24', NULL, NULL, N'2026-02-04T15:37:24', N'2026-02-04T18:15:24', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0177', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Telekom', N'Self-Care', N'Support', N'Preda Cătălin', N'Backend', N'Expired signing certificate', N'Logs reviewed', NULL, N'Infra', N'Server', N'Timeout', N'2025-09-26T19:51:22', NULL, NULL, N'2025-09-27T10:31:22', N'2025-09-27T21:51:22', NULL, 1271);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0178', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Vodafone', N'Network', N'Data', N'Dobre Andrei', N'API', N'SIP registration failures', N'Awaiting business approval', NULL, N'App', N'Frontend', N'Authentication', N'2025-11-15T23:26:11', NULL, NULL, N'2025-11-16T11:34:11', N'2025-11-18T22:26:11', NULL, 749);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0179', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Self-Care', N'NOC', N'Tudor Alex', N'Voice', N'Order sync stuck in queue', N'Root cause isolated', N'Patched validation rule', N'App', N'Network', N'Timeout', N'2025-09-24T21:46:43', N'2025-09-25T04:36:43', N'2025-09-25T17:36:43', N'2025-09-25T23:40:43', N'2025-09-26T21:46:43', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0180', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Telekom', N'Reports', N'Data', N'Preda Cătălin', N'Auth', N'Daily load delayed', N'Awaiting business approval', N'Applied hotfix', N'App', N'Messaging', N'API Error', N'2026-04-14T17:20:58', N'2026-04-16T11:12:58', N'2026-04-17T03:10:58', N'2026-04-16T08:34:58', N'2026-04-15T03:20:58', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0181', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'Network', N'Support', N'Tudor Alex', N'ETL', N'Server down', N'Root cause isolated', N'Restarted affected service', N'App', N'Data', N'SMS Delivery', N'2025-12-07T21:47:44', N'2025-12-10T04:28:44', NULL, N'2025-12-09T08:13:44', N'2025-12-08T18:47:44', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0182', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Digi', N'Network', N'Security', N'Enache Paul', N'ETL', N'Provisioning callback failure', N'Vendor update received', N'Updated configuration', N'App', N'Security', N'Fiber Cut', N'2026-04-27T11:03:25', N'2026-04-29T22:08:25', NULL, N'2026-04-28T04:15:25', N'2026-04-28T04:03:25', N'Config Change', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0183', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Provisioning', N'Backend', N'Popa Elena', N'Billing', N'Optical power low on backbone route', N'Investigating', N'Increased timeout', N'App', N'DB', N'Performance', N'2025-11-16T04:50:57', N'2025-11-16T14:58:57', N'2025-11-17T09:14:57', N'2025-11-17T18:50:57', N'2025-11-17T17:50:57', N'Rollback', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0184', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'Billing', N'Security', N'Marin Sorin', N'Billing', N'SMTP relay timeout', NULL, NULL, N'App', N'Server', N'API Error', N'2025-08-04T23:26:33', NULL, NULL, N'2025-08-05T07:13:33', N'2025-08-05T09:26:33', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0185', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Digi', N'Infra', N'Network', N'Dobre Andrei', N'Gateway', N'Fiber cut affecting enterprise customers', N'Logs reviewed', N'Fixed JS', N'Infra', N'Messaging', N'Sync', N'2025-06-16T01:30:54', N'2025-06-18T17:15:54', NULL, N'2025-06-17T02:57:54', N'2025-06-16T16:30:54', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0186', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Digi', N'Mobile App', N'Network', N'Popa Elena', N'Server', N'SSO login failure', N'Pending customer test results', NULL, N'Infra', N'Data', N'Crash', N'2026-02-27T09:29:32', NULL, NULL, N'2026-02-28T23:56:32', N'2026-02-27T23:29:32', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0187', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'Roaming', N'Backend', N'Nistor Bianca', N'SMS', N'SMPP reconnect loop', N'Waiting third-party vendor', NULL, N'Infra', N'Frontend', N'ETL Issue', N'2026-01-05T10:42:16', NULL, NULL, N'2026-01-06T09:51:16', N'2026-01-08T00:42:16', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0188', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Portal', N'DevOps', N'Vasilescu Dan', N'Voice', N'Expired signing certificate', N'Awaiting business approval', NULL, N'App', N'Voice', N'API Error', N'2026-03-28T17:35:21', NULL, NULL, N'2026-03-30T11:42:21', N'2026-03-30T23:35:21', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0189', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Vodafone', N'Messaging', N'Data', N'Dumitru Vlad', N'Network', N'Deadlock in CRM database', N'Need packet capture from field team', NULL, N'App', N'Network', N'Sync', N'2026-02-02T07:54:06', NULL, NULL, N'2026-02-03T06:48:06', N'2026-02-04T08:54:06', NULL, 235);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0190', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'Retail POS', N'Support', N'Petrescu Alina', N'Backend', N'Subscriber data sync delayed', N'Customer confirmed symptoms', NULL, N'App', N'Network', N'Authentication', N'2025-11-06T10:22:00', NULL, NULL, N'2025-11-06T22:17:00', N'2025-11-07T06:22:00', NULL, 1159);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0191', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'Billing', N'Network', N'Stoica Larisa', N'DB', N'Dropped call spike on SIP trunk', N'Waiting maintenance window', N'Patched validation rule', N'Infra', N'Network', N'ETL Issue', N'2025-11-07T23:20:49', N'2025-11-08T06:29:49', NULL, N'2025-11-09T11:58:49', N'2025-11-08T11:20:49', N'Rollback', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0192', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Self-Care', N'NOC', N'Nistor Bianca', N'ETL', N'Index fragmentation causing slowness', N'Logs checked', N'Cleared stuck messages', N'Infra', N'DB', N'Timeout', N'2026-02-18T03:22:27', N'2026-02-19T14:04:27', N'2026-02-20T00:06:27', N'2026-02-18T10:40:27', N'2026-02-20T19:22:27', N'Config Change', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0193', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Analytics', N'Data', N'Enache Paul', N'UI', N'Voice gateway timeout', N'Patch under validation', N'Updated configuration', N'App', N'Backend', N'SMS Delivery', N'2026-01-07T05:08:24', N'2026-01-09T22:43:24', NULL, N'2026-01-08T15:53:24', N'2026-01-08T12:08:24', N'Optimization', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0194', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Vodafone', N'Fiber Rollout', N'Support', N'Dobre Andrei', N'Network', N'SMTP relay timeout', N'Pending customer test results', NULL, N'Infra', N'Data', N'Email', N'2026-04-24T13:18:07', NULL, NULL, N'2026-04-25T14:19:07', N'2026-04-26T08:18:07', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0195', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Digi', N'Portal', N'DevOps', N'Vasilescu Dan', N'DB', N'Latency spike on MPLS circuit', N'Pending customer test results', NULL, N'Infra', N'Voice', N'UI Bug', N'2025-12-20T09:47:21', NULL, NULL, N'2025-12-21T00:08:21', N'2025-12-21T08:47:21', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0196', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'Reports', N'Security', N'Popa Elena', N'DB', N'Timeout error', N'Issue reproduced in test', NULL, N'Infra', N'DB', N'Packet Loss', N'2026-04-05T04:48:48', NULL, NULL, N'2026-04-06T21:52:48', N'2026-04-06T04:48:48', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0197', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Provisioning', N'Security', N'Popa Elena', N'ETL', N'Sync issue', N'Reproduced in staging', N'Patched validation rule', N'Infra', N'Server', N'Crash', N'2025-06-29T11:32:04', N'2025-06-29T16:35:04', NULL, N'2025-06-30T07:01:04', N'2025-07-01T22:32:04', N'Optimization', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0198', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Infra', N'DevOps', N'Dobre Andrei', N'Billing', N'MFA challenge loop', N'Logs reviewed', NULL, N'Infra', N'DB', N'ETL Issue', N'2026-04-06T15:32:09', NULL, NULL, N'2026-04-06T19:00:09', N'2026-04-07T06:32:09', NULL, 703);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0199', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Vodafone', N'NOC Dashboard', N'NOC', N'Dobre Andrei', N'Gateway', N'Microwave failover not triggered', N'Escalated to L2', NULL, N'Infra', N'Security', N'Authentication', N'2025-12-16T13:49:21', NULL, NULL, N'2025-12-18T09:27:21', N'2025-12-16T21:49:21', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0200', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Digi', N'CRM', N'DevOps', N'Tudor Alex', N'Server', N'Notification template rendering failed', N'Issue reproduced in test', NULL, N'Infra', N'Frontend', N'Crash', N'2026-05-06T04:58:22', NULL, NULL, N'2026-05-07T00:39:22', N'2026-05-08T08:58:22', NULL, 264);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0201', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Digi', N'Retail POS', N'DevOps', N'Stan Ioana', N'UI', N'Timeout on invoice endpoint', N'Need packet capture from field team', N'Applied hotfix', N'Infra', N'Voice', N'ETL Issue', N'2025-06-10T11:19:11', N'2025-06-11T00:33:11', N'2025-06-11T05:42:11', N'2025-06-11T00:40:11', N'2025-06-13T03:19:11', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0202', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Provisioning', N'Frontend', N'Petrescu Alina', N'Auth', N'Email not sent', N'Escalated to L2', NULL, N'App', N'Network', N'Email', N'2026-01-11T01:26:23', NULL, NULL, N'2026-01-12T21:12:23', N'2026-01-12T09:26:23', NULL, 909);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0203', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'NOC Dashboard', N'Backend', N'Tudor Alex', N'ETL', N'Role mapping issue after deploy', N'Awaiting business approval', N'Resized worker pool', N'Infra', N'Messaging', N'Timeout', N'2025-10-23T12:32:33', N'2025-10-25T03:40:33', N'2025-10-25T12:43:33', N'2025-10-24T14:42:33', N'2025-10-24T15:32:33', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0204', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Messaging', N'Network', N'Radu Mihai', N'Server', N'Provisioning callback failure', N'Need packet capture from field team', NULL, N'App', N'Data', N'UI Bug', N'2025-09-22T14:56:22', NULL, NULL, N'2025-09-22T16:22:22', N'2025-09-22T22:56:22', NULL, 811);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0205', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Voice Core', N'Network', N'Dumitru Vlad', N'DB', N'Packet loss on metro link', N'Traffic rerouted', N'Applied hotfix', N'Infra', N'Network', N'Packet Loss', N'2025-06-20T09:58:53', N'2025-06-22T08:28:53', N'2025-06-23T00:07:53', N'2025-06-21T16:42:53', N'2025-06-21T04:58:53', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0206', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Digi', N'Analytics', N'Frontend', N'Munteanu Raluca', N'Voice', N'Index fragmentation causing slowness', N'Need packet capture from field team', NULL, N'Infra', N'Frontend', N'Timeout', N'2025-10-26T07:19:07', NULL, NULL, N'2025-10-26T10:34:07', N'2025-10-28T14:19:07', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0207', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Vodafone', N'CRM', N'NOC', N'Petrescu Alina', N'Gateway', N'Packet loss on metro link', N'Need packet capture from field team', N'Adjusted timeout threshold', N'App', N'Network', N'Authentication', N'2026-01-06T00:39:22', N'2026-01-06T13:21:22', N'2026-01-07T11:26:22', N'2026-01-06T16:15:22', N'2026-01-08T07:39:22', N'Infra Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0208', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Voice Core', N'NOC', N'Ionescu Maria', N'Backend', N'Dropped call spike on SIP trunk', N'Awaiting business approval', NULL, N'Infra', N'Backend', N'ETL Issue', N'2025-07-05T11:15:46', NULL, NULL, N'2025-07-07T05:55:46', N'2025-07-06T02:15:46', NULL, 1191);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0209', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Vodafone', N'Reports', N'Security', N'Radu Mihai', N'Backend', N'SMPP reconnect loop', N'Reproduced in staging', NULL, N'App', N'Network', N'UI Bug', N'2026-01-21T01:18:12', NULL, NULL, N'2026-01-21T04:08:12', N'2026-01-22T04:18:12', NULL, 85);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0210', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'Retail POS', N'NOC', N'Ilie Cristina', N'API', N'Application server down', N'Monitored after change', NULL, N'Infra', N'Security', N'Timeout', N'2025-06-25T20:21:17', NULL, NULL, N'2025-06-26T04:12:17', N'2025-06-27T21:21:17', NULL, 894);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0211', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Provisioning', N'Frontend', N'Matei Ovidiu', N'Voice', N'Dashboard widget overlap', N'Awaiting business approval', N'Increased timeout', N'Infra', N'Frontend', N'Email', N'2026-01-04T02:27:38', N'2026-01-05T20:33:38', NULL, N'2026-01-04T14:01:38', N'2026-01-05T17:27:38', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0212', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Digi', N'Roaming', N'DevOps', N'Radu Mihai', N'Voice', N'Provisioning callback failure', N'Awaiting business approval', NULL, N'Infra', N'Backend', N'Email', N'2025-11-28T19:27:17', NULL, NULL, N'2025-11-30T12:17:17', N'2025-11-29T04:27:17', NULL, 153);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0213', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Billing', N'Frontend', N'Petrescu Alina', N'Backend', N'Provisioning callback failure', N'Logs reviewed', N'Added missing index', N'App', N'DB', N'Timeout', N'2026-04-27T11:23:24', N'2026-04-29T21:46:24', NULL, N'2026-04-28T23:25:24', N'2026-04-28T08:23:24', N'Optimization', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0214', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'Infra', N'Security', N'Neagu Florin', N'SMS', N'Application server down', N'Customer confirmed symptoms', N'Restarted affected service', N'App', N'Backend', N'Email', N'2025-09-04T15:33:24', N'2025-09-06T02:18:24', NULL, N'2025-09-06T02:40:24', N'2025-09-06T02:33:24', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0215', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'Analytics', N'Network', N'Popa Elena', N'Network', N'Provisioning callback failure', N'Escalated to L2', NULL, N'Infra', N'Frontend', N'Timeout', N'2026-05-16T10:42:22', NULL, NULL, N'2026-05-18T07:46:22', N'2026-05-19T10:42:22', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0216', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Digi', N'API Gateway', N'Frontend', N'Dumitru Vlad', N'Gateway', N'Fiber cut affecting enterprise customers', N'Root cause isolated', N'Restarted affected service', N'App', N'DB', N'Timeout', N'2026-02-08T00:23:35', N'2026-02-09T12:31:35', N'2026-02-10T09:27:35', N'2026-02-09T12:46:35', N'2026-02-10T13:23:35', N'Fix', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0217', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'Customer Care', N'DevOps', N'Nistor Bianca', N'Billing', N'Sync issue', N'Issue reproduced in test', NULL, N'Infra', N'Frontend', N'SMS Delivery', N'2026-01-25T21:33:22', NULL, NULL, N'2026-01-26T06:29:22', N'2026-01-28T21:33:22', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0218', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Orange', N'Fiber Rollout', N'Support', N'Vasilescu Dan', N'Gateway', N'Email not sent', N'Patch under validation', N'Added missing index', N'App', N'Security', N'Email', N'2025-09-24T11:33:57', N'2025-09-25T04:45:57', N'2025-09-26T02:20:57', N'2025-09-25T06:27:57', N'2025-09-24T23:33:57', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0219', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Vodafone', N'Infra', N'Frontend', N'Preda Cătălin', N'Billing', N'Email not sent', N'Escalated to L2', NULL, N'Infra', N'Backend', N'API Error', N'2025-07-12T01:41:49', NULL, NULL, N'2025-07-13T13:57:49', N'2025-07-13T05:41:49', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0220', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Vodafone', N'Customer Care', N'Data', N'Tudor Alex', N'ETL', N'VPN tunnel instability', N'Waiting third-party vendor', N'Rolled back faulty deployment', N'Infra', N'Frontend', N'Email', N'2025-07-01T05:28:26', N'2025-07-02T04:06:26', N'2025-07-02T09:26:26', N'2025-07-02T11:57:26', N'2025-07-02T09:28:26', N'Optimization', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0221', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Orange', N'Reports', N'Network', N'Stan Ioana', N'DB', N'SMPP reconnect loop', N'Root cause isolated', NULL, N'Infra', N'Messaging', N'Performance', N'2025-08-12T03:03:18', NULL, NULL, N'2025-08-13T03:58:18', N'2025-08-14T10:03:18', NULL, 508);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0222', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Digi', N'Analytics', N'Frontend', N'Matei Ovidiu', N'Gateway', N'SMPP reconnect loop', N'Reproduced in staging', NULL, N'Infra', N'Messaging', N'API Error', N'2025-07-17T12:32:29', NULL, NULL, N'2025-07-18T03:45:29', N'2025-07-19T11:32:29', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0223', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Digi', N'Customer Care', N'NOC', N'Tudor Alex', N'Gateway', N'API 500 error', N'Root cause isolated', NULL, N'Infra', N'Network', N'Authentication', N'2025-12-05T12:23:02', NULL, NULL, N'2025-12-06T13:26:02', N'2025-12-06T14:23:02', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0224', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Vodafone', N'Voice Core', N'NOC', N'Munteanu Raluca', N'Server', N'SSO login failure', N'Root cause isolated', NULL, N'App', N'Frontend', N'SIP', N'2025-12-09T10:35:23', NULL, NULL, N'2025-12-11T10:44:23', N'2025-12-10T13:35:23', NULL, 1233);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0225', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Vodafone', N'Network', N'Support', N'Popa Elena', N'Voice', N'Order sync stuck in queue', N'Reproduced in staging', N'Corrected ETL mapping', N'Infra', N'Network', N'Crash', N'2026-02-19T04:20:59', N'2026-02-20T06:59:59', N'2026-02-21T07:52:59', N'2026-02-20T19:40:59', N'2026-02-20T02:20:59', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0226', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'Messaging', N'NOC', N'Popescu Ion', N'SMS', N'Order sync stuck in queue', N'Root cause isolated', N'Cleared stuck messages', N'Infra', N'Backend', N'Crash', N'2026-01-29T08:41:50', N'2026-01-31T07:44:50', N'2026-02-01T03:14:50', N'2026-01-30T22:17:50', N'2026-01-30T15:41:50', N'Rollback', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0227', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Orange', N'NOC Dashboard', N'Support', N'Preda Cătălin', N'Voice', N'Server down', N'Monitored after change', NULL, N'Infra', N'Security', N'SIP', N'2025-08-17T13:44:13', N'2025-08-19T14:30:13', N'2025-08-19T17:15:13', N'2025-08-18T16:16:13', N'2025-08-20T03:44:13', N'Rollback', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0228', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Digi', N'Customer Care', N'DevOps', N'Stan Ioana', N'UI', N'SMPP reconnect loop', N'Waiting customer confirmation', N'Updated configuration', N'Infra', N'Server', N'Crash', N'2026-02-03T06:15:17', N'2026-02-04T03:04:17', N'2026-02-04T13:49:17', N'2026-02-04T17:34:17', N'2026-02-04T12:15:17', N'Config Change', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0229', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Telekom', N'Reports', N'Data', N'Tudor Alex', N'Network', N'Deadlock in CRM database', N'Waiting customer confirmation', N'Cleared stuck messages', N'Infra', N'Security', N'Timeout', N'2025-08-14T09:02:18', N'2025-08-16T18:43:18', NULL, N'2025-08-16T06:07:18', N'2025-08-16T07:02:18', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0230', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Orange', N'Retail POS', N'Data', N'Munteanu Raluca', N'Voice', N'Customer profile page blank', N'Issue reproduced in test', N'Applied hotfix', N'App', N'DB', N'API Error', N'2026-05-09T16:14:40', N'2026-05-11T21:35:40', NULL, N'2026-05-10T06:17:40', N'2026-05-10T06:14:40', N'Restart', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0231', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Vodafone', N'Retail POS', N'Frontend', N'Nistor Bianca', N'Backend', N'Disk full on batch server', N'Reproduced in staging', NULL, N'App', N'Server', N'ETL Issue', N'2025-10-25T20:03:58', NULL, NULL, N'2025-10-26T01:44:58', N'2025-10-27T03:03:58', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0232', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Orange', N'Fiber Rollout', N'Frontend', N'Ionescu Maria', N'Auth', N'Dashboard widget overlap', N'Escalated to L2', N'Fixed JS', N'Infra', N'Backend', N'API Error', N'2025-10-31T18:38:06', N'2025-11-02T13:12:06', N'2025-11-03T06:43:06', N'2025-11-01T15:56:06', N'2025-11-03T06:38:06', N'Rollback', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0233', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Digi', N'Analytics', N'Network', N'Stan Ioana', N'UI', N'Notification template rendering failed', N'Logs checked', N'Resized worker pool', N'Infra', N'Network', N'API Error', N'2025-11-20T09:36:43', N'2025-11-22T02:30:43', N'2025-11-23T00:27:43', N'2025-11-22T09:48:43', N'2025-11-21T09:36:43', N'Workaround', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0234', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Vodafone', N'Voice Core', N'Network', N'Radu Mihai', N'UI', N'Disk full on batch server', N'Traffic rerouted', N'Restarted affected service', N'App', N'Server', N'SIP', N'2025-09-29T14:48:17', N'2025-10-01T01:29:17', NULL, N'2025-09-30T12:07:17', N'2025-09-29T17:48:17', N'Optimization', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0235', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Vodafone', N'Roaming', N'Data', N'Radu Mihai', N'Auth', N'Missing rows in churn report', N'Need packet capture from field team', NULL, N'Infra', N'Frontend', N'Sync', N'2025-10-30T11:39:14', NULL, NULL, N'2025-10-31T01:47:14', N'2025-11-02T02:39:14', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0236', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Digi', N'Fiber Rollout', N'NOC', N'Munteanu Raluca', N'Backend', N'Optical power low on backbone route', N'Vendor update received', NULL, N'App', N'Voice', N'SMS Delivery', N'2026-02-26T22:23:04', NULL, NULL, N'2026-02-28T10:30:04', N'2026-02-27T07:23:04', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0237', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Orange', N'API Gateway', N'Security', N'Stoica Larisa', N'ETL', N'Server down', N'Monitored after change', N'Fixed JS', N'Infra', N'Frontend', N'Fiber Cut', N'2026-01-15T01:29:08', N'2026-01-16T14:32:08', N'2026-01-17T09:01:08', N'2026-01-16T09:55:08', N'2026-01-17T13:29:08', N'Patch', 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0238', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Digi', N'Billing', N'Backend', N'Preda Cătălin', N'Network', N'Login issue', N'Waiting maintenance window', NULL, N'Infra', N'Frontend', N'Fiber Cut', N'2025-07-01T02:59:30', NULL, NULL, N'2025-07-01T05:17:30', N'2025-07-03T08:59:30', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0239', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'Reports', N'DevOps', N'Dobre Andrei', N'Auth', N'Dropped call spike on SIP trunk', N'Investigating', NULL, N'App', N'Security', N'UI Bug', N'2025-08-31T17:25:33', NULL, NULL, N'2025-09-01T02:11:33', N'2025-09-01T23:25:33', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0240', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Critical'), N'Digi', N'Roaming', N'DevOps', N'Munteanu Raluca', N'Auth', N'Fiber cut affecting enterprise customers', N'Vendor update received', NULL, N'Infra', N'Security', N'Packet Loss', N'2025-10-20T06:59:56', NULL, NULL, N'2025-10-22T05:47:56', N'2025-10-20T22:59:56', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0241', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Vodafone', N'NOC Dashboard', N'Backend', N'Georgescu Ana', N'Network', N'Index fragmentation causing slowness', N'Logs reviewed', NULL, N'Infra', N'Backend', N'Performance', N'2025-06-23T12:28:14', NULL, NULL, N'2025-06-24T22:41:14', N'2025-06-23T21:28:14', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0242', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Orange', N'Provisioning', N'Security', N'Marin Sorin', N'Server', N'Email not sent', N'Need packet capture from field team', NULL, N'App', N'Data', N'Authentication', N'2025-10-19T01:35:37', NULL, NULL, N'2025-10-21T01:33:37', N'2025-10-20T01:35:37', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0243', N'Resolved', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Vodafone', N'Reports', N'DevOps', N'Stoica Larisa', N'SMS', N'Subscriber data sync delayed', N'Waiting maintenance window', N'Cleared stuck messages', N'App', N'Server', N'SIP', N'2025-09-03T17:30:15', N'2025-09-06T06:28:15', NULL, N'2025-09-04T07:49:15', N'2025-09-04T13:30:15', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0244', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Telekom', N'Retail POS', N'Frontend', N'Neagu Florin', N'DB', N'Voice gateway timeout', N'Monitored after change', N'Updated configuration', N'App', N'Messaging', N'ETL Issue', N'2025-07-18T17:46:53', N'2025-07-19T19:29:53', N'2025-07-20T16:07:53', N'2025-07-19T05:49:53', N'2025-07-20T05:46:53', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0245', N'Open', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Orange', N'Customer Care', N'Backend', N'Stan Ioana', N'Server', N'API 500 error', N'Monitored after change', NULL, N'App', N'Frontend', N'Email', N'2026-02-01T07:44:38', NULL, NULL, N'2026-02-03T04:57:38', N'2026-02-03T11:44:38', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0246', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Digi', N'Voice Core', N'NOC', N'Munteanu Raluca', N'Backend', N'CRM sync issue', N'Patch under validation', NULL, N'Infra', N'Security', N'Fiber Cut', N'2026-02-10T14:06:51', NULL, NULL, N'2026-02-12T12:36:51', N'2026-02-12T08:06:51', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0247', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Medium'), N'Digi', N'Fiber Rollout', N'Support', N'Preda Cătălin', N'DB', N'Expired signing certificate', N'Issue reproduced in test', NULL, N'App', N'Server', N'Fiber Cut', N'2026-03-27T18:46:26', NULL, NULL, N'2026-03-28T12:55:26', N'2026-03-28T21:46:26', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0248', N'Pending', (SELECT priority_id FROM priorities WHERE priority_name = N'High'), N'Telekom', N'NOC Dashboard', N'NOC', N'Munteanu Raluca', N'Backend', N'Missing rows in churn report', N'Traffic rerouted', NULL, N'Infra', N'Messaging', N'Email', N'2026-04-25T23:31:29', NULL, NULL, N'2026-04-26T10:17:29', N'2026-04-27T22:31:29', NULL, 346);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0249', N'In Progress', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Orange', N'Retail POS', N'Support', N'Stoica Larisa', N'API', N'Sync issue', N'Logs reviewed', NULL, N'App', N'Data', N'Packet Loss', N'2026-04-19T07:04:45', NULL, NULL, N'2026-04-19T16:04:45', N'2026-04-20T12:04:45', NULL, 0);
GO

INSERT INTO tickets (ticket_number, status, priority_id, company, project, team, assigned_person,
service, description, notes, resolution, cat_t1, cat_t2, cat_t3,
submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration)
VALUES (N'INC0250', N'Closed', (SELECT priority_id FROM priorities WHERE priority_name = N'Low'), N'Digi', N'Network', N'NOC', N'Matei Ovidiu', N'API', N'API 500 error', N'Waiting customer confirmation', N'Corrected ETL mapping', N'Infra', N'Backend', N'API Error', N'2026-02-27T23:17:34', N'2026-03-01T21:00:34', N'2026-03-02T11:51:34', N'2026-02-28T17:18:34', N'2026-03-02T17:17:34', N'Rollback', 0);
GO