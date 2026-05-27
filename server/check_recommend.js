const http = require('http');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? require('https') : require('http');
    lib.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

(async () => {
  const url = 'http://localhost:5000/api/doctors/recommend?count=6';
  try {
    console.log('Calling recommend endpoint (1)...');
    const r1 = await fetchJson(url);
    console.log('First call IDs:', r1.doctors.map(d => d.id));

    console.log('Calling recommend endpoint (2)...');
    const r2 = await fetchJson(url);
    console.log('Second call IDs:', r2.doctors.map(d => d.id));

    const set1 = new Set(r1.doctors.map(d => d.id));
    const duplicates = r2.doctors.filter(d => set1.has(d.id)).map(d => d.id);
    console.log('Duplicates between first and second call:', duplicates);
  } catch (err) {
    console.error('Error during check:', err);
  }
})();
