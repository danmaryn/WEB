document.addEventListener('DOMContentLoaded', () => {
    loadScadaSystem();
    loadDevices();
    loadAlarms();
});

async function loadScadaSystem() {
    try {
        const response = await fetch('/api/scada');
        const scada = await response.json();

        document.getElementById('displaySysName').textContent = scada.systemName;
        document.getElementById('valDevices').textContent = scada.connectedDevices;
        document.getElementById('valPoints').textContent = scada.dataPointsCount;
        document.getElementById('valRate').textContent = scada.samplingRate;
        document.getElementById('valStorage').textContent = scada.storageUsed;

        const commBadge = document.getElementById('commStatus');
        commBadge.textContent = scada.communicationStatus;
        commBadge.className = `badge ${scada.communicationStatus}`;

        const alarmBadge = document.getElementById('alarmStatus');
        alarmBadge.textContent = scada.alarmLevel;
        alarmBadge.className = `badge ${scada.alarmLevel}`;

        document.getElementById('sysNameInput').value = scada.systemName;
        document.getElementById('sampleRateInput').value = scada.samplingRate;
        document.getElementById('alarmSelect').value = scada.alarmLevel;
        document.getElementById('storageInput').value = scada.storageUsed;
    } catch (error) {
        console.error('Помилка завантаження SCADA', error);
    }
}

async function loadDevices() {
    const list = document.getElementById('devicesList');
    list.innerHTML = '<p>Завантаження...</p>';
    try {
        const response = await fetch('/api/scada/devices');
        const devices = await response.json();
        
        list.innerHTML = devices.map(d => `
            <div class="list-item ${d.status}">
                <span>${d.name}</span>
                <span class="badge ${d.status === 'online' ? 'normal' : ''}">${d.status}</span>
            </div>
        `).join('');
    } catch (error) {
        list.innerHTML = '<p style="color:var(--danger)">Помилка</p>';
    }
}

async function loadAlarms() {
    const list = document.getElementById('alarmsList');
    list.innerHTML = '<p>Завантаження...</p>';
    try {
        const response = await fetch('/api/scada/alarms');
        const alarms = await response.json();
        
        if (alarms.length === 0) {
            list.innerHTML = '<p style="color:var(--success)">Тривог не виявлено. Норма.</p>';
            return;
        }

        list.innerHTML = alarms.map(a => `
            <div class="list-item ${a.level}">
                <div>
                    <strong>${a.message}</strong><br>
                    <small style="color:var(--text-muted)">${new Date(a.timestamp).toLocaleTimeString()}</small>
                </div>
            </div>
        `).join('');
    } catch (error) {
        list.innerHTML = '<p style="color:var(--danger)">Помилка</p>';
    }
}

document.getElementById('configForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        systemName: document.getElementById('sysNameInput').value,
        samplingRate: document.getElementById('sampleRateInput').value
    };

    const res = await fetch('/api/scada/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    if(res.ok) {
        showMessage('Конфігурацію застосовано!');
        loadScadaSystem();
    }
});

document.getElementById('updateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        alarmLevel: document.getElementById('alarmSelect').value,
        storageUsed: document.getElementById('storageInput').value
    };

    const res = await fetch('/api/scada', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    if(res.ok) {
        showMessage('Параметри оновлено!');
        loadScadaSystem();
        loadAlarms();
    }
});

function showMessage(text) {
    const box = document.getElementById('messageBox');
    box.textContent = text;
    box.className = 'message-box msg-success';
    setTimeout(() => box.style.display = 'none', 3000);
}