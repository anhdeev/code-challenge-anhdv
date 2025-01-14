import express from 'express';
import validate from '../../middlewares/validate';
import auth from '../../middlewares/auth';
import { orderValidation } from '../../validations';
import orderController from '../../controllers/order.controller';
import { Permission } from '../../constants/auth.const';

const router = express.Router();

// Create Order
router.post(
  '/',
  auth(Permission.CREATE_ORDER),
  validate(orderValidation.createOrder),
  (req, res, next) => {
    /**
     #swagger.security = [{
        "bearerAuth": []
      }]
     #swagger.tags = ['Orders']
     #swagger.summary = 'Create a new order'
     #swagger.description = 'Allows creating a new order with associated items.'
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/OrderRequest' }
         }
       }
     }
     #swagger.responses[201] = {
       description: 'Order created successfully',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/Order' }
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
    return orderController.createOrder(req, res, next);
  }
);

// Get Order by ID
router.get(
  '/:orderId',
  auth(Permission.VIEW_ORDER),
  validate(orderValidation.getOrderById),
  (req, res, next) => {
    /**
     #swagger.security = [{
        "bearerAuth": []
      }]
     #swagger.tags = ['Orders']
     #swagger.summary = 'Get order by ID'
     #swagger.description = 'Retrieve details of a specific order by its ID.'
     #swagger.parameters['orderId'] = {
       in: 'path',
       required: true,
       type: 'integer',
       description: 'The ID of the order'
     }
     #swagger.responses[200] = {
       description: 'Order retrieved successfully',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/Order' }
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
    return orderController.getOrderById(req, res, next);
  }
);

// Get Orders by User ID
router.get(
  '/user/:userId',
  auth(Permission.VIEW_ORDER),
  validate(orderValidation.getOrdersByUserId),
  (req, res, next) => {
    /**
     #swagger.security = [{
        "bearerAuth": []
      }]
     #swagger.tags = ['Orders']
     #swagger.summary = 'Get orders by user ID'
     #swagger.description = 'Retrieve all orders associated with a specific user.'
     #swagger.parameters['userId'] = {
       in: 'path',
       required: true,
       type: 'integer',
       description: 'The ID of the user'
     }
     #swagger.responses[200] = {
       description: 'Orders retrieved successfully',
       content: {
         "application/json": {
           schema: {
             type: 'array',
             items: { $ref: '#/components/schemas/Order' }
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
    return orderController.getOrdersByUserId(req, res, next);
  }
);

// Update Order
router.patch(
  '/:orderId',
  auth(Permission.EDIT_ORDER),
  validate(orderValidation.updateOrder),
  (req, res, next) => {
    /**
     #swagger.security = [{
        "bearerAuth": []
      }]
     #swagger.tags = ['Orders']
     #swagger.summary = 'Update an order'
     #swagger.description = 'Update details of an order including its items.'
     #swagger.parameters['orderId'] = {
       in: 'path',
       required: true,
       type: 'integer',
       description: 'The ID of the order'
     }
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/OrderRequest' }
         }
       }
     }
     #swagger.responses[200] = {
       description: 'Order updated successfully',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/Order' }
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
    return orderController.updateOrder(req, res, next);
  }
);

// Delete Order
router.delete(
  '/:orderId',
  auth(Permission.DELETE_ORDER),
  validate(orderValidation.deleteOrder),
  (req, res, next) => {
    /**
     #swagger.security = [{
        "bearerAuth": []
      }]
     #swagger.tags = ['Orders']
     #swagger.summary = 'Delete an order'
     #swagger.description = 'Delete a specific order by its ID.'
     #swagger.parameters['orderId'] = {
       in: 'path',
       required: true,
       type: 'integer',
       description: 'The ID of the order'
     }
     #swagger.responses[204] = { description: 'Order deleted successfully' }
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
    return orderController.deleteOrderById(req, res, next);
  }
);

// Add Items to Order
router.post(
  '/:orderId/items',
  auth(Permission.EDIT_ORDER),
  validate(orderValidation.addItemsToOrder),
  (req, res, next) => {
    /**
     #swagger.security = [{
        "bearerAuth": []
      }]
     #swagger.tags = ['Orders']
     #swagger.summary = 'Add items to an order'
     #swagger.description = 'Add additional items to an existing order.'
     #swagger.parameters['orderId'] = {
       in: 'path',
       required: true,
       type: 'integer',
       description: 'The ID of the order'
     }
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: 'array',
             items: {
               $ref: '#/components/schemas/OrderItem'
             }
           }
         }
       }
     }
     #swagger.responses[200] = {
       description: 'Items added successfully',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/Order' }
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
        description: 'Notfound',
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
    return orderController.addItemsToOrder(req, res, next);
  }
);

// Remove Items from Order
router.delete(
  '/:orderId/items',
  auth(Permission.EDIT_ORDER),
  validate(orderValidation.removeItemsFromOrder),
  (req, res, next) => {
    /**
     #swagger.security = [{
        "bearerAuth": []
      }]
     #swagger.tags = ['Orders']
     #swagger.summary = 'Remove items from an order'
     #swagger.description = 'Remove specific items from an existing order.'
     #swagger.parameters['orderId'] = {
       in: 'path',
       required: true,
       type: 'integer',
       description: 'The ID of the order'
     }
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: 'object',
             properties: {
               itemIds: {
                 type: 'array',
                 items: { type: 'integer', example: 201 }
               }
             },
             required: ['itemIds']
           }
         }
       }
     }
     #swagger.responses[200] = {
       description: 'Items removed successfully',
       content: {
         "application/json": {
           schema: { $ref: '#/components/schemas/Order' }
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
    return orderController.removeItemsFromOrder(req, res, next);
  }
);

export default router;
