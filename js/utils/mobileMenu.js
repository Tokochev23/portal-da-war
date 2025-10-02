/**
 * Mobile Menu Utility
 * Manages the mobile menu overlay and interactions
 */

export function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu');

  if (!mobileMenuBtn || !mobileMenuOverlay || !mobileMenu) {
    return; // Elements not present on this page
  }

  // Open mobile menu
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuOverlay.classList.remove('hidden');
    setTimeout(() => {
      mobileMenu.classList.remove('translate-x-full');
    }, 10);
  });

  // Close mobile menu
  const closeMobileMenu = () => {
    mobileMenu.classList.add('translate-x-full');
    setTimeout(() => {
      mobileMenuOverlay.classList.add('hidden');
    }, 300);
  };

  if (closeMobileMenuBtn) {
    closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
  }

  // Close when clicking overlay
  mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
      closeMobileMenu();
    }
  });

  // Close when clicking menu items
  const menuItems = mobileMenu.querySelectorAll('.mobile-menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', closeMobileMenu);
  });
}
