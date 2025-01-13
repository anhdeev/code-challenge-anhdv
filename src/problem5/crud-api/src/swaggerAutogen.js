const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/v1/index.ts'];

const config = {
  info: {
    title: 'ELP API Documentation',
    description: '',
  },
  tags: [],
  servers: [
    {
      url: 'http://localhost:3000/',
      description: 'Local host',
    },
    {
      url: 'http://api.codedi.online/',
      description: 'STG environment',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, config);
