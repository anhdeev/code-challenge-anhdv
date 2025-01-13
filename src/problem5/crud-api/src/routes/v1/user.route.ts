import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { userValidation } from '../../validations';
import { userController } from '../../controllers';
import { Permission } from '../../constants/auth.const';

const router = express.Router();

// Users routes
router
  .route('/')
  .post(auth(Permission.MANAGE_USER), validate(userValidation.createUser), (req, res, next) => {
    /**
    #swagger.tags = ['Users']
    #swagger.summary = 'Create a new user'
    #swagger.description = 'Only admins can create new users.'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/UserCreate'
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'User created successfully',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/User' }
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
     #swagger.responses[428] = {
       description: 'Rate limit',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/E404' }
         }
       }
     }
    }*/
    return userController.createUser(req, res, next);
  })
  .get(auth(Permission.READ_USER), validate(userValidation.getUsers), (req, res, next) => {
    /**
    #swagger.tags = ['Users']
    #swagger.summary = 'Get a list of users'
    #swagger.parameters['search'] = { description: 'Search term to filter users by name or email' }
    #swagger.parameters['sortBy'] = { description: 'Sort users by a specific field (e.g., name:asc)' }
    #swagger.parameters['limit'] = { description: 'Maximum number of users per page', default: 10 }
    #swagger.parameters['page'] = { description: 'Page number for paginated results', default: 1 }
    #swagger.responses[200] = {
      description: 'List of users retrieved successfully',
      content: {
        "application/json": {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/User' }
          }
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
     #swagger.responses[428] = {
       description: 'Rate limit',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/E404' }
         }
       }
     }
    */
    return userController.getUsers(req, res, next);
  });

// User by ID routes
router
  .route('/user/:userId')
  .get(auth(Permission.READ_USER), validate(userValidation.getUsers), (req, res, next) => {
    /**
     #swagger.tags = ['Users']
     #swagger.summary = 'Get a list of users'
     #swagger.description = 'Retrieve a list of users with optional filters and pagination.'
     #swagger.parameters['search'] = {
       in: 'query',
       type: 'string',
       description: 'Search term to filter users by name, email, or username'
     }
     #swagger.parameters['sortBy'] = {
       in: 'query',
       type: 'string',
       description: 'Sort users by a specific field and direction (e.g., name:asc, role:desc)'
     }
     #swagger.parameters['limit'] = {
       in: 'query',
       type: 'integer',
       description: 'Maximum number of users per page',
       default: 10
     }
     #swagger.parameters['page'] = {
       in: 'query',
       type: 'integer',
       description: 'Page number for paginated results',
       default: 1
     }
     #swagger.parameters['name'] = {
       in: 'query',
       type: 'string',
       description: 'filter user list by name'
     }
     #swagger.parameters['role'] = {
       in: 'query',
       type: 'string',
       description: 'filter user list by role'
     }
     #swagger.responses[200] = {
       description: 'List of users retrieved successfully',
       content: {
         "application/json": {
            schema: { $ref: "#/components/schemas/UserListResponse" }
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
     }
     */
    return userController.getUsers(req, res, next);
  })
  .patch(auth(Permission.MANAGE_USER), validate(userValidation.updateUser), (req, res, next) => {
    /**
    #swagger.tags = ['Users']
    #swagger.summary = 'Update user details by ID'
    #swagger.parameters['userId'] = {
      in: 'path',
      description: 'ID of the user to update',
      required: true,
      schema: { type: 'string' }
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/UserUpdate' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'User updated successfully',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/User' }
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
     }
    */
    return userController.updateUser(req, res, next);
  })
  .delete(auth(Permission.MANAGE_USER), validate(userValidation.deleteUser), (req, res, next) => {
    /**
    #swagger.tags = ['Users']
    #swagger.summary = 'Delete a user by ID'
    #swagger.parameters['userId'] = {
      in: 'path',
      description: 'ID of the user to delete',
      required: true,
      schema: { type: 'string' }
    }
    #swagger.responses[204] = { description: 'User deleted successfully' }
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
    #swagger.responses[428] = {
      description: 'Rate limit',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/E404' }
        }
      }
    }
    */
    return userController.deleteUser(req, res, next);
  });

// Current user details route
router.get('/me', auth(), (req, res, next) => {
  /**
  #swagger.tags = ['Users']
  #swagger.summary = 'Get details of the currently authenticated user'
  #swagger.responses[200] = {
    description: 'Authenticated user details retrieved successfully',
    content: {
      "application/json": {
        schema: { $ref: '#/components/schemas/User' }
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
  #swagger.responses[428] = {
    description: 'Rate limit',
    content: {
      "application/json": {
        schema: { $ref: '#/components/schemas/E404' }
      }
    }
  }
  */
  return userController.getMe(req, res, next);
});

export default router;
