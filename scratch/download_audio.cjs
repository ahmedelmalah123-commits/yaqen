const fs = require('fs');
const path = require('path');
const https = require('https');
const urlModule = require('url');

const publicAudioDir = path.join(__dirname, '..', 'public', 'audio');

// Ensure public/audio directory exists
if (!fs.existsSync(publicAudioDir)) {
  fs.mkdirSync(publicAudioDir, { recursive: true });
}

const filesToDownload = [
  {
    name: 'takbeerat-eid.mp3',
    url: 'https://archive.org/download/Takbirat3idAliMola/takbirat-3id-ali-mola.mp3'
  },
  {
    name: 'takbeerat-dhulhijjah.mp3',
    url: 'https://archive.org/download/takir-mshari/takir-mshari.mp3'
  }
];

function downloadFile(urlStr, destPath, depth = 0) {
  return new Promise((resolve, reject) => {
    if (depth > 5) {
      reject(new Error('Too many redirects'));
      return;
    }
    const parsedUrl = urlModule.parse(urlStr);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    };

    https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = urlModule.resolve(urlStr, redirectUrl);
        }
        console.log(`Redirecting to: ${redirectUrl}`);
        resolve(downloadFile(redirectUrl, destPath, depth + 1));
      } else if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Successfully downloaded: ${destPath}`);
          resolve();
        });
        fileStream.on('error', (err) => {
          fs.unlink(destPath, () => {});
          reject(err);
        });
      } else {
        reject(new Error(`Failed to download, status: ${res.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  for (const item of filesToDownload) {
    const dest = path.join(publicAudioDir, item.name);
    console.log(`Starting download for ${item.name}...`);
    try {
      await downloadFile(item.url, dest);
      console.log(`Finished ${item.name}\n`);
    } catch (e) {
      console.error(`Error downloading ${item.name}:`, e.message);
    }
  }
}

run();
