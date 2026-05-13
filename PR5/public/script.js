let map, loadChart;
let markers = {};
const maxDataPoints = 20;

function initMap() {
    map = L.map('map').setView([50.4501, 30.5234], 11);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);
}

function initChart() {
    const ctx = document.getElementById('loadChart').getContext('2d');
    loadChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Загальне навантаження (МВт)',
                data: [],
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            scales: {
                y: { min: 100, max: 180, grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
            },
            plugins: { legend: { labels: { color: '#f8fafc' } } }
        }
    });
}

function updateDashboard(data) {
    document.getElementById('sysLoad').textContent = data.systemLoad;
    document.getElementById('sysFreq').textContent = data.frequency;

    const timeLabel = new Date(data.timestamp).toLocaleTimeString();
    
    if (loadChart.data.labels.length > maxDataPoints) {
        loadChart.data.labels.shift();
        loadChart.data.datasets[0].data.shift();
    }
    loadChart.data.labels.push(timeLabel);
    loadChart.data.datasets[0].data.push(data.systemLoad);
    loadChart.update();

    const listContainer = document.getElementById('devicesList');
    listContainer.innerHTML = '';

    data.devices.forEach(dev => {
        let color = dev.status === 'critical' ? 'red' : dev.status === 'warning' ? 'orange' : 'green';
        
        if (!markers[dev.id]) {
            markers[dev.id] = L.circleMarker([dev.lat, dev.lng], {
                radius: 12,
                color: color,
                fillColor: color,
                fillOpacity: 0.6
            }).addTo(map).bindPopup(`<b>${dev.name}</b><br>Напруга: ${dev.voltage} кВ`);
        } else {
            markers[dev.id].setStyle({ color: color, fillColor: color });
            markers[dev.id].getPopup().setContent(`<b>${dev.name}</b><br>Напруга: ${dev.voltage} кВ`);
        }

        listContainer.innerHTML += `
            <div class="device-item ${dev.status}">
                <strong>${dev.name}</strong>
                <span>Напруга: ${dev.voltage} кВ | Статус: ${dev.status.toUpperCase()}</span>
            </div>
        `;
    });
}

function connectWebSocket() {
    const wsStatus = document.getElementById('wsStatus');
    const ws = new WebSocket(`ws://${window.location.host}`);

    ws.onopen = () => {
        wsStatus.textContent = "CONNECTED LIVE";
        wsStatus.className = "status-indicator connected";
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'init' || message.type === 'update') {
            updateDashboard(message.data);
        }
    };

    ws.onclose = () => {
        wsStatus.textContent = "DISCONNECTED";
        wsStatus.className = "status-indicator disconnected";
        setTimeout(connectWebSocket, 3000);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initChart();
    connectWebSocket();
});