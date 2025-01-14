import Joi from 'joi';
const orderValidation = {
  createOrder: {
    body: Joi.object().keys({
      userId: Joi.number().required(),
      status: Joi.string().valid('PENDING', 'COMPLETED').default('PENDING'),
      totalAmount: Joi.number().required(),
      items: Joi.array()
        .items(
          Joi.object({
            productId: Joi.number().required(),
            productName: Joi.string().required(),
            quantity: Joi.number().required(),
            price: Joi.number().required(),
            total: Joi.number()
          })
        )
        .required()
    })
  },
  getOrderById: {
    params: Joi.object().keys({
      orderId: Joi.number().required()
    })
  },
  getOrdersByUserId: {
    params: Joi.object().keys({
      userId: Joi.number().required()
    })
  },
  updateOrder: {
    params: Joi.object().keys({
      orderId: Joi.number().required()
    }),
    body: Joi.object().keys({
      status: Joi.string().valid('PENDING', 'COMPLETED').optional(),
      totalAmount: Joi.number().optional(),
      items: Joi.array().items(
        Joi.object({
          productId: Joi.number().required(),
          productName: Joi.string().required(),
          quantity: Joi.number().required(),
          price: Joi.number().required(),
          total: Joi.number().optional()
        })
      )
    })
  },
  deleteOrder: {
    params: Joi.object().keys({
      orderId: Joi.number().required()
    })
  },
  addItemsToOrder: {
    params: Joi.object().keys({
      orderId: Joi.number().required()
    }),
    body: Joi.array()
      .items(
        Joi.object({
          productId: Joi.number().required(),
          productName: Joi.string().required(),
          quantity: Joi.number().required(),
          price: Joi.number().required()
        })
      )
      .required()
  },
  removeItemsFromOrder: {
    params: Joi.object().keys({
      orderId: Joi.number().required()
    }),
    body: Joi.object().keys({
      itemIds: Joi.array().items(Joi.number()).required()
    })
  }
};

export default orderValidation;
