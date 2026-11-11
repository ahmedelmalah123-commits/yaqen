const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateArtwork() {
  const logoPath = path.resolve('public/logo.png');
  if (!fs.existsSync(logoPath)) throw new Error('logo.png not found');

  const size = 1024;
  const svgBg = Buffer.from(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#19241F" />
          <stop offset="50%" stop-color="#111815" />
          <stop offset="100%" stop-color="#080C0A" />
        </radialGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E8CE9F" />
          <stop offset="50%" stop-color="#CAA465" />
          <stop offset="100%" stop-color="#9C7736" />
        </linearGradient>
        <linearGradient id="goldSubtle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#CAA465" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#9C7736" stop-opacity="0.1" />
        </linearGradient>
      </defs>

      <!-- Background Deep Dark Charcoal -->
      <rect width="${size}" height="${size}" fill="url(#bgGrad)" />

      <!-- Outer Frame -->
      <rect x="36" y="36" width="952" height="952" rx="56" fill="none" stroke="url(#goldSubtle)" stroke-width="2" />
      <rect x="52" y="52" width="920" height="920" rx="44" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-opacity="0.6" stroke-dasharray="10 8" />

      <!-- Corner Islamic geometric ornaments -->
      <g stroke="url(#goldGrad)" stroke-width="2" fill="none" opacity="0.8">
        <!-- Top Left -->
        <path d="M 68 130 L 130 130 L 130 68" />
        <circle cx="130" cy="130" r="5" fill="#CAA465" />
        <!-- Top Right -->
        <path d="M 956 130 L 894 130 L 894 68" />
        <circle cx="894" cy="130" r="5" fill="#CAA465" />
        <!-- Bottom Left -->
        <path d="M 68 894 L 130 894 L 130 956" />
        <circle cx="130" cy="894" r="5" fill="#CAA465" />
        <!-- Bottom Right -->
        <path d="M 956 894 L 894 894 L 894 956" />
        <circle cx="894" cy="894" r="5" fill="#CAA465" />
      </g>

      <!-- Central Sacred 8-Pointed Star Halo (Khatim) -->
      <g transform="translate(512, 512)" stroke="url(#goldGrad)" fill="none">
        <rect x="-310" y="-310" width="620" height="620" rx="28" stroke-width="2" fill="#131C18" fill-opacity="0.75" />
        <rect x="-310" y="-310" width="620" height="620" rx="28" stroke-width="2" transform="rotate(45)" fill="#131C18" fill-opacity="0.75" />
        <!-- Concentric rings -->
        <circle r="365" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="6 6" />
        <circle r="395" stroke-width="2" stroke-opacity="0.6" />
      </g>

      <!-- Bottom Platform Tagline -->
      <text x="512" y="915" font-family="Cairo, Arial, sans-serif" font-size="28" font-weight="900" fill="#E8CE9F" text-anchor="middle" letter-spacing="3" opacity="0.95">
        مَنَصَّةُ يَقِين — اَلْقُرْآنُ الْكَرِيم
      </text>
    </svg>
  `);

  // Prepare background buffer
  const baseBg = await sharp(svgBg).png().toBuffer();

  // Resize Yaqeen emblem cleanly for center placement
  const logoEmblem = await sharp(logoPath)
    .trim()
    .resize(460, 460, { fit: 'inside' })
    .toBuffer();

  // Composite emblem in center
  const master1024 = await sharp(baseBg)
    .composite([
      {
        input: logoEmblem,
        gravity: 'center',
      }
    ])
    .png({ quality: 95 })
    .toBuffer();

  // Save 1024x1024 master
  fs.writeFileSync(path.resolve('public/audio-artwork.png'), master1024);
  fs.writeFileSync(path.resolve('public/audio-artwork-1024.png'), master1024);
  console.log('Master 1024x1024 generated');

  // Generate media session variants
  const sizes = [512, 384, 256, 192, 128, 96];
  for (const s of sizes) {
    const resized = await sharp(master1024).resize(s, s).png().toBuffer();
    fs.writeFileSync(path.resolve(`public/audio-artwork-${s}.png`), resized);
    console.log(`Generated audio-artwork-${s}.png`);
  }
}

generateArtwork().catch((err) => {
  console.error(err);
  process.exit(1);
});

