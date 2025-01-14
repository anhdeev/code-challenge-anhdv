const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  openapi: '3.0.0', // Use OpenAPI 3.x
  info: {
    title: 'CRUD API',
    version: '1.0.0',
    "description": "This API provides CRUD operations for managing users and their associated orders. \n\nRole-based authentication is implemented to ensure proper access control.\n\nAdmin Login:\n- Email: admin@example.com\n- Password: password1"
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server'
    }
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'Authentication-related endpoints'
    },
    {
      name: 'Users',
      description: 'User-related endpoints'
    },
    {
      name: 'Orders',
      description: 'Order-related endpoints'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      UserCreate: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com',
            description: "User's unique email address"
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'password123',
            description: "User's password with at least 8 characters"
          },
          name: {
            type: 'string',
            example: 'John Doe',
            description: "User's full name"
          },
          role: {
            type: 'string',
            example: 'user',
            enum: ['user', 'admin'],
            description: 'Role of the user in the system'
          },
          username: {
            type: 'string',
            example: 'johndoe',
            description: 'Username for the user'
          },
          status: {
            type: 'string',
            example: 'active',
            enum: ['active', 'inactive', 'suspended'],
            description: 'Current status of the user'
          },
          note: {
            type: 'string',
            example: 'This is a note about the user.',
            description: 'Additional information or notes about the user'
          },
          avatar: {
            type: 'string',
            example: 'https://example.com/avatar.png',
            description: "URL to the user's avatar image"
          }
        },
        required: ['email', 'password', 'name'],
        description: 'Schema for creating a new user'
      },
      UserUpdate: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com'
          },
          password: {
            type: 'string',
            format: 'password',
            description: 'Password must meet security requirements.',
            example: 'StrongP@ssw0rd!'
          },
          name: {
            type: 'string',
            example: 'John Doe'
          },
          username: {
            type: 'string',
            example: 'johndoe'
          },
          avatar: {
            type: 'string',
            format: 'uri',
            example: 'https://example.com/avatar.png'
          },
          status: {
            type: 'string',
            enum: ['active', 'pending', 'inactive'],
            example: 'active'
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            example: 'user'
          },
          note: {
            type: 'string',
            example: 'Additional information about the user.'
          }
        },
        required: [],
        description: 'Partial updates for user properties. At least one property must be provided.'
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          name: {
            type: 'string',
            example: 'John Doe'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com'
          },
          emailVerified: {
            type: 'string',
            format: 'date-time',
            example: '2023-01-01T00:00:00Z'
          },
          username: {
            type: 'string',
            example: 'johndoe'
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            example: 'user'
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            example: 'active'
          },
          avatar: {
            type: 'string',
            format: 'url',
            example: 'https://example.com/avatar.jpg'
          },
          note: {
            type: 'string',
            example: 'Some additional notes about the user'
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'hashed_password'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2023-01-01T00:00:00Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2023-01-02T00:00:00Z'
          },
          deletedAt: {
            type: 'string',
            format: 'date-time',
            example: '2023-01-03T00:00:00Z'
          }
        }
      },
      Order: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
            description: 'Unique identifier for the order'
          },
          userId: {
            type: 'integer',
            example: 101,
            description: 'ID of the user who placed the order'
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'COMPLETED'],
            example: 'PENDING',
            description: 'Order status'
          },
          totalAmount: {
            type: 'number',
            example: 150.75,
            description: 'Total amount for the order'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2023-12-31T23:59:59Z',
            description: 'Timestamp when the order was created'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T12:00:00Z',
            description: 'Timestamp when the order was last updated'
          },
          deletedAt: {
            type: 'string',
            format: 'date-time',
            example: null,
            description: 'Timestamp when the order was deleted, if applicable'
          },
          user: {
            $ref: '#/components/schemas/User',
            description: 'The user who placed the order'
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/OrderItem'
            },
            description: 'List of items in the order'
          }
        },
        required: ['id', 'userId', 'status', 'totalAmount', 'createdAt', 'user', 'items']
      },
      OrderItem: {
        type: 'object',
        properties: {
          productId: {
            type: 'integer',
            example: 101
          },
          productName: {
            type: 'string',
            example: 'Product A'
          },
          quantity: {
            type: 'integer',
            example: 2
          },
          price: {
            type: 'number',
            example: 50.25
          }
        },
        required: ['productId', 'productName', 'quantity', 'price']
      },
      OrderRequest: {
        type: 'object',
        properties: {
          userId: {
            type: 'integer',
            example: 1
          },
          status: {
            type: 'string',
            example: 'PENDING'
          },
          totalAmount: {
            type: 'number',
            example: 150.5
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/OrderItem'
            }
          }
        },
        required: ['userId', 'items', 'totalAmount']
      },
      UserCredentialResponse: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            nullable: true,
            example: 'John Doe',
            description: 'The name of the user'
          },
          username: {
            type: 'string',
            nullable: true,
            example: 'johndoe',
            description: 'The username of the user'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
            description: 'The email address of the user'
          },
          avatar: {
            type: 'string',
            format: 'url',
            nullable: true,
            example: 'https://example.com/avatar.jpg',
            description: "URL of the user's avatar"
          },
          emailVerified: {
            type: 'boolean',
            example: true,
            description: "Whether the user's email is verified"
          },
          status: {
            type: 'string',
            example: 'active',
            enum: ['active', 'inactive'],
            description: "The status of the user's account"
          },
          tokens: {
            type: 'object',
            properties: {
              access: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                description: 'JWT access token'
              },
              refresh: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                description: 'JWT refresh token'
              }
            },
            required: ['access', 'refresh']
          }
        },
        required: ['username', 'email', 'emailVerified', 'status', 'tokens'],
        description:
          'Response for registering a new user, including user details and authentication tokens.'
      },
      AuthTokensResponse: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'JWT access token'
          },
          accessTokenExpire: {
            type: 'integer',
            example: 1700000000000,
            description: 'Expiration time of the access token in milliseconds since epoch'
          },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'JWT refresh token'
          },
          refreshTokenExpire: {
            type: 'integer',
            example: 1700000000000,
            description: 'Expiration time of the refresh token in milliseconds since epoch'
          }
        },
        required: ['accessToken', 'accessTokenExpire', 'refreshToken', 'refreshTokenExpire'],
        description:
          'Authentication token response containing both access and refresh tokens along with their expiration times.'
      },
      UserResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          email: {
            type: 'string',
            example: 'user@example.com'
          },
          name: {
            type: 'string',
            example: 'John Doe'
          },
          username: {
            type: 'string',
            example: 'johndoe'
          },
          role: {
            type: 'string',
            example: 'user'
          },
          status: {
            type: 'string',
            example: 'active'
          },
          avatar: {
            type: 'string',
            example: 'https://example.com/avatar.png'
          },
          lastSeen: {
            type: 'integer',
            format: 'int64',
            example: 1673638400000
          }
        }
      },
      UserListResponse: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/UserResponse'
        }
      },
      E400: {
        description: 'Invalid request parameters',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Invalid parameters' }
              }
            }
          }
        }
      },
      E401: {
        description: 'Unauthorized access',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Unauthorized' }
              }
            }
          }
        }
      },
      E403: {
        description: 'Forbidden access',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Forbidden' }
              }
            }
          }
        }
      },
      E404: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Resource not found' }
              }
            }
          }
        }
      },
      E428: {
        description: 'Rate limit exceeded',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Rate limit exceeded' }
              }
            }
          }
        }
      }
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/v1/index.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);
