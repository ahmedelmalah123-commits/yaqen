const https = require('https');

const id = 'Takbirat3idAliMola';
const url = `https://archive.org/metadata/${id}`;

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      const mp3s = data.files.filter(f => f.name.endsWith('.mp3'));
      console.log(`=== Identifier: ${id} ===`);
      mp3s.forEach(f => {
        console.log(`  File: ${f.name} | Size: ${f.size}`);
      });
    } catch (e) {
      console.log("Error parsing:", e.message);
    }
  });
}).on('error', (e) => {
  console.log("Error fetching:", e.message);
});
