    // Tab Switching Logic
    const productTab = document.getElementById('product-tab');
    const imagesTab = document.getElementById('images-tab');
    const informationSection = document.getElementById('information-section');
    const imagesSection = document.getElementById('images-section');
    const detailsContainer = document.getElementById('details-container');

    if (productTab && imagesTab) {
      productTab.addEventListener('click', () => {
        // Activar Product Tab
        productTab.classList.remove('bg-gray-50', 'text-gray-600', 'hover:bg-gray-100');
        productTab.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
        
        // Desactivar Images Tab
        imagesTab.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
        imagesTab.classList.add('bg-gray-50', 'text-gray-600', 'hover:bg-gray-100');
        
        // Mostrar Secciones
        informationSection.classList.remove('hidden');
        detailsContainer.classList.remove('hidden');
        imagesSection.classList.add('hidden');
      });

      imagesTab.addEventListener('click', () => {
        // Activar Images Tab
        imagesTab.classList.remove('bg-gray-50', 'text-gray-600', 'hover:bg-gray-100');
        imagesTab.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
        
        // Desactivar Product Tab
        productTab.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
        productTab.classList.add('bg-gray-50', 'text-gray-600', 'hover:bg-gray-100');
        
        // Mostrar Secciones
        informationSection.classList.add('hidden');
        detailsContainer.classList.add('hidden');
        imagesSection.classList.remove('hidden');
      });
    }

    // Image Exchange Logic
    function toExchangeImage(src, element) {
      const mainImage = document.getElementById('img_main');
      if (!mainImage) return;
      
      // Fade out
      mainImage.style.opacity = '0';
      
      setTimeout(() => {
        mainImage.src = src;
        // Fade in
        mainImage.style.opacity = '1';
      }, 150);

      // Update border active state
      const siblings = element.parentElement.children;
      for (let sibling of siblings) {
        sibling.classList.remove('border-blue-500');
        sibling.classList.add('border-transparent');
      }
      element.classList.remove('border-transparent');
      element.classList.add('border-blue-500');
    }

    // Modal Logic
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    
    function viewImage(src) {
      if (!modal || !modalImg) return;
      modalImg.src = src;
      modal.classList.remove('hidden');
      // Timeout for transition
      setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalImg.classList.remove('scale-95');
        modalImg.classList.add('scale-100');
      }, 10);
    }

    function closeModal() {
      if (!modal || !modalImg) return;
      modal.classList.add('opacity-0');
      modalImg.classList.remove('scale-100');
      modalImg.classList.add('scale-95');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    }

    if (modal) {
      // Close on click outside
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
          closeModal();
        }
      });
    }
