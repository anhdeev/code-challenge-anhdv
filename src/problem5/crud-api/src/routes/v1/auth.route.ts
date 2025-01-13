import express from 'express';
import validate from '../../middlewares/validate';
import authValidation from '../../validations/auth.validation';
import { authController } from '../../controllers';

const router = express.Router();

// Register route
router.post('/register', validate(authValidation.register), (req, res, next) => {
  /* #swagger.tags = ['Authentication']
     #swagger.summary = 'Register a new user'
     #swagger.description = 'Allows users to create an account.'
     #swagger.requestBody = {
         required: true,
         content: {
             "application/json": {
                 schema: {
                     type: "object",
                     properties: {
                         email: { type: "string", format: "email", example: "user@example.com" },
                         password: { type: "string", format: "password", example: "password123" },
                         username: { type: "string", example: "user1" }
                     },
                     required: ["email", "password"]
                 }
             }
         }
     }
     #swagger.responses[201] = {
         description: 'User registered successfully',
         content: {
             "application/json": {
                 schema: { $ref: "#/components/schemas/UserCredentialResponse" }
             }
         }
     }
     #swagger.responses[400] = {
       description: 'Invalid request parameters',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/E400' }
         }
       }
     }
     #swagger.responses[428] = {
       description: 'Rate limit',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/E404' }
         }
       }
     }
    */
  return authController.register(req, res, next);
});

// Login route
router.post('/login', validate(authValidation.login), (req, res, next) => {
  /* #swagger.tags = ['Authentication']
     #swagger.summary = 'User login'
     #swagger.description = 'Allows users to log in using email and password.'
     #swagger.requestBody = {
         required: true,
         content: {
             "application/json": {
                 schema: {
                     type: "object",
                     properties: {
                         email: { type: "string", format: "email", example: "user@example.com" },
                         password: { type: "string", format: "password", example: "password123" }
                     },
                     required: ["email", "password"]
                 }
             }
         }
     }
     #swagger.responses[200] = {
         description: 'Login successful',
         content: {
             "application/json": {
                 schema: { $ref: "#/components/schemas/UserCredentialResponse" }
             }
         }
     }
     #swagger.responses[400] = {
       description: 'Invalid request parameters',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/E400' }
         }
       }
     }
     #swagger.responses[428] = {
       description: 'Rate limit',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/E404' }
         }
       }
     }*/
  return authController.login(req, res, next);
});

// Logout route
router.post('/logout', validate(authValidation.logout), (req, res, next) => {
  /* #swagger.tags = ['Authentication']
     #swagger.summary = 'Logout user'
     #swagger.description = 'Logs out a user by invalidating the refresh token.'
     #swagger.requestBody = {
         required: true,
         content: {
             "application/json": {
                 schema: {
                     type: "object",
                     properties: {
                         refreshToken: { type: "string", example: "some-refresh-token" }
                     },
                     required: ["refreshToken"]
                 }
             }
         }
     }
     #swagger.responses[204] = ''
     #swagger.responses[400] = {
       description: 'Invalid request parameters',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/E400' }
         }
       }
     }
     #swagger.responses[428] = {
       description: 'Rate limit',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/E404' }
         }
       }
     }*/
  return authController.logout(req, res, next);
});

// Refresh tokens route
router.post('/refresh-tokens', validate(authValidation.refreshTokens), (req, res, next) => {
  /* #swagger.tags = ['Authentication']
     #swagger.summary = 'Refresh authentication tokens'
     #swagger.description = 'Allows users to refresh their access and refresh tokens using a valid refresh token.'
     #swagger.requestBody = {
         required: true,
         content: {
             "application/json": {
                 schema: {
                     type: "object",
                     properties: {
                         refreshToken: { type: "string", example: "some-refresh-token" }
                     },
                     required: ["refreshToken"]
                 }
             }
         }
     }
     #swagger.responses[200] = {
         description: 'Tokens refreshed successfully',
         content: {
              "application/json": {
                 schema: { $ref: "#/components/schemas/AuthTokensResponse" }
             }
         }
     }
     #swagger.responses[400] = {
       description: 'Invalid request parameters',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/E400' }
         }
       }
     }
     #swagger.responses[401] = {
       description: 'Unauthorized access',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/E401' }
         }
       }
     }
     #swagger.responses[403] = {
       description: 'Forbidden access',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/E403' }
         }
       }
     }
     #swagger.responses[404] = {
       description: 'Not found',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/E404' }
         }
       }
     }
     #swagger.responses[428] = {
       description: 'Rate limit',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/E404' }
         }
       }
     }*/
  return authController.refreshTokens(req, res, next);
});

export default router;
