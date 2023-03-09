"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const outputFile = './dist/swagger_output.json';
const endpointsFiles = ['./app.ts'];
let host = '';
let servers;
if (process.env.NODE_ENV === 'development') {
    host = 'localhost:3005';
    servers = [
        {
            url: `http://${host}`,
            description: 'local server'
        }
    ];
}
else {
    host = 'meta-wall-pi.vercel.app';
    servers = [
        {
            url: `https://${host}`,
            description: '(production) vercel server'
        }
    ];
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
                        enumValues: [],
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
        }
    }
};
(0, swagger_autogen_1.default)({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
