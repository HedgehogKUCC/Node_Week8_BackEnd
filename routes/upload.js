"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const handleErrorAsync_1 = __importDefault(require("../utils/handleErrorAsync"));
const UploadController_1 = __importDefault(require("../controllers/UploadController"));
const isAuth_1 = __importDefault(require("../middlewares/isAuth"));
const imgurUpload_1 = __importDefault(require("../middlewares/imgurUpload"));
router.post('/', isAuth_1.default, imgurUpload_1.default, (0, handleErrorAsync_1.default)(UploadController_1.default.upload));
exports.default = router;
