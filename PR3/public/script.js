const form = document.getElementById('diagnosticForm');
const messageBox = document.getElementById('messageBox');
const recordsList = document.getElementById('recordsList');

document.addEventListener('DOMContentLoaded', loadRecords);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    data.notify = form.notify.checked ? 'on' : 'off';

    try {
        const response = await fetch('/api/diagnostics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showMessage('success', result.message);
            form.reset();
            loadRecords();
        } else {
            showMessage('error', result.message);
        }
    } catch (error) {
        showMessage('error', 'Втрачено зв\'язок із сервером');
    }
});

async function loadRecords() {
    try {
        const response = await fetch('/api/diagnostics');
        const records = await response.json();
        renderRecords(records);
    } catch (error) {
        recordsList.innerHTML = '<p style="color: var(--danger)">Помилка завантаження архіву</p>';
    }
}

function renderRecords(records) {
    if (records.length === 0) {
        recordsList.innerHTML = '<p style="color: var(--text-muted)">Архів порожній. Додайте перший протокол.</p>';
        return;
    }

    records.sort((a, b) => new Date(b.date) - new Date(a.date));

    recordsList.innerHTML = records.map(record => `
        <div class="record-card ${record.notify ? 'critical' : ''}">
            <div class="record-header">
                <div class="record-title">
                    <h3>${record.type} [${record.number}]</h3>
                    <span>${new Date(record.date).toLocaleString('uk-UA')}</span>
                </div>
                <button class="btn btn-danger" onclick="deleteRecord('${record.id}')">ВИДАЛИТИ</button>
            </div>
            <div class="record-body">
                ${record.notify ? '<div class="tag">УВАГА: ПОТРЕБУЄ РЕМОНТУ</div>' : ''}
                <p><strong>Підстанція:</strong> ${record.substation}</p>
                ${record.history ? `<p><strong>Історія:</strong> ${record.history}</p>` : ''}
                <p><strong>Результати огляду:</strong><br> ${record.results}</p>
            </div>
        </div>
    `).join('');
}

async function deleteRecord(id) {
    if (!confirm('Назавжди видалити цей протокол з бази?')) return;

    try {
        const response = await fetch(`/api/diagnostics/${id}`, { method: 'DELETE' });
        const result = await response.json();

        if (result.success) {
            loadRecords();
        } else {
            alert('Помилка видалення');
        }
    } catch (error) {
        alert('Помилка з\'єднання');
    }
}

function showMessage(type, text) {
    messageBox.className = `message-box msg-${type}`;
    messageBox.textContent = text;
    setTimeout(() => messageBox.className = 'message-box', 4000);
}