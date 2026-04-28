const params = [
    { id: 'param0', barId: 'bar0', min: 180, max: 260, normal: [210, 240], dec: 1 },
    { id: 'param1', barId: 'bar1', min: 220, max: 230, normal: [223, 227], dec: 1 },
    { id: 'param2', barId: 'bar2', min: 0,   max: 100, normal: [30, 80],   dec: 0 },
    { id: 'param3', barId: 'bar3', min: 0,   max: 100, normal: [90, 100],  dec: 0 },
];

let autoInterval = null;
let isAutoEnabled = false;
let upsChart;
const maxPoints = 12;
const labels = [];
const dataIn = [];
const dataOut = [];

function initChart() {
    const ctx = document.getElementById('upsChart').getContext('2d');
    upsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Вхід (V)', data: dataIn, borderColor: '#38bdf8', borderWidth: 2.5, tension: 0.35, pointRadius: 2 },
                { label: 'Вихід (V)', data: dataOut, borderColor: '#10b981', borderWidth: 2.5, tension: 0.35, pointRadius: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { 
                y: { min: 170, max: 270, grid: { color: '#334155' } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { labels: { color: '#f8fafc' } } }
        }
    });
}

function updateData() {
    const time = new Date().toLocaleTimeString('uk-UA');
    const values = params.map(p => {
        const val = parseFloat((Math.random() * (p.max - p.min) + p.min).toFixed(p.dec));
        document.getElementById(p.id).textContent = val;
        
        const bar = document.getElementById(p.barId);
        bar.className = 'indicator-line';
        if (val >= p.normal[0] && val <= p.normal[1]) bar.classList.add('line-normal');
        else if (val >= p.min && val <= p.max) bar.classList.add('line-warning');
        else bar.classList.add('line-danger');
        
        return val;
    });

    const modeEl = document.getElementById('modeVal');
    const labelEl = document.getElementById('modeLabel');
    if (values[2] > 95) {
        modeEl.textContent = 'BYPASS';
        modeEl.style.color = '#f59e0b';
        labelEl.textContent = 'Критичне навантаження — обхід АКБ';
    } else if (values[0] < 200 || values[0] > 250) {
        modeEl.textContent = 'БАТАРЕЯ';
        modeEl.style.color = '#ef4444';
        labelEl.textContent = 'Нестабільна вхідна напруга';
    } else {
        modeEl.textContent = 'МЕРЕЖА';
        modeEl.style.color = '#38bdf8';
        labelEl.textContent = 'Штатний режим живлення';
    }

    document.getElementById('freqVal').textContent = (Math.random() * 0.4 + 49.8).toFixed(2) + ' Hz';
    document.getElementById('tempVal').textContent = Math.round(25 + values[2]*0.18) + ' °C';

    if (labels.length >= maxPoints) { labels.shift(); dataIn.shift(); dataOut.shift(); }
    labels.push(time); dataIn.push(values[0]); dataOut.push(values[1]);
    upsChart.update();
    
    document.getElementById('lastUpdate').textContent = time;
}

function toggleAuto() {
    const btn = document.getElementById('autoUpdateBtn');
    const statusText = document.getElementById('autoStatus');
    if (!isAutoEnabled) {
        autoInterval = setInterval(updateData, 3000);
        isAutoEnabled = true;
        btn.textContent = 'ЗУПИНИТИ';
        btn.className = 'btn btn-danger';
        statusText.textContent = '3 сек';
    } else {
        clearInterval(autoInterval);
        isAutoEnabled = false;
        btn.textContent = 'АВТООНОВЛЕННЯ';
        btn.className = 'btn btn-outline';
        statusText.textContent = 'Вимкнено';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initChart();
    updateData();
    document.getElementById('updateBtn').addEventListener('click', updateData);
    document.getElementById('autoUpdateBtn').addEventListener('click', toggleAuto);
});