const WebSocket = require('ws');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const wss = new WebSocket.Server({ port: 8080 });

const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
const OPENAI_API_URL = 'wss://api.openai.com/v1/realtime';

wss.on('connection', (ws) => {
    console.log('New client connected');

    const openaiSocket = new WebSocket(OPENAI_API_URL, {
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
    });

    openaiSocket.on('open', () => {
        console.log('Connected to OpenAI');
    });

    openaiSocket.on('message', (data) => {
        console.log('Received from OpenAI:', data);
        ws.send(data);
    });

    ws.on('message', (audioBuffer) => {
        console.log('Received audio from client');
        if (openaiSocket.readyState === WebSocket.OPEN) {
            openaiSocket.send(audioBuffer);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        openaiSocket.close();
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
