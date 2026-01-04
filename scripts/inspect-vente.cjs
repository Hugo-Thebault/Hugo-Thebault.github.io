const fs = require('fs');

const file = 'src/assets/ventePresentation.png';
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
  off += 4;
  if (type === 'IEND') break;
}
process.stdout.write('COUNTS=' + JSON.stringify(counts) + '\n');
