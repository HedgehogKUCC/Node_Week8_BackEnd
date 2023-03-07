import swaggerAutogen from 'swagger-autogen';

const outputFile = './dist/swagger_output.json';
const endpointsFiles = ['./app.ts'];
let host = '';
let schemes: string[];

if ( process.env.NODE_ENV === 'development' ) {
  host = 'localhost:3005';
  schemes = ['http'];
} else {
  host = 'https://meta-wall-pi.vercel.app';
  schemes = ['https'];
}

const doc = {
  info: {
    title: 'Node.js REST API',
    description: 'Node.js 直播班'
  },
  host,
  schemes,
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
