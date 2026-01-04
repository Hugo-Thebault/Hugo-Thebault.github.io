const fs = require('fs');

const files = [
  'src/assets/vitrinePresentation.png',
  'src/assets/entreprisePresentation.png',
  'src/assets/ventePresentation.png',
];

function chunkCounts(file) {
  const buf = fs.readFileSync(file);
  let off = 8;
  const counts = {};
  while (off + 8 <= buf.length) {
    const len = buf.readUInt32BE(off);
    off += 4;
    const type = buf.subarray(off, off + 4).toString('ascii');
    off += 4;
    counts[type] = (counts[type] || 0) + 1;
    off += len;
    off += 4; // crc
    if (type === 'IEND') break;
  }
  return counts;
}

for (const file of files) {
  const counts = chunkCounts(file);
  const present = ['IHDR', 'sRGB', 'iCCP', 'gAMA', 'cHRM', 'pHYs', 'tEXt', 'zTXt', 'iTXt', 'bKGD', 'tRNS', 'PLTE']
    .filter((k) => counts[k]);
  console.log('\n' + file);
  console.log('present:', present.length ? present.join(', ') : '(none)');
  console.log('counts:', counts);
}
