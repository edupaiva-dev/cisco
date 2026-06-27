const fs = require('fs');

function refactorHtmlFile(filename) {
    let content = fs.readFileSync(filename, 'utf8');
    let changed = false;

    // 1. Add tailwind-config if tailwindcss is present but config is missing
    if (content.includes('https://cdn.tailwindcss.com') && !content.includes('tailwind-config.js')) {
        content = content.replace(
            '<script src="https://cdn.tailwindcss.com"></script>',
            '<script src="https://cdn.tailwindcss.com"></script>\n  <script src="./js/tailwind-config.js"></script>'
        );
        changed = true;
    }

    // 2. Remove inline <style> and link to amp_style.css
    if (content.match(/<style[^>]*>([\s\S]*?)<\/style>/i)) {
        content = content.replace(/<style[^>]*>([\s\S]*?)<\/style>/i, '');
        changed = true;
    }

    // 3. Replace old style.css link in AMP files with amp_style.css
    if (content.includes('<link href="style.css" rel="stylesheet" type="text/css" />')) {
        content = content.replace(
            '<link href="style.css" rel="stylesheet" type="text/css" />',
            '<link href="./css/amp_style.css" rel="stylesheet" type="text/css" />'
        );
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filename, content, 'utf8');
        console.log(`Refactored ${filename}`);
    }
}

['index.html', 'C9200L-24P-4G-E.html', 'amp_index.html', 'amp_prod.html'].forEach(refactorHtmlFile);
