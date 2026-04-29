const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'data', 'diagnostics.json');

function readData() {
    try {
        if (!fs.existsSync(DATA_FILE)) return [];
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (error) {
        console.error('Помилка читання:', error);
        return [];
    }
}

function writeData(data) {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Помилка запису:', error);
        return false;
    }
}

app.get('/api/diagnostics', (req, res) => {
    res.json(readData());
});

app.post('/api/diagnostics', (req, res) => {
    try {
        const newRecord = {
            id: Date.now().toString(),
            type: req.body.type,
            number: req.body.number,
            substation: req.body.substation,
            results: req.body.results,
            history: req.body.history,
            notify: req.body.notify === 'on',
            date: new Date().toISOString()
        };

        const records = readData();
        records.push(newRecord);

        if (writeData(records)) {
            res.status(201).json({ success: true, message: 'Протокол діагностики збережено' });
        } else {
            throw new Error('Помилка запису у файл');
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/diagnostics/:id', (req, res) => {
    try {
        let records = readData();
        records = records.filter(r => r.id !== req.params.id);
        
        if (writeData(records)) {
            res.json({ success: true, message: 'Протокол видалено' });
        } else {
            throw new Error('Помилка запису');
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Помилка видалення' });
    }
});

app.listen(PORT, () => {
    console.log(`Система діагностики працює на http://localhost:${PORT}`);
});