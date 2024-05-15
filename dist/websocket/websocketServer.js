"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initServer = void 0;
const ws_1 = require("ws");
const connectionManager_1 = require("./connectionManager");
const config_1 = require("../config");
const initServer = (server) => {
    const port = (0, config_1.getPort)();
    const wss = new ws_1.WebSocketServer({ server });
    wss.on('connection', (ws) => {
        (0, connectionManager_1.handleConnection)(ws);
    });
    console.log(`WebSocket server started on port ${port}`);
};
exports.initServer = initServer;
