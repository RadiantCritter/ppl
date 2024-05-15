"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfig = exports.getOllamaApiEndpoint = exports.getSearxngApiEndpoint = exports.getOpenaiApiKey = exports.getChatModel = exports.getChatModelProvider = exports.getSimilarityMeasure = exports.getPort = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const toml_1 = __importDefault(require("@iarna/toml"));
const configFileName = 'config.toml';
const loadConfig = () => toml_1.default.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, `../${configFileName}`), 'utf-8'));
const getPort = () => loadConfig().GENERAL.PORT;
exports.getPort = getPort;
const getSimilarityMeasure = () => loadConfig().GENERAL.SIMILARITY_MEASURE;
exports.getSimilarityMeasure = getSimilarityMeasure;
const getChatModelProvider = () => loadConfig().GENERAL.CHAT_MODEL_PROVIDER;
exports.getChatModelProvider = getChatModelProvider;
const getChatModel = () => loadConfig().GENERAL.CHAT_MODEL;
exports.getChatModel = getChatModel;
const getOpenaiApiKey = () => loadConfig().API_KEYS.OPENAI;
exports.getOpenaiApiKey = getOpenaiApiKey;
const getSearxngApiEndpoint = () => loadConfig().API_ENDPOINTS.SEARXNG;
exports.getSearxngApiEndpoint = getSearxngApiEndpoint;
const getOllamaApiEndpoint = () => loadConfig().API_ENDPOINTS.OLLAMA;
exports.getOllamaApiEndpoint = getOllamaApiEndpoint;
const updateConfig = (config) => {
    const currentConfig = loadConfig();
    for (const key in currentConfig) {
        /* if (currentConfig[key] && !config[key]) {
          config[key] = currentConfig[key];
        } */
        if (currentConfig[key] && typeof currentConfig[key] === 'object') {
            for (const nestedKey in currentConfig[key]) {
                if (currentConfig[key][nestedKey] &&
                    !config[key][nestedKey] &&
                    config[key][nestedKey] !== '') {
                    config[key][nestedKey] = currentConfig[key][nestedKey];
                }
            }
        }
        else if (currentConfig[key] && !config[key] && config[key] !== '') {
            config[key] = currentConfig[key];
        }
    }
    fs_1.default.writeFileSync(path_1.default.join(__dirname, `../${configFileName}`), toml_1.default.stringify(config));
};
exports.updateConfig = updateConfig;
