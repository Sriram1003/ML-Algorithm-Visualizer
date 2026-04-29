const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.css')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Global fixes
  content = content.replace(/w-\[500px\]/g, 'w-full max-w-[500px]');
  content = content.replace(/w-\[800px\]/g, 'w-full max-w-[800px]');
  content = content.replace(/w-screen/g, 'w-full');
  
  // Container padding
  content = content.replace(/min-h-screen bg-\[#020202\] text-white p-6 md:p-12 relative overflow-hidden/g, 'min-h-screen bg-[#020202] text-white px-4 sm:px-6 md:px-8 py-6 sm:py-10 md:py-16 relative w-full max-w-[100vw] overflow-x-hidden');
  content = content.replace(/min-h-screen bg-\[#020202\] text-white p-6 md:p-12 relative/g, 'min-h-screen bg-[#020202] text-white px-4 sm:px-6 md:px-8 py-6 sm:py-10 md:py-16 relative w-full max-w-[100vw] overflow-x-hidden');
  
  // Headers typography
  content = content.replace(/<h1 className="([^"]+)"/g, (match, classStr) => {
    let newClassStr = classStr;
    
    // If it's a very large header, replace its size
    if (newClassStr.includes('text-6xl') || newClassStr.includes('text-7xl') || newClassStr.includes('text-8xl') || newClassStr.includes('text-4xl md:text-6xl') || newClassStr.includes('text-5xl sm:text-7xl')) {
        newClassStr = newClassStr.replace(/\btext-\d+xl\b/g, '');
        newClassStr = newClassStr.replace(/\bmd:text-\d+xl\b/g, '');
        newClassStr = newClassStr.replace(/\bsm:text-\d+xl\b/g, '');
        newClassStr = newClassStr.replace(/\blg:text-\d+xl\b/g, '');
        newClassStr = newClassStr.replace(/\bbreak-words\b/g, '');
        newClassStr = newClassStr.replace(/\bleading-tight\b/g, '');
        newClassStr = newClassStr.replace(/\bleading-none\b/g, '');
        
        // Remove dangling prefixes safely
        newClassStr = newClassStr.replace(/\bmd:\s/g, ' ');
        newClassStr = newClassStr.replace(/\bsm:\s/g, ' ');
        newClassStr = newClassStr.replace(/\blg:\s/g, ' ');
        
        newClassStr = 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl break-words leading-tight ' + newClassStr;
        newClassStr = newClassStr.replace(/\s+/g, ' ').trim();
    }
    return `<h1 className="${newClassStr}"`;
  });

  // Buttons and layouts
  content = content.replace(/flex flex-wrap gap-4/g, 'flex flex-col sm:flex-row gap-3 w-full');
  content = content.replace(/h-\[400px\]/g, 'h-[300px] md:h-[400px]');
  content = content.replace(/h-\[500px\]/g, 'h-[350px] md:h-[500px]');
  
  // Grid responsiveness
  content = content.replace(/grid md:grid-cols-2/g, 'grid grid-cols-1 md:grid-cols-2');
  content = content.replace(/grid md:grid-cols-3/g, 'grid grid-cols-1 md:grid-cols-3');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

walkDir('./app', processFile);
walkDir('./components', processFile);
