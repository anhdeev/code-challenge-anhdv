# Real-Time Scoreboard API Module

This project provides an API to manage real-time score updates, maintain a top N leaderboard, and broadcast leaderboard updates to clients. It uses a combination of various technologies for scalability, reliability, and low-latency performance.

## Functional Requirements

- **Authenticated Score Updates**: Only authenticated users can update their scores via the API.
- **Anti-Cheat**: Secure the score update process to prevent cheating through encryption.
- **Real-Time Leaderboard**: Maintain a real-time top N leaderboard in Redis.
- **Real-Time Updates**: Support WebSocket-based broadcasting and HTTP requests for querying the leaderboard.
- **Score Update Processing**: Use background job processing for score updates.
- **Audit Logging**: Log all score updates for audit and analytics.

## Non-Functional Requirements

- **Scalability**: Handle thousands of concurrent score updates.
- **Low Latency**: Update the leaderboard with minimal delays.
- **Reliability**: Ensure no data loss during job processing, even in failure scenarios.
- **Monitoring**: Track performance metrics, errors, and activity for troubleshooting.

## Solution Overview

The architecture combines multiple services for secure, scalable, and efficient handling of score updates:

- **Kong Gateway**: Manages API authentication, rate limiting, and integrates seamlessly into CI/CD processes.
- **RabbitMQ**: Asynchronous processing of score updates, ensuring reliability and scalability.
- **Redis**: In-memory cache for fast leaderboard operations.
- **PostgreSQL**: Stores user scores and historical logs.
- **WebSocket Services**: For real-time leaderboard updates.
- **EFK Stack**: For logging historical score updates and monitoring.
- **AWS Lambda**: Used for background processing and periodic tasks like broadcasting leaderboard updates.

![Architecture Diagram](https://github.com/user-attachments/assets/b18ec454-9b65-45bd-8042-fd9f71f55d71)

## System Architecture

1. **Clients**: Clients send HTTP requests for score updates and receive real-time updates via WebSocket.
2. **Kong Gateway**: Secures APIs with OAuth2 and manages rate limiting.
3. **Score Service**: Receives requests, validates payloads, and logs events.
4. **RabbitMQ**: Buffers requests for worker processing.
5. **Workers**: AWS Lambda processes batch updates, handles Redis and database updates.
6. **EFK Stack**: Captures logs for analytics and debugging.

![Flow of Execution](https://github.com/user-attachments/assets/221b931e-fe94-4165-a520-0ce78347e440)

## Database Design

- **Users Table**:
    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        userId VARCHAR(50) UNIQUE NOT NULL,
        score INTEGER DEFAULT 0,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```
- **Historical Logs Table (Optional)**:
    ```sql
    CREATE TABLE score_logs (
        id SERIAL PRIMARY KEY,
        userId VARCHAR(50) NOT NULL,
        scoreChange INTEGER NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

- **Indexes**: 
  - Create an index on `userId` for fast lookups.
  - Partition `score_logs` by `timestamp` for efficient querying and long-term run.

## API Endpoints

### 1. **Update Score**
- **POST /api/scores/update**: Updates the score after an action.
- **Request Payload**:
    ```json
    {
      "userId": "string",
      "actionId": "string"
    }
    ```
- **Response**:
    ```json
    {
      "success": true,
      "newScore": 150
    }
    ```
- **Rate Limiting**: 10 requests per minute per user.

### 2. **Get Leaderboard**
- **GET /api/scores/leaderboard**: Retrieves the top 10 leaderboard.
- **Response**:
    ```json
    {
      "leaderboard": [
        { "rank": 1, "userId": "u123", "score": 1200 },
        { "rank": 2, "userId": "u124", "score": 1100 }
      ]
    }
    ```

## Authentication and Authorization

- **OAuth2 Integration**:
  - Kong Gateway validates OAuth2 Bearer tokens.
  - Scopes:
    - `update:score` for updating scores.
    - `read:leaderboard` for accessing the leaderboard.

- **Role-Based Access Control (RBAC)**: Manages user roles and permissions.

![RBAC Diagram](https://github.com/user-attachments/assets/358eccb2-c45d-4d36-86e2-6e859913db75)

## Performance and Scalability

The system is designed to handle thousands of concurrent score updates, ensuring minimal latency and high availability.

## Error Handling

- **Job Failures**: Use RabbitMQ Dead Letter Queues (DLQ) to handle failed jobs, with retries using exponential backoff.
- **Redis/Database Failures**: If Redis is unavailable, fallback to database for leaderboard queries and initialize redis cache for the first time.
- **Logging**: Errors are logged to the EFK stack for monitoring and analysis.

## Additional Enhancements

- **Regional Leaderboards**: Shard leaderboards by region, e.g., `leaderboard:us`, `leaderboard:eu`.

## Monitoring and Auditing

- **EFK Stack**: Use Elasticsearch, Fluentd, and Kibana for storing logs and providing insights into system performance and user activity.
