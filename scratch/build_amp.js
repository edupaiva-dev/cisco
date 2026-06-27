const fs = require('fs');

const ampFile = fs.readFileSync('amp_index.html', 'utf8');
const indexFile = fs.readFileSync('index.html', 'utf8');

// Use regex to find products. A product starts with a TD containing an IMG, followed by TD for model, followed by TD for description.
// It's a bit hard to parse purely by regex. We can use jsdom, but standard regex might work if we are loose.
const products = [];
const imgRegex = /<a href="([^"]+)"[^>]*><IMG[^>]*src="([^"]+)"[^>]*><\/a>/g;
// Actually, let's just use some simple string matching to get up to 10 products so it looks good.
let match;
while ((match = imgRegex.exec(ampFile)) !== null && products.length < 12) {
    const link = match[1];
    const imgSrc = match[2];
    
    // The model text is usually the basename of the link or we can find it nearby.
    const modelMatch = link.match(/\/([^\/]+)\.html$/);
    const model = modelMatch ? modelMatch[1] : 'Producto AMP';
    
    // Find the next <div> after this img tag for the description, or we can just mock a nice description.
    products.push({
        link,
        imgSrc,
        model,
        desc: `Cable UTP Cat 5E/6 - Modelo ${model}`
    });
}

// Generate Grid HTML
let gridHtml = '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">\n';

products.forEach(p => {
    // Determine the internal link. If it's a known one like 6-1427200-4, use it. Otherwise, point to the live link or '#'.
    let localLink = p.link.includes('6-1427200-4') ? './6-1427200-4.html' : p.link;
    gridHtml += `
          <a href="${localLink}"
            class="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 hover:border-blue-500">
            <div class="p-5 flex flex-col h-full">
              <div class="flex-grow flex items-center justify-center mb-4 h-40">
                <img src="${p.imgSrc}" alt="${p.model}" class="max-h-full object-contain group-hover:scale-105 transition-transform duration-300">
              </div>
              <div class="text-center">
                <h3 class="text-lg font-bold text-gray-800 mb-2">${p.model}</h3>
                <p class="text-sm text-gray-500 mb-4 line-clamp-2">${p.desc}</p>
                <div class="inline-flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-800">
                  Ver Detalles
                  <i class="fa-solid fa-arrow-right ml-2 text-xs transition-transform group-hover:translate-x-1"></i>
                </div>
              </div>
            </div>
          </a>
    `;
});

gridHtml += '</div>';

// Extract the header/sidebar/footer from index.html
const mainStart = indexFile.indexOf('<div class="flex-1 p-4 lg:p-8">');
const mainHeaderEnd = indexFile.indexOf('<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">', mainStart);
const gridEnd = indexFile.indexOf('</main>', mainHeaderEnd); // Actually the grid closes before </main>

const beforeGrid = indexFile.substring(0, mainHeaderEnd);
const afterGrid = indexFile.substring(indexFile.indexOf('</div>\n      </main>'), indexFile.length);

// Modify breadcrumbs and title in beforeGrid
let newBeforeGrid = beforeGrid.replace('<li>Cisco</li>', '<li>AMP</li>');
newBeforeGrid = newBeforeGrid.replace('<span class="text-gray-800 font-medium">Catalyst 9200</span>', '<span class="text-gray-800 font-medium">Catálogo AMP</span>');
newBeforeGrid = newBeforeGrid.replace('<h2 class="text-2xl font-bold text-gray-800">Switches de la Serie Catalyst 9200</h2>', '<h2 class="text-2xl font-bold text-gray-800">Catálogo de Productos AMP</h2>');
newBeforeGrid = newBeforeGrid.replace('<p class="text-gray-600 mt-2">Switches empresariales seguros y fiables.</p>', '<p class="text-gray-600 mt-2">Cables UTP y soluciones de red AMP.</p>');

const newAmpIndex = newBeforeGrid + gridHtml + '\n' + afterGrid;

fs.writeFileSync('amp_index.html', newAmpIndex, 'utf8');
console.log('Successfully rebuilt amp_index.html with ' + products.length + ' products');
