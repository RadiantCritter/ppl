"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageSearchAgent_1 = __importDefault(require("../agents/imageSearchAgent"));
const providers_1 = require("../lib/providers");
const config_1 = require("../config");
const messages_1 = require("@langchain/core/messages");
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    try {
        let { query, chat_history } = req.body;
        chat_history = chat_history.map((msg) => {
            if (msg.role === 'user') {
                return new messages_1.HumanMessage(msg.content);
            }
            else if (msg.role === 'assistant') {
                return new messages_1.AIMessage(msg.content);
            }
        });
        const models = await (0, providers_1.getAvailableProviders)();
        const provider = (0, config_1.getChatModelProvider)();
        const chatModel = (0, config_1.getChatModel)();
        let llm;
        if (models[provider] && models[provider][chatModel]) {
            llm = models[provider][chatModel];
        }
        if (!llm) {
            res.status(500).json({ message: 'Invalid LLM model selected' });
            return;
        }
        const images = await (0, imageSearchAgent_1.default)({ query, chat_history }, llm);
        res.status(200).json({ images });
    }
    catch (err) {
        res.status(500).json({ message: 'An error has occurred.' });
        console.log(err.message);
    }
});
exports.default = router;
