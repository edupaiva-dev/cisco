const fs = require('fs');
let c = fs.readFileSync('6-1427200-4.html', 'utf8');
c = c.replace('<table class="w-full text-left border-collapse">', '<table class="w-full text-left border-collapse block overflow-x-auto whitespace-nowrap">');
fs.writeFileSync('6-1427200-4.html', c);
