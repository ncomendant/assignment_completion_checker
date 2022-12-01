const gatewayUrl = 'https://buildbright.io:3023';
const entryIds = [];

async function update(section, assignments, token) {
    const params = new URLSearchParams({
        section,
        assignments,
    });
    const url = `${gatewayUrl}/completions?` + params;
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
            document.body.innerHTML = document.body.innerHTML + `<div>${entry.nickname || entry.forename} ${entry.surname[0]}.</div>`;
            entryIds.push(entry.id);
        }
    }
}

async function init() {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    const assignments = params.get('assignments');
    const token = localStorage.getItem('token');
    update(section, assignments, token);
    setInterval(() => {
        update(section, assignments, token);
    }, 30000);
}

init();