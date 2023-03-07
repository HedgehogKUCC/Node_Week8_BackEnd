import swaggerAutogen from 'swagger-autogen';

const outputFile = './dist/swagger_output.json';
const endpointsFiles = ['./app.ts'];

const doc = {
  info: {
    title: 'Node.js REST API',
    description: 'Node.js 直播班'
  },
  host: 'localhost:3005',
  schemes: ['http', 'https'],
  tags: [
    {
      name: 'Users',
      description: '會員功能'
    },
    {
      name: 'Others',
      description: '其它功能'
    }
  ],
}

swaggerAutogen()(outputFile, endpointsFiles, doc);
