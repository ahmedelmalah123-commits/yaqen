const fs = require('fs');
const path = require('path');
const https = require('https');
const urlModule = require('url');

const dest = path.join(__dirname, '..', 'public', 'audio', 'takbeerat-eid.mp3');
const fileUrl = 'https://archive.org/download/Takbeer_Al-Eid_Makkah/Ali_Mulla.mp3';

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

console.log("Downloading standard Ali Mulla Takbeerat from Makkah...");
downloadFile(fileUrl, dest)
  .then(() => console.log("Download completed successfully!"))
  .catch(err => console.error("Download failed:", err.message));
