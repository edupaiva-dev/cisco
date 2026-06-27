const fs = require('fs');
const path = require('path');

const dir = 'd:/Proyectos/Ejercicio empresa/cisco';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');

    // 1. Add tailwind-config.js if missing
    if (!content.includes('tailwind-config.js')) {
        content = content.replace(
            '<script src="https://cdn.tailwindcss.com"></script>',
            '<script src="https://cdn.tailwindcss.com"></script>\n  <script src="./js/tailwind-config.js"></script>'
        );
    }

    // 2. Fix specific absolute links to local files
    content = content.replace(/https?:\/\/(www\.)?ds3comunicaciones\.com\/cisco\/index\.html/g, './index.html');
    content = content.replace(/https?:\/\/(www\.)?ds3comunicaciones\.com\/cisco\/catalys_9200l\.html/g, './index.html');
    content = content.replace(/https?:\/\/(www\.)?ds3comunicaciones\.com\/AMP\/index\.html/g, './amp_index.html');
    content = content.replace(/https?:\/\/(www\.)?ds3comunicaciones\.com\/AMP\/amp_prod\.html/g, './amp_prod.html');
    
    // Fix netperu product links
    content = content.replace(/https?:\/\/web\.netperu100\.com\/cisco\/catalyst\/C9200L-24P-4G-E\.html/g, './C9200L-24P-4G-E.html');
    
    // Fix all other ds3comunicaciones.com links to '#' so it acts as a standalone template
    content = content.replace(/href="https?:\/\/(www\.)?ds3comunicaciones\.com[^"]*"/g, 'href="#"');
    content = content.replace(/href="https?:\/\/web\.netperu100\.com[^"]*"/g, 'href="#"');

    // 3. Make tables responsive
    content = content.replace(/<table([^>]*)class="([^"]*)"/gi, (match, p1, p2) => {
        if (!p2.includes('block') && !p2.includes('overflow-x-auto')) {
            return `<table${p1}class="${p2} block w-full overflow-x-auto whitespace-nowrap"`;
        }
        return match;
    });
    content = content.replace(/<table(?![^>]*class=)([^>]*)>/gi, '<table class="block w-full overflow-x-auto whitespace-nowrap"$1>');

    // 4. Ensure sidebars hide on mobile
    content = content.replace(/class="([^"]*w-full lg:w-\d+[^"]*)"/g, (match, p1) => {
        if (p1.includes('flex-col') && !p1.includes('hidden') && !p1.includes('lg:flex')) {
             return `class="${p1} hidden lg:flex"`;
        }
        return match;
    });

    fs.writeFileSync(path.join(dir, file), content, 'utf8');
    console.log(`Refactored ${file}`);
});
