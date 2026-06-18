const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://chat-reviver.com';

const filesToDownload = [
  // Lottie animations
  {
    url: '/assets/img/home/lottie/Hero-2.json',
    path: './assets/img/home/lottie/Hero-2.json'
  },
  {
    url: '/assets/img/home/lottie/Discord-Setup-Transparent.json',
    path: './assets/img/home/lottie/Discord-Setup-Transparent.json'
  },
  {
    url: '/assets/img/home/lottie/Dashboard-Setup-Transparent.json',
    path: './assets/img/home/lottie/Dashboard-Setup-Transparent.json'
  },
  {
    url: '/assets/img/home/lottie/Discord-Setup.json',
    path: './assets/img/home/lottie/Discord-Setup.json'
  },
  {
    url: '/assets/img/home/lottie/Dashboard-Setup.json',
    path: './assets/img/home/lottie/Dashboard-Setup.json'
  },
  {
    url: '/assets/img/home/lottie/ai-topics.json',
    path: './assets/img/home/lottie/ai-topics.json'
  },
  {
    url: '/assets/img/home/lottie/Custom-Topics.json',
    path: './assets/img/home/lottie/Custom-Topics.json'
  },
  // Favicon files
  {
    url: '/assets/img/favicon/favicon.ico',
    path: './assets/img/favicon/favicon.ico'
  },
  {
    url: '/assets/img/favicon/favicon-32x32.png',
    path: './assets/img/favicon/favicon-32x32.png'
  },
  {
    url: '/assets/img/favicon/favicon-16x16.png',
    path: './assets/img/favicon/favicon-16x16.png'
  },
  {
    url: '/assets/img/favicon/apple-touch-icon.png',
    path: './assets/img/favicon/apple-touch-icon.png'
  },
  {
    url: '/assets/img/favicon/safari-pinned-tab.svg',
    path: './assets/img/favicon/safari-pinned-tab.svg'
  },
  {
    url: '/assets/img/favicon/browserconfig.xml',
    path: './assets/img/favicon/browserconfig.xml'
  },
  // Other assets
  {
    url: '/assets/img/ai-sparkles.svg',
    path: './assets/img/ai-sparkles.svg'
  }
];

function downloadFile(fileInfo) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, fileInfo.path);
    const dirName = path.dirname(filePath);

    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    const fileUrl = baseUrl + fileInfo.url;
    console.log(`Downloading ${fileUrl}...`);

    https.get(fileUrl, (response) => {
      if (response.statusCode !== 200) {
        console.error(`Failed to download ${fileUrl}: Status ${response.statusCode}`);
        resolve();
        return;
      }

      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Successfully downloaded ${fileInfo.path}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        console.error(`Error writing file ${fileInfo.path}:`, err);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${fileUrl}:`, err);
      resolve();
    });
  });
}

async function downloadAllFiles() {
  console.log('Starting to download assets...\n');
  for (const fileInfo of filesToDownload) {
    await downloadFile(fileInfo);
  }
  console.log('\nAll downloads complete!');
}

downloadAllFiles();
