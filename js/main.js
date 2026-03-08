// ============================
// DriveDeck - Core Utilities
// ============================

;(function () {
  'use strict';

  // ----------------------------
  // Constants & Config
  // ----------------------------

  const STORAGE_KEYS = {
    wishlist: 'driveDeck_wishlist',
    compare: 'driveDeck_compare',
    session: 'driveDeck_user_session',
  };

  const COMPARE_LIMIT = 3;

  // ----------------------------
  // DOM Helpers
  // ----------------------------

  /**
   * Select a single element.
   */
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  /**
   * Select multiple elements as an array.
   */
  function $all(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  // ----------------------------
  // Navigation / Header
  // ----------------------------

  /**
   * Setup mobile navigation toggle behavior.
   * Toggles a class on the body to control nav visibility.
   */
  function initNavigation() {
    const toggleButton = $('.dd-nav-toggle');
    const header = $('.dd-header');

    if (!toggleButton || !header) return;

    toggleButton.addEventListener('click', function () {
      document.body.classList.toggle('dd-nav-open');
    });

    // Close mobile nav when clicking a nav link (on small screens)
    $all('.dd-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        document.body.classList.remove('dd-nav-open');
      });
    });
  }

  /**
   * Update nav to show Login/Create Account or user name + Logout based on session.
   */
  function initAuthNav() {
    var guestEls = $all('.dd-nav-auth-guest');
    var userEls = $all('.dd-nav-auth-user');
    var userNameEl = $('.dd-nav-user-name');
    var logoutBtn = $('.dd-btn-logout');

    var session = null;
    if (window.DriveDeckAuth && typeof window.DriveDeckAuth.getSession === 'function') {
      session = window.DriveDeckAuth.getSession();
    }

    if (session && session.email) {
      guestEls.forEach(function (el) { el.style.display = 'none'; });
      userEls.forEach(function (el) { el.style.display = ''; });
      if (userNameEl) userNameEl.textContent = session.name || session.email;
      if (logoutBtn) {
        logoutBtn.onclick = function (e) {
          e.preventDefault();
          if (window.DriveDeckAuth && typeof window.DriveDeckAuth.clearSession === 'function') {
            window.DriveDeckAuth.clearSession();
          }
          window.location.href = 'index.html';
        };
      }
    } else {
      guestEls.forEach(function (el) { el.style.display = ''; });
      userEls.forEach(function (el) { el.style.display = 'none'; });
    }
  }

  // ----------------------------
  // Car Data Helpers
  // ----------------------------

  /**
   * Return a car object by numeric id using the global carsData.
   */
  function getCarById(id) {
    if (!Array.isArray(window.carsData)) return null;
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (!Number.isFinite(numericId)) return null;
    return window.carsData.find(function (car) {
      return car.id === numericId;
    }) || null;
  }

  /**
   * Return a shallow copy of all cars.
   */
  function getAllCars() {
    if (!Array.isArray(window.carsData)) return [];
    return window.carsData.slice();
  }

  /**
   * Format price for display (INR).
   */
  function formatPrice(price) {
    if (typeof price !== 'number') return '₹—';
    return '₹' + price.toLocaleString('en-IN');
  }

  // ----------------------------
  // LocalStorage Helpers
  // ----------------------------

  /**
   * Safely read JSON data from localStorage.
   */
  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return Array.isArray(fallback) && !Array.isArray(parsed) ? fallback : parsed;
    } catch (err) {
      return fallback;
    }
  }

  /**
   * Safely write JSON data to localStorage.
   */
  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * True if user has a valid session (logged in).
   */
  function isLoggedIn() {
    if (!window.DriveDeckAuth || typeof window.DriveDeckAuth.getSession !== 'function') return false;
    var session = window.DriveDeckAuth.getSession();
    return !!(session && session.email);
  }

  /**
   * Get storage key for wishlist (user-scoped when logged in).
   */
  function getWishlistKey() {
    if (!isLoggedIn()) return null;
    var session = window.DriveDeckAuth.getSession();
    var email = (session && session.email) ? String(session.email).replace(/[^a-z0-9@._-]/gi, '') : '';
    return email ? STORAGE_KEYS.wishlist + '_' + email : STORAGE_KEYS.wishlist;
  }

  /**
   * Get storage key for compare (user-scoped when logged in).
   */
  function getCompareKey() {
    if (!isLoggedIn()) return null;
    var session = window.DriveDeckAuth.getSession();
    var email = (session && session.email) ? String(session.email).replace(/[^a-z0-9@._-]/gi, '') : '';
    return email ? STORAGE_KEYS.compare + '_' + email : STORAGE_KEYS.compare;
  }

  /**
   * Get wishlist as an array of car ids (numbers). Returns [] when not logged in.
   */
  function getWishlist() {
    var key = getWishlistKey();
    if (!key) return [];
    var raw = readStorage(key, []);
    return raw.map(function (id) { return parseInt(id, 10); }).filter(function (n) { return Number.isFinite(n); });
  }

  /**
   * Save wishlist array of car ids. No-op when not logged in.
   */
  function saveWishlist(list) {
    if (!Array.isArray(list)) return;
    var key = getWishlistKey();
    if (!key) return;
    writeStorage(key, list);
  }

  /**
   * Get compare list as an array of car ids (numbers). Returns [] when not logged in.
   */
  function getCompareList() {
    var key = getCompareKey();
    if (!key) return [];
    var raw = readStorage(key, []);
    return raw.map(function (id) { return parseInt(id, 10); }).filter(function (n) { return Number.isFinite(n); });
  }

  /**
   * Save compare list array of car ids. No-op when not logged in. Enforces the global compare limit.
   */
  function saveCompareList(list) {
    if (!Array.isArray(list)) return;
    var key = getCompareKey();
    if (!key) return;
    var uniqueIds = Array.from(new Set(list));
    var limited = uniqueIds.slice(0, COMPARE_LIMIT);
    writeStorage(key, limited);
  }

  /**
   * Show modal asking user to log in. Does not silently fail.
   */
  function showLoginRequiredModal() {
    var overlay = document.getElementById('dd-login-required-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
      return;
    }
    overlay = document.createElement('div');
    overlay.id = 'dd-login-required-overlay';
    overlay.className = 'dd-login-required-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-labelledby', 'dd-login-required-title');
    overlay.innerHTML =
      '<div class="dd-login-required-modal">' +
        '<h2 id="dd-login-required-title" style="margin:0 0 0.75rem; font-size:1.25rem;">Login required</h2>' +
        '<p>Please login to use this feature.</p>' +
        '<div>' +
          '<a href="login.html" class="dd-btn dd-btn-primary">Login</a>' +
          '<button type="button" class="dd-btn dd-btn-ghost dd-login-required-close">Cancel</button>' +
        '</div>' +
      '</div>';
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.style.display = 'none';
      }
    });
    var closeBtn = overlay.querySelector('.dd-login-required-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        overlay.style.display = 'none';
      });
    }
    document.body.appendChild(overlay);
  }

  /**
   * Show a short-lived toast message.
   */
  function showToast(message) {
    var existing = document.getElementById('dd-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'dd-toast';
    toast.className = 'dd-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2500);
  }

  /**
   * Helper to check if a car id exists in wishlist.
   */
  function isInWishlist(id) {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    return getWishlist().includes(numericId);
  }

  /**
   * Helper to check if a car id exists in compare list.
   */
  function isInCompareList(id) {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    return getCompareList().includes(numericId);
  }

  // ----------------------------
  // URL / Routing Helpers
  // ----------------------------

  /**
   * Get query parameter value from current URL.
   */
  function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    const value = params.get(param);
    return value === null ? null : value;
  }

  /**
   * Detect current page type based on body attribute or path.
   */
  function detectPageType() {
    const bodyPage = document.body.getAttribute('data-page');
    if (bodyPage) return bodyPage;

    const path = window.location.pathname;
    if (path.endsWith('inventory.html')) return 'inventory';
    if (path.endsWith('wishlist.html')) return 'wishlist';
    if (path.endsWith('compare.html')) return 'compare';
    if (path.endsWith('car-details.html')) return 'car-details';
    if (path.endsWith('brands.html')) return 'brands';
    if (path.endsWith('about.html')) return 'about';
    if (path.endsWith('contact.html')) return 'contact';
    return 'home';
  }

  // ----------------------------
  // Page Initialization
  // ----------------------------

  /**
   * Global initialization that runs on every page.
   * Sets up navigation and exposes shared utilities.
   */
  function initGlobal() {
    initNavigation();
    initAuthNav();

    var yearEl = document.getElementById('dd-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Expose helpers for page-specific scripts to use.
    window.DriveDeck = window.DriveDeck || {};
    window.DriveDeck.utils = {
      getCarById: getCarById,
      getAllCars: getAllCars,
      formatPrice: formatPrice,
      getWishlist: getWishlist,
      saveWishlist: saveWishlist,
      getCompareList: getCompareList,
      saveCompareList: saveCompareList,
      isInWishlist: isInWishlist,
      isInCompareList: isInCompareList,
      getQueryParam: getQueryParam,
      detectPageType: detectPageType,
      storageKeys: STORAGE_KEYS,
      compareLimit: COMPARE_LIMIT,
      isLoggedIn: isLoggedIn,
      showLoginRequiredModal: showLoginRequiredModal,
      showToast: showToast,
    };

    window.DriveDeck.currentPage = detectPageType();

    if (window.DriveDeck.currentPage === 'car-details') initCarDetails();
    else if (window.DriveDeck.currentPage === 'home') initHomePage();
    else if (window.DriveDeck.currentPage === 'brands') initBrandsPage();
    else if (window.DriveDeck.currentPage === 'contact') initContactPage();
  }

  function initCarDetails() {
    const u = window.DriveDeck.utils;
    const idParam = u.getQueryParam('id');
    const car = idParam ? u.getCarById(idParam) : null;

    if (!car) {
      var titleEl = document.getElementById('car-title');
      var mainSection = document.querySelector('.dd-car-details-main');
      var specsSection = document.querySelector('.dd-car-specifications');
      var featuresSection = document.querySelector('.dd-car-features');
      var descSection = document.querySelector('.dd-car-description');
      if (titleEl) titleEl.textContent = 'Car not found';
      if (titleEl && titleEl.nextElementSibling) titleEl.nextElementSibling.textContent = 'Please check the URL or return to the inventory.';
      if (mainSection) mainSection.style.display = 'none';
      if (specsSection) specsSection.style.display = 'none';
      if (featuresSection) featuresSection.style.display = 'none';
      if (descSection) descSection.style.display = 'none';
      return;
    }

    document.title = 'DriveDeck | ' + car.name;
    document.getElementById('car-title').textContent = car.name;
    document.getElementById('car-subtitle').textContent = car.brand + ' • ' + car.year + ' • ' + car.fuel + ' • ' + car.transmission;
    document.getElementById('car-price').textContent = u.formatPrice(car.price);
    document.getElementById('car-year').textContent = String(car.year);
    document.getElementById('car-mileage').textContent = car.mileage || '—';
    document.getElementById('car-fuel').textContent = car.fuel || '—';
    document.getElementById('car-transmission').textContent = car.transmission || '—';
    document.getElementById('car-rating').textContent = String(car.rating || '—');
    document.getElementById('car-engine').textContent = car.engine || '—';
    document.getElementById('car-description').textContent = car.description || '';

    const mainImg = document.getElementById('car-main-image');
    if (mainImg && car.image) mainImg.src = car.image;

    const btnWishlist = document.getElementById('btn-add-wishlist');
    const btnCompare = document.getElementById('btn-add-compare');

    if (btnWishlist) {
      btnWishlist.textContent = u.isInWishlist(car.id) ? 'In Wishlist' : 'Add to Wishlist';
      btnWishlist.addEventListener('click', function () {
        if (!u.isLoggedIn()) {
          u.showLoginRequiredModal();
          return;
        }
        const list = u.getWishlist();
        const idx = list.indexOf(car.id);
        if (idx >= 0) {
          list.splice(idx, 1);
          btnWishlist.textContent = 'Add to Wishlist';
        } else {
          if (!list.includes(car.id)) list.push(car.id);
          btnWishlist.textContent = 'In Wishlist';
          u.showToast('Added to wishlist');
        }
        u.saveWishlist(list);
      });
    }

    if (btnCompare) {
      btnCompare.addEventListener('click', function () {
        if (!u.isLoggedIn()) {
          u.showLoginRequiredModal();
          return;
        }
        let list = u.getCompareList();
        if (!list.includes(car.id)) {
          list.push(car.id);
          list = list.slice(0, u.compareLimit);
          u.saveCompareList(list);
          u.showToast('Added to compare');
        }
        window.location.href = 'compare.html';
      });
    }

    var powerEl = document.getElementById('car-power');
    var torqueEl = document.getElementById('car-torque');
    var drivetrainEl = document.getElementById('car-drivetrain');
    var seatsEl = document.getElementById('car-seats');
    var colorEl = document.getElementById('car-color');
    var cityEl = document.getElementById('car-city');
    if (powerEl) powerEl.textContent = '—';
    if (torqueEl) torqueEl.textContent = '—';
    if (drivetrainEl) drivetrainEl.textContent = '—';
    if (seatsEl) seatsEl.textContent = '5';
    if (colorEl) colorEl.textContent = '—';
    if (cityEl) cityEl.textContent = '—';

    var keyFeatures = document.getElementById('car-key-features');
    var safetyFeatures = document.getElementById('car-safety-features');
    if (keyFeatures) keyFeatures.innerHTML = '<li>Touchscreen infotainment</li><li>Climate control</li><li>Parking camera</li>';
    if (safetyFeatures) safetyFeatures.innerHTML = '<li>ABS with EBD</li><li>Airbags</li><li>Safety features</li>';

    var thumbs = document.getElementById('car-gallery-thumbs');
    if (thumbs && car.image) {
      thumbs.innerHTML = '<button type="button" class="dd-thumb is-active"><img src="' + car.image + '" alt="Car"></button>';
    }
  }

  function initHomePage() {
    const u = window.DriveDeck.utils;
    const featuredGrid = document.getElementById('featured-cars-grid');
    const homeForm = document.getElementById('home-search-form');

    if (featuredGrid && window.carsData && window.carsData.length) {
      var cars = u.getAllCars().slice(0, 6);
      featuredGrid.innerHTML = cars.map(function (car) {
        var inWishlist = u.isInWishlist(car.id);
        var imgHtml = car.image ? '<img src="' + car.image + '" alt="' + car.name + '">' : '';
        return (
          '<article class="dd-car-card" data-car-id="' + car.id + '">' +
            '<a href="car-details.html?id=' + car.id + '">' +
              '<div class="dd-car-image-placeholder">' + imgHtml + '</div>' +
            '</a>' +
            '<div class="dd-car-content">' +
              '<h3 class="dd-car-title"><a href="car-details.html?id=' + car.id + '">' + car.name + '</a></h3>' +
              '<p class="dd-car-price">' + u.formatPrice(car.price) + '</p>' +
              '<p class="dd-car-meta">' + car.year + ' • ' + (car.mileage || '—') + ' • ' + (car.fuel || '—') + '</p>' +
              '<div class="dd-car-actions">' +
                '<a href="car-details.html?id=' + car.id + '" class="dd-btn dd-btn-outline">View Details</a>' +
                '<button class="dd-btn dd-btn-ghost dd-btn-wishlist" type="button" data-car-id="' + car.id + '">' +
                  (inWishlist ? 'In Wishlist' : 'Add to Wishlist') +
                '</button>' +
              '</div>' +
            '</div>' +
          '</article>'
        );
      }).join('');

      featuredGrid.querySelectorAll('.dd-btn-wishlist').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          if (!u.isLoggedIn()) {
            u.showLoginRequiredModal();
            return;
          }
          var id = parseInt(btn.getAttribute('data-car-id'), 10);
          var list = u.getWishlist();
          var idx = list.indexOf(id);
          if (idx >= 0) {
            list.splice(idx, 1);
            btn.textContent = 'Add to Wishlist';
          } else {
            if (!list.includes(id)) list.push(id);
            btn.textContent = 'In Wishlist';
            u.showToast('Added to wishlist');
          }
          u.saveWishlist(list);
        });
      });
    }

    if (homeForm) {
      homeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var queryEl = document.getElementById('home-search-input');
        var query = (queryEl && queryEl.value) ? String(queryEl.value).trim() : '';
        var budgetEl = document.getElementById('home-search-budget');
        var budget = (budgetEl && budgetEl.value) ? budgetEl.value : '';
        var fuelEl = document.getElementById('home-search-fuel');
        var fuel = (fuelEl && fuelEl.value) ? fuelEl.value : '';
        var params = new URLSearchParams();
        if (query) params.set('query', query);
        if (budget) params.set('budget', budget);
        if (fuel) params.set('fuel', fuel);
        window.location.href = 'inventory.html' + (params.toString() ? '?' + params.toString() : '');
      });
    }
  }

  function initBrandsPage() {
    document.querySelectorAll('.dd-brand-card[data-brand]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var brand = btn.getAttribute('data-brand');
        window.location.href = 'inventory.html?brand=' + encodeURIComponent(brand);
      });
    });
  }

  function initContactPage() {
    var form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon. (This is a demo — no data is sent.)');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobal);
  } else {
    initGlobal();
  }
})();

