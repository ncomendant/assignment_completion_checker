const gatewayUrl = 'https://complete.buildbright.io';
// const gatewayUrl = 'http://localhost:3017';
const entryIds = [];
const names = document.querySelector('.names');
const updateLab = document.querySelector('.update');

async function update(section, assignments, token, exclude) {
    const params = new URLSearchParams({
        section,
        assignments,
        exclude: exclude == 'true' ? true : false,
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
    const exclude = params.get('exclude');
    const token = localStorage.getItem('token');
    while (true) {
        await update(section, assignments, token, exclude);
        await wait(30000);
    }
}

init();