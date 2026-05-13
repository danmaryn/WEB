const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'data', 'scada.json');

const defaultScada = {
    id: 1,
    systemName: "Головна SCADA Підстанції",
    connectedDevices: 12,
    dataPointsCount: 1560,
    samplingRate: 2,
    alarmLevel: "normal",
    communicationStatus: "online",
    lastUpdate: new Date().toISOString(),
    storageUsed: 45
};

function readData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            writeData(defaultScada);
            return defaultScada;
        }
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (error) {
        return defaultScada;
    }
}

function writeData(data) {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        data.lastUpdate = new Date().toISOString();
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        return false;
    }
}

app.get('/api/scada', (req, res) => {
    res.json(readData());
});

app.get('/api/scada/devices', (req, res) => {
    const scada = readData();
    const devices = Array.from({ length: scada.connectedDevices }, (_, i) => ({
        id: i + 1,
        name: `RTU Контролер #${i + 1}`,
        status: Math.random() > 0.15 ? "online" : "offline"
    }));
    res.json(devices);
});

app.get('/api/scada/datapoints', (req, res) => {
    const scada = readData();
    const limit = Math.min(scada.dataPointsCount, 50); 
    const points = Array.from({ length: limit }, (_, i) => ({
        id: i + 1000,
        tag: `TAG_SENSOR_${i}`,
        value: (Math.random() * 220 + 200).toFixed(2)
    }));
    res.json(points);
});

app.get('/api/scada/alarms', (req, res) => {
    const scada = readData();
    if (scada.alarmLevel === 'normal') {
        return res.json([]);
    }
    res.json([
        {
            id: Date.now(),
            level: scada.alarmLevel,
            message: `Виявлено відхилення. Статус: ${scada.alarmLevel.toUpperCase()}`,
            timestamp: scada.lastUpdate
        }
    ]);
});

app.post('/api/scada/configure', (req, res) => {
    let scada = readData();
    if (req.body.samplingRate) scada.samplingRate = parseInt(req.body.samplingRate);
    if (req.body.systemName) scada.systemName = req.body.systemName;
    
    writeData(scada);
    res.status(201).json({ success: true, message: "Нову конфігурацію застосовано", data: scada });
});

app.put('/api/scada', (req, res) => {
    let scada = readData();
    scada = { ...scada, ...req.body };
    writeData(scada);
    res.json({ success: true, message: "Параметри SCADA оновлено", data: scada });
});

app.listen(PORT, () => {
    console.log(`SCADA API Сервер працює на http://localhost:${PORT}`);
});