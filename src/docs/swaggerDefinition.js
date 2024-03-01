const { version } = require('../../package.json');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'node-express-boilerplate API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/ABIDULLAH786/express-boilerplate/blob/master/LICENSE',
    },
    contact: {
      name: 'Abid Ullah',
      email: 'abidullah.se@gmail.com',
      url: 'https://www.linkedin.com/in/abidullah786'
    }
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}/v1`,
    },
  ],
};

module.exports = swaggerDefinition;
