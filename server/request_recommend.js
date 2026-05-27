const http = require('http');

function request(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

(async () => {
  try {
    const url = 'http://localhost:5001/api/doctors/recommend?count=6';
    const r = await request(url);
    console.log('STATUS:', r.status);
    console.log('BODY:', r.body);
  } catch (e) {
    console.error(e);
  }
})();
