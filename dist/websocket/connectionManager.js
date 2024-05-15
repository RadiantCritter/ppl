"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnection = void 0;
const messageHandler_1 = require("./messageHandler");
const config_1 = require("../config");
const providers_1 = require("../lib/providers");
const handleConnection = async (ws) => {
    const models = await (0, providers_1.getAvailableProviders)();
    const provider = (0, config_1.getChatModelProvider)();
    const chatModel = (0, config_1.getChatModel)();
    let llm;
    let embeddings;
    if (models[provider] && models[provider][chatModel]) {
        llm = models[provider][chatModel];
        embeddings = models[provider].embeddings;
    }
    if (!llm || !embeddings) {
        ws.send(JSON.stringify({
            type: 'error',
            data: 'Invalid LLM or embeddings model selected',
        }));
        ws.close();
    }
    ws.on('message', async (message) => await (0, messageHandler_1.handleMessage)(message.toString(), ws, llm, embeddings));
    ws.on('close', () => console.log('Connection closed'));
};
exports.handleConnection = handleConnection;
