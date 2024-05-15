"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableProviders = void 0;
const openai_1 = require("@langchain/openai");
const ollama_1 = require("@langchain/community/chat_models/ollama");
const ollama_2 = require("@langchain/community/embeddings/ollama");
const config_1 = require("../config");
const getAvailableProviders = async () => {
    const openAIApiKey = (0, config_1.getOpenaiApiKey)();
    const ollamaEndpoint = (0, config_1.getOllamaApiEndpoint)();
    const models = {};
    if (openAIApiKey) {
        try {
            models['openai'] = {
                'gpt-3.5-turbo': new openai_1.ChatOpenAI({
                    openAIApiKey,
                    modelName: 'gpt-3.5-turbo',
                    temperature: 0.7,
                }),
                'gpt-4': new openai_1.ChatOpenAI({
                    openAIApiKey,
                    modelName: 'gpt-4',
                    temperature: 0.7,
                }),
                embeddings: new openai_1.OpenAIEmbeddings({
                    openAIApiKey,
                    modelName: 'text-embedding-3-large',
                }),
            };
        }
        catch (err) {
            console.log(`Error loading OpenAI models: ${err}`);
        }
    }
    if (ollamaEndpoint) {
        try {
            const response = await fetch(`${ollamaEndpoint}/api/tags`);
            const { models: ollamaModels } = (await response.json());
            models['ollama'] = ollamaModels.reduce((acc, model) => {
                acc[model.model] = new ollama_1.ChatOllama({
                    baseUrl: ollamaEndpoint,
                    model: model.model,
                    temperature: 0.7,
                });
                return acc;
            }, {});
            if (Object.keys(models['ollama']).length > 0) {
                models['ollama']['embeddings'] = new ollama_2.OllamaEmbeddings({
                    baseUrl: ollamaEndpoint,
                    model: models['ollama'][Object.keys(models['ollama'])[0]].model,
                });
            }
        }
        catch (err) {
            console.log(`Error loading Ollama models: ${err}`);
        }
    }
    return models;
};
exports.getAvailableProviders = getAvailableProviders;
