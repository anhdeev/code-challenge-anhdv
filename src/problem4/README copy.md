1. Overview

The Real-Time Scoreboard API Module is designed to handle score updates, maintain a top 10 score leaderboard, and provide real-time updates to clients.

2. Functional Requirements
	•	Only authenticated user able to update score via REST API.
	•	Avoid user cheating score with encrypt.
	•	Maintain a real-time top N leaderboard in Redis cache.
	•	Support both WebSocket-based broadcasting and HTTP request for real-time leaderboard query.
	•	Process score updates in background with queue.
	•	Log all score update events for audit and analytics.

3. Non-Functional Requirements
	•	Scalability: Handle thousands of concurrent score updates.
	•	Low Latency: Update the leaderboard with minimum delays.
	•	Reliability: Ensure no data loss during message queue processing and handle exception case.
	•	Monitoring: Track performance, errors, and activity metrics.

4. Solution Analysis
	•	Kong Gateway: Handles API authentication, authorization, and rate limiting. It also can integrate and parse swagger document for seamless ci/cd process.
	•	RabbitMQ: Enables asynchronous score update job processing, update database sequentially and message persistence on disk, ensuring reliability and scalability. 
	•	Redis: Provides in-memory caching for fast leaderboard operations.
	•	PostgreSQL: Relation with sql is good for this data structure.
	•	WebSocket Services: for realtime broadcasting, we either can have self-managed websocket services or using cloud solution like AWS API gateway. This depends on cost 	and how large the traffic is.
	•	EFK Stack: (Elasticsearch, Fluentd, Kibana) to store historical user updates for audit and monitoring. Or considering to the cost we can persit historical data to db table instead.
	*   Background process: use labmda function for efficient cost and managment as few second delay of coldstart is not impacting too much to user experiment on the scoreboard. 

5. Architecture Overview
	•	Components:
	•	Clients: Send HTTP requests for score updates and consume WebSocket updates.
	•	Kong Gateway: Secures APIs with OAuth2 and manages rate limiting.
	•	Score Service: Receives requests, validates payloads, and logs events.
	•	RabbitMQ: Buffers requests for worker processing.
	•	Worker: Processes batched score updates, handles Redis and database updates.
	•	Redis: Maintains the top N leaderboard for real-time queries.
	•	Database (PostgreSQL): Stores all user scores persistently.
	•	WebSocket Services: Sends real-time updates to connected clients.
	•	EFK Stack: Captures logs for historical tracking and debugging.
	•	Scheduled Lambda Jobs:
	•	Maintain top N scores in Redis.
	•	Broadcast leaderboard updates via WebSocket.

6. Flow of Execution
	1.	Score Update Request:
	•	Clients send score updates via Kong Gateway with a valid OAuth2 token.
	•	Kong authenticates and forwards the request to the Score Service.
	2.	Queueing the Job:
	•	The Score Service pushes the score update request to RabbitMQ for asynchronous processing.
	3.	Batch Processing:
	•	Workers consume jobs from RabbitMQ, aggregate updates, and execute batch INSERT ... ON CONFLICT queries to update PostgreSQL.
	•	Workers also update Redis for real-time leaderboard adjustments.
	4.	Leaderboard Maintenance:
	•	A scheduled Lambda ensures only top N users remain in Redis.
	5.	Broadcasting Updates:
	•	A separate scheduled Lambda broadcasts the latest leaderboard to WebSocket services.
	6.	Historical Logging:
	•	The Score Service logs all events to EFK for tracking and analytics.

7. Database Design
	•	Tables:
	•	Users:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(50) UNIQUE NOT NULL,
    score INTEGER DEFAULT 0,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


	•	Historical Logs (optional):

CREATE TABLE score_logs (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    scoreChange INTEGER NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


	•	Indexes:
	•	Index on userId for fast lookups.
	•	Partitioning on score_logs by timestamp for efficient querying and longterm run.

8. API Design
	•	Endpoints:
	•	POST /update-score: (private)
	•	Accepts userId and score increment.
	•	GET /leaderboard:  (public)
	•	Returns the top N leaderboard.
	•	Payload Encryption with secret key
	•	Rate Limiting:
	•	Limit score update requests to 10 per minute per user.

9. Authentication and Authorization
	•	OAuth2 Integration:
	•	Kong Gateway validates OAuth2 Bearer tokens.
	•	Scopes:
	•	update:score for score updates.
	•	read:leaderboard for leaderboard access.
	•	Role-Based Access Control (RBAC):
	•	Admin roles can access historical logs.

11. Performance and Scalability
	•	Scaling Strategies:
	•	Horizontal scaling for workers and WebSocket services.
	•	Redis clustering for high availability.
	•	Partitioned PostgreSQL tables for handling large datasets.
	•	Optimization:
	•	Batch processing for database updates.
	•	Cache top N leaderboard queries in Redis.

12. Error Handling
	•	API Errors:
	•	Validate payloads and return appropriate error codes (400, 401, 500).
	•	Job Failures:
	•	Use RabbitMQ dead-letter queues (DLQ) for failed jobs.
	•	Retry failed jobs with exponential backoff.
	•	Redis/Database Failures:
	•	Fallback to database for leaderboard queries if Redis is unavailable.
	•	Log errors to EFK for analysis.

13. Notes
	•	Configure RabbitMQ with message durability and prefetch limits to optimize throughput.

14. Additional Enhancements
	•	Regional Leaderboards:
	•	Shard leaderboards by region (e.g., leaderboard:us, leaderboard:eu).
	•	Use historical logs for insights and trend analysis.
	•	Anti-Cheat Mechanisms:
	•	Detect suspicious score changes using predefined thresholds.
	•	Allow multiple leaderboards for different applications.
