const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

const devices = [
    { id: 1, name: "ПС Північна", lat: 50.4800, lng: 30.5000 },
    { id: 2, name: "ПС Південна", lat: 50.4000, lng: 30.5200 },
    { id: 3, name: "ПС Західна", lat: 50.4400, lng: 30.4000 },
    { id: 4, name: "ПС Східна", lat: 50.4500, lng: 30.6500 }
];

function generateRealTimeData() {
    return {
        timestamp: new Date().toISOString(),
        systemLoad: (Math.random() * 40 + 120).toFixed(1),
        frequency: (Math.random() * 0.1 + 49.95).toFixed(3),
        devices: devices.map(dev => ({
            ...dev,
            voltage: (Math.random() * 10 + 105).toFixed(1),
            status: Math.random() > 0.85 ? (Math.random() > 0.5 ? 'warning' : 'critical') : 'normal'
        }))
    };
}

wss.on('connection', (ws) => {
    console.log('Клієнт підключився до WebSocket');
    
    ws.send(JSON.stringify({
        type: 'init',
        data: generateRealTimeData()
    }));

    ws.on('close', () => {
        console.log('Клієнт відключився');
    });
});

setInterval(() => {
    const data = JSON.stringify({
        type: 'update',
        data: generateRealTimeData()
    });
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}, 2000);

server.listen(3000, () => {
    console.log('Real-time SCADA сервер працює на http://localhost:3000');
});