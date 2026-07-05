const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/persona');

// Ensure directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Highly stylized SVG avatars
const avatars = {
  hitesh: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="hiteshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ea580c" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#hiteshGrad)" stroke="#27272a" stroke-width="2" />
      <path d="M25 40 L35 50 L25 60" fill="none" stroke="#fafafa" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.3" />
      <path d="M75 40 L65 50 L75 60" fill="none" stroke="#fafafa" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.3" />
      <text x="50" y="58" font-family="system-ui, sans-serif" font-weight="bold" font-size="28" fill="#fafafa" text-anchor="middle">HC</text>
      <circle cx="50" cy="80" r="12" fill="#fafafa" opacity="0.15" />
    </svg>
  `.trim(),

  piyush: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="piyushGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ec4899" />
          <stop offset="100%" stop-color="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#piyushGrad)" stroke="#27272a" stroke-width="2" />
      <rect x="25" y="45" width="20" height="4" fill="#fafafa" opacity="0.3" />
      <rect x="50" y="35" width="4" height="20" fill="#fafafa" opacity="0.3" />
      <text x="50" y="58" font-family="system-ui, sans-serif" font-weight="bold" font-size="28" fill="#fafafa" text-anchor="middle">PG</text>
      <circle cx="20" cy="30" r="4" fill="#fafafa" opacity="0.2" />
      <circle cx="80" cy="70" r="6" fill="#fafafa" opacity="0.2" />
    </svg>
  `.trim(),

  suraj: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="surajGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#06b6d4" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#surajGrad)" stroke="#27272a" stroke-width="2" />
      <ellipse cx="50" cy="35" rx="20" ry="6" fill="none" stroke="#fafafa" stroke-width="2" opacity="0.3" />
      <ellipse cx="50" cy="50" rx="20" ry="6" fill="none" stroke="#fafafa" stroke-width="2" opacity="0.3" />
      <text x="50" y="58" font-family="system-ui, sans-serif" font-weight="bold" font-size="28" fill="#fafafa" text-anchor="middle">SJ</text>
    </svg>
  `.trim(),

  anirudh: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="anirudhGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10b981" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#anirudhGrad)" stroke="#27272a" stroke-width="2" />
      <line x1="20" y1="20" x2="40" y2="40" stroke="#fafafa" stroke-width="2" opacity="0.2" />
      <line x1="80" y1="20" x2="60" y2="40" stroke="#fafafa" stroke-width="2" opacity="0.2" />
      <text x="50" y="58" font-family="system-ui, sans-serif" font-weight="bold" font-size="28" fill="#fafafa" text-anchor="middle">AJ</text>
    </svg>
  `.trim()
};

for (const [name, content] of Object.entries(avatars)) {
  const filePath = path.join(targetDir, `${name}.svg`);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Saved avatar: ${filePath}`);
}

console.log('All persona SVG avatars created successfully!');
