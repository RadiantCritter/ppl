"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const providers_1 = require("../lib/providers");
const config_1 = require("../config");
const router = express_1.default.Router();
router.get('/', async (_, res) => {
    const config = {};
    const providers = await (0, providers_1.getAvailableProviders)();
    for (const provider in providers) {
        delete providers[provider]['embeddings'];
    }
    config['providers'] = {};
    for (const provider in providers) {
        config['providers'][provider] = Object.keys(providers[provider]);
    }
    config['selectedProvider'] = (0, config_1.getChatModelProvider)();
    config['selectedChatModel'] = (0, config_1.getChatModel)();
    config['openeaiApiKey'] = (0, config_1.getOpenaiApiKey)();
    config['ollamaApiUrl'] = (0, config_1.getOllamaApiEndpoint)();
    res.status(200).json(config);
});
router.post('/', async (req, res) => {
    const config = req.body;
    const updatedConfig = {
        GENERAL: {
            CHAT_MODEL_PROVIDER: config.selectedProvider,
            CHAT_MODEL: config.selectedChatModel,
        },
        API_KEYS: {
            OPENAI: config.openeaiApiKey,
        },
        API_ENDPOINTS: {
            OLLAMA: config.ollamaApiUrl,
        },
    };
    (0, config_1.updateConfig)(updatedConfig);
    res.status(200).json({ message: 'Config updated' });
});
exports.default = router;
