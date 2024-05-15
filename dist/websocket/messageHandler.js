"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessage = void 0;
const messages_1 = require("@langchain/core/messages");
const webSearchAgent_1 = __importDefault(require("../agents/webSearchAgent"));
const academicSearchAgent_1 = __importDefault(require("../agents/academicSearchAgent"));
const writingAssistant_1 = __importDefault(require("../agents/writingAssistant"));
const wolframAlphaSearchAgent_1 = __importDefault(require("../agents/wolframAlphaSearchAgent"));
const youtubeSearchAgent_1 = __importDefault(require("../agents/youtubeSearchAgent"));
const redditSearchAgent_1 = __importDefault(require("../agents/redditSearchAgent"));
const searchHandlers = {
    webSearch: webSearchAgent_1.default,
    academicSearch: academicSearchAgent_1.default,
    writingAssistant: writingAssistant_1.default,
    wolframAlphaSearch: wolframAlphaSearchAgent_1.default,
    youtubeSearch: youtubeSearchAgent_1.default,
    redditSearch: redditSearchAgent_1.default,
};
const handleEmitterEvents = (emitter, ws, id) => {
    emitter.on('data', (data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.type === 'response') {
            ws.send(JSON.stringify({
                type: 'message',
                data: parsedData.data,
                messageId: id,
            }));
        }
        else if (parsedData.type === 'sources') {
            ws.send(JSON.stringify({
                type: 'sources',
                data: parsedData.data,
                messageId: id,
            }));
        }
    });
    emitter.on('end', () => {
        ws.send(JSON.stringify({ type: 'messageEnd', messageId: id }));
    });
    emitter.on('error', (data) => {
        const parsedData = JSON.parse(data);
        ws.send(JSON.stringify({ type: 'error', data: parsedData.data }));
    });
};
const handleMessage = async (message, ws, llm, embeddings) => {
    try {
        const parsedMessage = JSON.parse(message);
        const id = Math.random().toString(36).substring(7);
        if (!parsedMessage.content)
            return ws.send(JSON.stringify({ type: 'error', data: 'Invalid message format' }));
        const history = parsedMessage.history.map((msg) => {
            if (msg[0] === 'human') {
                return new messages_1.HumanMessage({
                    content: msg[1],
                });
            }
            else {
                return new messages_1.AIMessage({
                    content: msg[1],
                });
            }
        });
        if (parsedMessage.type === 'message') {
            const handler = searchHandlers[parsedMessage.focusMode];
            if (handler) {
                const emitter = handler(parsedMessage.content, history, llm, embeddings);
                handleEmitterEvents(emitter, ws, id);
            }
            else {
                ws.send(JSON.stringify({ type: 'error', data: 'Invalid focus mode' }));
            }
        }
    }
    catch (error) {
        console.error('Failed to handle message', error);
        ws.send(JSON.stringify({ type: 'error', data: 'Invalid message format' }));
    }
};
exports.handleMessage = handleMessage;
