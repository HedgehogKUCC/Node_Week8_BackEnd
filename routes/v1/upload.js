"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const handleErrorAsync_1 = __importDefault(require("../../utils/handleErrorAsync"));
const UploadController_1 = __importDefault(require("../../controllers/UploadController"));
const isAuth_1 = __importDefault(require("../../middlewares/isAuth"));
const imgurUpload_1 = __importDefault(require("../../middlewares/imgurUpload"));
router
    .route('/')
    .post(isAuth_1.default, imgurUpload_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Others']
  #swagger.summary = '上傳會員大頭貼'
  #swagger.path = '/api/upload'
  #swagger.consumes = ['multipart/form-data']
  #swagger.parameters['avatar'] = {
    in: 'formData',
    type: 'file',
    required: true,
  }
  #swagger.responses[200] = {
    description: '上傳圖片成功',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/ResponseSuccessMsg' }
      }
    }
  }
*/
UploadController_1.default.upload));
exports.default = router;
