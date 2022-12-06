const gatewayUrl = 'https://buildbright.io:3023';
const entryIds = [];
const names = document.querySelector('.names');
const updateLab = document.querySelector('.update');

async function update(section, assignments, token) {
    const params = new URLSearchParams({
        section,
        assignments,
    });
    const url = `${gatewayUrl}/completions?` + params;
    updateLab.classList.remove('hidden');
    const res = await fetch(url, {
        method: 'GET',
        // cache: 'no-store',
        headers: {
            'Authorization': token,
        },
    });
    const data = await res.json();
    for (const entry of data) {
        if (!entryIds.some(id => id === entry.id)) {
            names.innerHTML = names.innerHTML + `<div class="entry">✅ ${entry.nickname || entry.forename} ${entry.surname[0]}.</div>`;
            entryIds.push(entry.id);
        }
    }
    updateLab.classList.add('hidden');
}

async function wait(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

async function init() {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    const assignments = params.get('assignments');
    const token = localStorage.getItem('token');
    while (true) {
        await update(section, assignments, token);
        await wait(30000);
    }
}

init();