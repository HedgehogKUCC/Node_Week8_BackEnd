"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: './config.env',
});
let DB = '';
if (process.env.NODE_ENV === 'development') {
    DB = process.env.DevMongoDB;
}
else {
    DB = process.env.MongoDB.replace('<password>', process.env.MongoDB_Password);
}
mongoose_1.default
    .connect(DB)
    .then(() => console.log('mongodb is connecting...'))
    .catch((err) => console.log(err.message));
