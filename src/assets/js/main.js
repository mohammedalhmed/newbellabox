/* ============================================
   BellaBox Theme - Main JavaScript
   ============================================ */

// Document Ready
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
});

/**
 * Initialize Theme
 */
function initializeTheme() {
  initializeMobileMenu();
  initializeWishlist();
  initializeCart();
  initializeBackToTop();
  initializeAccordion();
  initializeImageGallery();
  initializeQuantitySelector();
}

/**
 * Mobile Menu Toggle
 */
function initializeMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  if (!mobileMenuToggle) return;

  mobileMenuToggle.addEventListener('click', function() {
    mobileNav.classList.add('active');
    mobileNavOverlay.classList.add('active');
  });

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileMenu);
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close menu when clicking on a link
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  function closeMobileMenu() {
    mobileNav.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
  }
}

/**
 * Wishlist Functionality
 */
function initializeWishlist() {
  const wishlistButtons = document.querySelectorAll('.product-wishlist-btn');

  wishlistButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      toggleWishlist(this);
    });
  });
}

function toggleWishlist(button) {
  const productId = button.dataset.productId;
  
  button.classList.toggle('active');
  
  // Get wishlist from localStorage
  let wishlist = JSON.parse(localStorage.getItem('bellabox_wishlist')) || [];
  
  if (button.classList.contains('active')) {
    // Add to wishlist
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
    }
    showNotification('تمت الإضافة إلى المفضلة', 'success');
  } else {
    // Remove from wishlist
    wishlist = wishlist.filter(id => id !== productId);
    showNotification('تمت الإزالة من المفضلة', 'info');
  }
  
  localStorage.setItem('bellabox_wishlist', JSON.stringify(wishlist));
}

/**
 * Cart Functionality
 */
function initializeCart() {
  const addToCartButtons = document.querySelectorAll('.product-add-to-cart');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      addToCart(this);
    });
  });
}

function addToCart(button) {
  const productCard = button.closest('.product-card') || button.closest('.product-detail');
  const productId = button.dataset.productId;
  const productName = productCard.querySelector('.product-name')?.textContent || 'منتج';
  const productPrice = productCard.querySelector('.product-price-current')?.textContent || '0';
  const quantity = productCard.querySelector('.product-quantity-input')?.value || 1;

  button.classList.add('loading');
  button.textContent = 'جاري الإضافة...';

  // Simulate API call
  setTimeout(() => {
    button.classList.remove('loading');
    button.textContent = 'إضافة للسلة';
    showNotification(`تمت إضافة ${productName} إلى السلة`, 'success');
    updateCartCount();
  }, 500);
}

function updateCartCount() {
  const cartBadge = document.querySelector('.header-icon-badge');
  if (cartBadge) {
    const currentCount = parseInt(cartBadge.textContent) || 0;
    cartBadge.textContent = currentCount + 1;
  }
}

/**
 * Back to Top Button
 */
function initializeBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');

  if (!backToTopBtn) return;

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Accordion Functionality
 */
function initializeAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', function() {
      const isActive = item.classList.contains('active');
      
      // Close all accordion items
      accordionItems.forEach(i => i.classList.remove('active'));
      
      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * Image Gallery
 */
function initializeImageGallery() {
  const thumbnails = document.querySelectorAll('.product-gallery-thumbnail');
  const mainImage = document.querySelector('.product-gallery-main img');

  if (!thumbnails.length || !mainImage) return;

  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
      const imageSrc = this.querySelector('img').src;
      mainImage.src = imageSrc;

      // Update active state
      thumbnails.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

/**
 * Quantity Selector
 */
function initializeQuantitySelector() {
  const quantityBtns = document.querySelectorAll('.product-quantity-btn');

  quantityBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.parentElement.querySelector('.product-quantity-input');
      let value = parseInt(input.value) || 1;

      if (this.textContent.includes('+')) {
        value++;
      } else if (value > 1) {
        value--;
      }

      input.value = value;
    });
  });
}

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    animation: slideIn 0.3s ease-in-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Format Price
 */
function formatPrice(price) {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(price);
}

/**
 * Debounce Function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle Function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export functions for use in other modules
window.BellaBox = {
  toggleWishlist,
  addToCart,
  showNotification,
  formatPrice,
  debounce,
  throttle
};
