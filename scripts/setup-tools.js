import fs from 'fs';
import path from 'path';

const tools = ['position-gen', 'crypto-receipt', 'support-center'];
const srcDir = path.join(process.cwd(), 'tools-src');
const destDir = path.join(process.cwd(), 'public', 'tools');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

tools.forEach(tool => {
  const toolSrc = path.join(srcDir, tool);
  const toolDest = path.join(destDir, tool);
  
  if (!fs.existsSync(toolDest)) {
    fs.mkdirSync(toolDest, { recursive: true });
  }

  if (fs.existsSync(toolSrc)) {
    const files = fs.readdirSync(toolSrc);
    files.forEach(file => {
      fs.copyFileSync(path.join(toolSrc, file), path.join(toolDest, file));
    });
    console.log(`Copied ${tool} to public/tools/`);
  }
});
