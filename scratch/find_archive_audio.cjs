const https = require('https');

const queryUrl = 'https://archive.org/advancedsearch.php?q=title:(takbeerat%20OR%20takbeer%20OR%20%D8%AA%D9%83%D8%A8%D9%8A%D8%B1%D8%A7%D8%AA)%20AND%20mediatype:audio&fl[]=identifier,title&sort[]=downloads%20desc&rows=20&output=json';

https.get(queryUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      const docs = data.response.docs;
      console.log(`Found ${docs.length} items:`);
      docs.forEach(doc => {
        console.log(`- Identifier: ${doc.identifier} | Title: ${doc.title}`);
      });
    } catch (e) {
      console.log("Error parsing response:", e.message);
    }
  });
}).on('error', (e) => {
  console.log("HTTP Error:", e.message);
});
