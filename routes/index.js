"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("./v1/users"));
const posts_1 = __importDefault(require("./v1/posts"));
const upload_1 = __importDefault(require("./v1/upload"));
const router = (0, express_1.Router)();
router.use('/users', users_1.default);
router.use('/posts', posts_1.default);
router.use('/upload', upload_1.default);
exports.default = router;
