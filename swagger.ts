import swaggerAutogen from 'swagger-autogen';

const outputFile = './dist/swagger_output.json';
const endpointsFiles = ['./app.ts'];
let host = '';
let servers: {
  url: string;
  description: string;
}[];

if ( process.env.NODE_ENV === 'development' ) {
  host = 'localhost:3005';
  servers = [
    {
      url: `http://${host}`,
      description: 'local server'
    }
  ];
} else {
  host = 'meta-wall-pi.vercel.app';
  servers = [
    {
      url: `https://${host}`,
      description: '(production) vercel server'
    }
  ]
}

const doc = {
  info: {
    title: 'Node.js REST API',
    description: 'Node.js 直播班'
  },
  servers,
  host,
  schemes: ['http', 'https'],
  tags: [
    {
      name: 'Users',
      description: '會員功能'
    },
    {
      name: 'Posts',
      description: '動態貼文'
    },
    {
      name: 'Others',
      description: '其它功能'
    }
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
  definitions: {
    ResponseServerErrorMsg: {
      result: false,
      msg: '系統錯誤，請洽系統管理員'
    },
    ResponseSuccessMsg: {
      result: true,
      data: '',
    },
    ResponseErrorMsg: {
      result: false,
      msg: '',
      columns: {
        Property: {
          name: 'ValidatorError',
          message: '',
          properties: {
            message: '',
            type: '',
            enumValues: [ '' ],
            path: '',
            value: '',
          },
          kind: '',
          path: '',
          value: '',
        }
      }
    },
    ResponseNotFoundPage: {
      result: false,
      msg: '無此路由'
    },
    ResponseInvalidToken: {
      result: false,
      msg: '請重新登入帳號'
    },
    SignUp: {
      $name: '',
      $sex: '[male | female]',
      $email: '',
      $password: '',
      $confirmPassword: '',
    },
    SignUpSuccess: {
      result: true,
      data: {
        user: {
          token: '',
          name: '',
        }
      }
    },
    SignIn: {
      $email: '',
      $password: '',
    },
    SignInSuccess: {
      result: true,
      data: {
        user: {
          token: '',
          name: '',
        }
      }
    },
    UploadImageSuccess: {
      result: true,
      data: '',
    },
    UpdatePassword: {
      password: '',
      confirmPassword: '',
    },
    GetUserProfileSuccess: {
      result: true,
      data: {
        _id: '',
        name: '',
        sex: '[male | female]',
        email: '',
        avatar: '',
        followers: [
          {
            _id: '',
            user: '',
            createdAt: '',
          }
        ],
        following: [
          {
            _id: '',
            user: '',
            createdAt: '',
          }
        ]
      }
    },
    UpdateProfile: {
      avatar: '',
      name: '',
      sex: '[male | female]'
    },
    GetLikeList: {
      result: true,
      data: [
        {
          _id: '',
          userID: {
            _id: '',
            name: '',
            avatar: '',
          },
          content: '',
          image: '',
          likes: [
            '',
          ],
          createdAt: '',
          updatedAt: '',
        }
      ]
    },
    GetUserFollowing: {
      result: true,
      data: {
        _id: '',
        name: '',
        sex: '[male | female]',
        email: '',
        avatar: '',
        following: [
          {
            _id: '',
            createdAt: '',
            user: {
              _id: '',
              name: '',
              avatar: '',
            }
          }
        ]
      }
    },
    GetPostsSuccess: {
      result: true,
      data: [
        {
          _id: '',
          userID: {
            _id: '',
            name: '',
            avatar: '',
          },
          content: '',
          image: '',
          likes: [ '' ],
          createdAt: '',
          updatedAt: '',
        }
      ]
    },
    AddPost: {
      content: '',
    },
    AddPostSuccess: {
      result: true,
      data: {
        _id: '',
        userID: '',
        content: '',
        image: '',
        likes: [ '' ],
        createdAt: '',
        updatedAt: '',
      }
    },
    GetPostWithComments: {
      result: true,
      data: {
        _id: '',
        userID: '',
        content: '',
        image: '',
        likes: [ '' ],
        createdAt: '',
        updatedAt: '',
        comments: [
          {
            _id: '',
            comment: '',
            userID: {
              _id: '',
              name: '',
              avatar: '',
            },
            postID: '',
            createdAt: '',
          }
        ]
      }
    }
  }
}

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
