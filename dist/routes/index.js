"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const images_1 = __importDefault(require("./images"));
const config_1 = __importDefault(require("./config"));
const router = express_1.default.Router();
router.use('/images', images_1.default);
router.use('/config', config_1.default);
exports.default = router;
