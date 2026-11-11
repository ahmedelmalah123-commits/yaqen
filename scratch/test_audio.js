const https = require('https');

const urls = [
  "https://archive.org/download/EidTakbirBySheikhAliMullah/Eid%20Takbir.mp3",
  "https://archive.org/download/mp3---many---of--takbeerat---aleid----by--repeat---2---hours----by--mashary-alafasi/mp3---many---of--takbeerat---aleid----by--repeat---2---hours----by--mashary-alafasi.mp3",
  "https://archive.org/download/hajj-takbeerat/hajj-takbeerat.mp3",
  "https://archive.org/download/TakbeeratAl-eidMishariAl-afasi/Takbeerat%20Al-Eid%20-%20Mishari%20Al-Afasi.mp3",
  "https://archive.org/download/TakbeeratEid/Takbeerat%20Eid.mp3"
];

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      console.log(`URL: ${url} -> Status: ${res.statusCode}`);
      resolve(res.statusCode);
    }).on('error', (e) => {
      console.log(`URL: ${url} -> Error: ${e.message}`);
      resolve(500);
    });
  });
}

async function run() {
  for (const url of urls) {
    await checkUrl(url);
  }
}

run();
