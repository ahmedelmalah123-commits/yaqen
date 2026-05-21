const https = require('https');
const http = require('http');

const urls = [
  "http://localhost:4173/audio/takbeerat-eid.mp3",
  "http://localhost:4173/audio/takbeerat-dhulhijjah.mp3"
];

function checkUrl(urlStr) {
  return new Promise((resolve) => {
    http.get(urlStr, (res) => {
      console.log(`URL: ${urlStr} -> Status: ${res.statusCode} | Content-Type: ${res.headers['content-type']}`);
      resolve(res.statusCode);
    }).on('error', (e) => {
      console.log(`URL: ${urlStr} -> Error: ${e.message}`);
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
