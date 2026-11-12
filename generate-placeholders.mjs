import fs from 'fs';
import path from 'path';

const publicDir = 'C:/Users/DELL/.gemini/antigravity/scratch/bagan-ebike-go/public';

// Minimal 1x1 JPEG buffer
const minimalJpgBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
fs.writeFileSync(path.join(publicDir, 'bagan-ebike-fleet.jpg'), Buffer.from(minimalJpgBase64, 'base64'));

// Minimal 1x1 PNG
const minimalPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), Buffer.from(minimalPngBase64, 'base64'));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), Buffer.from(minimalPngBase64, 'base64'));

// Empty stub mp4 so <video src="/bagan-sunrise.mp4"> doesn't return 404
fs.writeFileSync(path.join(publicDir, 'bagan-sunrise.mp4'), Buffer.alloc(0));

console.log('Public placeholders created successfully');
