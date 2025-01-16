# Real-Time Scoreboard API Module

## Functional Requirements

- **Authenticated Score Updates**: Only authenticated users can update their scores via the API.
- **Anti-Cheat**: Secure the score update process to prevent cheating through encryption or crypto nonce, prevent malicious users from increasing scores without authorisation
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
- **RabbitMQ or SQS**: Asynchronous processing of score updates, ensuring reliability and scalability.
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
4. **AWS SQS**: Buffers requests for worker processing.
5. **Workers**: AWS Lambda processes batch updates, handles Redis and database updates.
6. **EFK Stack**: Captures logs for analytics and debugging.

![Flow of Execution](https://github.com/user-attachments/assets/221b931e-fe94-4165-a520-0ce78347e440)

## Database Design

- **Users Table**:
    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        userId VARCHAR(50) UNIQUE NOT NULL,
        username VARCHAR(100) NOT NULL,
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
  - Create an index on `userId` and `username` for fast lookups.
  - Partition `score_logs` by `timestamp` for efficient querying and long-term run.
 

## Authentication and Authorization

- **OAuth2 Integration**:
  - Kong Gateway validates OAuth2 Bearer tokens.
  - Scopes:
    - `update:score` for updating scores.
    - `read:leaderboard` for accessing the leaderboard.

- **Role-Based Access Control (RBAC)**: Manages user roles and permissions.

![RBAC Diagram](https://github.com/user-attachments/assets/358eccb2-c45d-4d36-86e2-6e859913db75)


#### Login Flow:
1. **Login Request**:
    - Users send a login request to the authentication service to obtain an OAuth2 token.
    - The request will look like this:
      ```json
      {
        "username": "user123",
        "password": "password123"
      }
      ```
    - The response will contain the `access_token` which should be included in the header of all subsequent requests.
      ```json
      {
        "access_token": "your_oauth2_access_token_here"
      }
      ```

2. **Include Bearer Token**:
    - When making API requests, the `Authorization` header must include the Bearer token:
      ```
      Authorization: Bearer your_oauth2_access_token_here
      ```
      
## API Endpoints

### Authentication Process

Before accessing any of the private endpoints, the user must authenticate using OAuth2. The process involves obtaining a valid Bearer token, which must be included in the `Authorization` header for each request

### 1. **Update Score**
- **POST /api/scores/update**: Updates the score after an action.
- **Request Payload**:
    ```json
    {
      "userId": "string",
      "actionId": "string",
      "nonce": "string"
    }
    ```
- **Response**:
    - **Success**:
        ```json
        {
          "success": true,
          "newScore": 150,
          "username": "user123"
        }
        ```
    - **Error**:
        ```json
        {
          "success": false,
          "error": "Invalid user ID or action ID",
          "message": "The provided userId or actionId is not valid."
        }
        ```
    - **Error Codes**:
        - `400 Bad Request`: Invalid or missing parameters.
        - `401 Unauthorized`: Invalid or missing OAuth2 token.
        - `403 Forbidden`: User does not have permission to update the score.
        - `500 Internal Server Error`: An unexpected error occurred during score processing.

- **Rate Limiting**: 10 requests per minute per user.

### 2. **Get Leaderboard** (Public API)
- **GET /api/scores/leaderboard**: Retrieves the top 10 leaderboard.
- **Response**:
    - **Success**:
        ```json
        {
          "leaderboard": [
            { "rank": 1, "userId": "u123", "username": "user123", "score": 1200 },
            { "rank": 2, "userId": "u124", "username": "user124", "score": 1100 }
          ]
        }
        ```
    - **Error**:
        ```json
        {
          "success": false,
          "error": "Leaderboard not found",
          "message": "Unable to fetch the leaderboard at this time."
        }
        ```
    - **Error Codes**:
        - `400 Bad Request`: Invalid parameters (e.g., invalid query parameters).
        - `500 Internal Server Error`: An unexpected error occurred during leaderboard fetching.

## Use Cases

### 1. **Maintain Top N (N > 10) Score in Redis**

To maintain a real-time leaderboard in Redis, use a sorted set to store scores. Redis' `ZADD` command adds scores to the sorted set, and the `ZRANGE` command retrieves the top N scores.

#### Cache current score if neccessary
```typescript
import { createClient } from 'redis';

// Connect to Redis
const redisClient = createClient({
  url: 'redis://localhost:6379'
});
await redisClient.connect();

// Add or update the score for a user
async function updateScore(userId: string, score: number) {
  if (score < MIN_CACHED_SCORE && NUM_OF_RECORD > N) return;

  await redisClient.zAdd('leaderboard', { score, value: userId });
}

// Retrieve the top N scores
async function getTopNScores(n: number) {
  const topScores = await redisClient.zRangeWithScores('leaderboard', 0, n - 1, { REV: true });
  return topScores.map((item, index) => ({
    rank: index + 1,
    userId: item.value,
    score: item.score
  }));
}

// Example usage
updateScore('user123', 1000);
const leaderboard = await getTopNScores(10);
console.log(leaderboard);
```
#### Sample Batch job to maintain top N leaderboard
```
export const handler = async (): Promise<void> => {
  try {
    // Connect to Redis and Database
    await redisClient.connect();
    await dbClient.connect();

    // Query the top N scores from the database
    const query = `
      SELECT user_id, score
      FROM scores
      ORDER BY score DESC
      LIMIT $1;
    `;
    const topNScores = await dbClient.query(query, [parseInt(process.env.TOP_N || '10', 10)]);

    // Sync leaderboard with Redis
    const pipeline = redisClient.multi(); // Use Redis pipeline for batch operations
    await redisClient.del('leaderboard'); // Clear existing leaderboard

    for (const row of topNScores.rows) {
      pipeline.zAdd('leaderboard', { score: row.score, value: row.user_id });
    }

    await pipeline.exec(); // Execute the pipeline

    console.log('Leaderboard synced successfully');
  } catch (error) {
    console.error('Error syncing leaderboard:', error);
    throw error;
  } finally {
    // Close connections
    await redisClient.disconnect();
    await dbClient.end();
  }
};

```

### 2. **Broadcast Data to Clients via WebSocket**
- Set up a scheduled AWS Lambda to fetch the leaderboard from Redis every 5 seconds.
- Use Redis Pub/Sub to broadcast leaderboard updates.
- When the WebSocket service receives data via Pub/Sub, it will loop through all connected clients and send the updates.
```typescript
import WebSocket, { WebSocketServer } from 'ws';
import { createClient } from 'redis';

// Create a WebSocket server
const wss = new WebSocketServer({ port: 8080 });
const clients = new Set<WebSocket>();

// Connect to Redis
const redisClient = createClient({ url: 'redis://localhost:6379' });
await redisClient.connect();

// Redis Pub/Sub subscription
const subscriber = redisClient.duplicate();
await subscriber.connect();
await subscriber.subscribe('leaderboard-updates', (message) => {
  const leaderboard = JSON.parse(message);
  broadcastLeaderboard(leaderboard);
});

// Handle incoming WebSocket connections
wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

// Broadcast leaderboard to all connected clients
function broadcastLeaderboard(leaderboard: any[]) {
  const message = JSON.stringify({ leaderboard });
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Lambda-like function that fetches leaderboard from Redis every 5 seconds
async function fetchAndPublishLeaderboard() {
  setInterval(async () => {
    // Fetch top N scores from Redis (for example, top 10)
    const topScores = await redisClient.zRangeWithScores('leaderboard', 0, 9, { REV: true });
    const leaderboard = topScores.map((item, index) => ({
      rank: index + 1,
      userId: item.value,
      score: item.score
    }));

    // Publish the leaderboard to Redis Pub/Sub channel
    await redisClient.publish('leaderboard-updates', JSON.stringify(leaderboard));
  }, 5000);
}

// Start the Lambda-like function
fetchAndPublishLeaderboard();
```

### 3. **Encrypt and Sign Request Payload**

1. **Client** retrieve server's Nonce for each specific userid/actionid/timestamps (or server shared's secret key for simplicity)
2. **Client** sends the original payload and the Nonce data in the request header.
3. **Server** verifies the signature if it matched with the payload using the Nonce
4. If the signature is valid, the server processes the payload.
``` Generate nonce at server
const crypto = require('crypto');

function generateNonce() {
    return crypto.randomBytes(16).toString('hex'); // 16-byte random token
}
const nonces = new Map();

function storeNonce(userId, nonce) {
    const expiration = Date.now() + 5 * 60 * 1000; // Expires in 5 minutes
    nonces.set(nonce, { userId, expiration });
}
```

## Error Handling

- **Job Failures**: Use RabbitMQ Dead Letter Queues (DLQ) to handle failed jobs, with job retries using exponential backoff.
- **Redis/Database Failures**: If Redis is unavailable, fallback to database for leaderboard queries and initialize redis cache for the first time.

## Additional Enhancements

- **Sharding for Scalability**: For handling a very large number of users or when the current infrastructure reaches its vertical scaling limits, users can be grouped by IP region. Each user group will have its own dedicated queue, database, and Redis instance to ensure efficient processing and prevent bottlenecks.
- **Thoroughful logging**: Adding more log event using EFK stack like error, system health check, resource monitor, user behavior which is usedfull to monitor faulty or system.
- **Load balancing**: if the request traffic to both HTTP API and WS API get reaches high peek with slow down or consume most of CPU/ memory resource, consider to scale multiple score-service and websocket service and place them behide a loadbalancing like NGINX or AWS Elastic Loadbalancer
- **Distributed lock**: When multiple workers handle batch updates concurrently, they may attempt to update the same user’s record in the database simultaneously, leading to conflicts on the same row. This can be avoided by implementing a distributed locking mechanism using Redis-based locks or PostgreSQL’s advisory locks to ensure only one worker updates a specific record at a time.

  
