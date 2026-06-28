const fs = require('fs');

// 1. Add Mobile Responsive CSS for the legacy AMP pages
const ampCssPath = 'css/amp_style.css';
if (fs.existsSync(ampCssPath)) {
    let css = fs.readFileSync(ampCssPath, 'utf8');
    if (!css.includes('@media (max-width: 768px)')) {
        css += `
/* Responsive rules for mobile */
@media (max-width: 768px) {
    body { 
        padding: 10px; 
        overflow-x: hidden; 
    }
    div[style*="position: absolute"], 
    iframe[style*="position: absolute"], 
    div[id^="table"], 
    div[id^="text"] {
        position: static !important;
        width: 100% !important;
        max-width: 100vw !important;
        height: auto !important;
        margin-bottom: 20px;
        overflow-x: auto;
        left: 0 !important;
        top: 0 !important;
    }
    iframe {
        display: none !important; /* Hide broken legacy iframes on mobile to save space */
    }
    table {
        width: 100% !important;
        display: block;
        overflow-x: auto;
    }
}
`;
        fs.writeFileSync(ampCssPath, css, 'utf8');
        console.log('Added responsive CSS to amp_style.css');
    }
}

// 2. Add Viewport Meta to legacy pages
['amp_index.html', 'amp_prod.html'].forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes('viewport')) {
            content = content.replace('<head>', '<head>\n<meta name="viewport" content="width=device-width, initial-scale=1.0">');
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Added viewport meta to ${file}`);
        }
    }
});

// 3. Improve Tailwind responsiveness for index.html and C9200L-24P-4G-E.html
['index.html', 'C9200L-24P-4G-E.html'].forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let changed = false;

        // Make tables responsive
        if (content.match(/<table([^>]*)class="([^"]*)"/i)) {
            content = content.replace(/<table([^>]*)class="([^"]*)"/gi, (match, p1, p2) => {
                if (!p2.includes('overflow-x-auto') && !p2.includes('block')) {
                    changed = true;
                    return `<table${p1}class="${p2} block w-full overflow-x-auto whitespace-nowrap"`;
                }
                return match;
            });
        }
        
        // Also catch tables without class
        if (content.match(/<table(?![^>]*class=)([^>]*)>/i)) {
            content = content.replace(/<table(?![^>]*class=)([^>]*)>/gi, '<table class="block w-full overflow-x-auto whitespace-nowrap"$1>');
            changed = true;
        }

        // Hide left sidebar on mobile (Lista de precios) if it exists and takes too much space
        // Looking for the sidebars with 'w-full lg:w-56' or similar
        content = content.replace(/class="([^"]*w-full lg:w-\d+[^"]*)"/g, (match, p1) => {
            if (p1.includes('flex-col') && !p1.includes('hidden') && !p1.includes('lg:flex')) {
                changed = true;
                return `class="${p1} hidden lg:flex"`;
            }
            return match;
        });

        // Ensure nav scrollbar is hidden but scrollable
        content = content.replace(/class="([^"]*overflow-x-auto[^"]*)"/g, (match, p1) => {
            if (!p1.includes('scrollbar-hide')) {
                changed = true;
                return `class="${p1} scrollbar-hide"`;
            }
            return match;
        });

        if (changed) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Improved Tailwind responsiveness in ${file}`);
        }
    }
});
