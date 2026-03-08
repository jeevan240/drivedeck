// ============================
// DriveDeck - Inventory Page
// ============================

;(function () {
  'use strict';

  function init() {
    const u = window.DriveDeck && window.DriveDeck.utils;
    if (!u || !window.carsData) return;

    const grid = document.getElementById('inventory-cars-grid');
    const countEl = document.getElementById('inventory-results-count');
    const searchForm = document.getElementById('inventory-search-form');
    const searchInput = document.getElementById('inventory-search-input');
    const sortSelect = document.getElementById('inventory-sort-select');
    const filtersSidebar = document.getElementById('inventory-filters');

    if (!grid) return;

    var urlQueryApplied = false;

    function formatPrice(price) {
      if (typeof price !== 'number') return '₹—';
      return '₹' + price.toLocaleString('en-IN');
    }

    function estimateOdometer(car) {
      const currentYear = new Date().getFullYear();
      const yearsOld = Math.max(0, currentYear - car.year);
      return yearsOld * 12000;
    }

    function getFilters() {
      const rawQuery = searchInput && searchInput.value ? String(searchInput.value).trim() : '';
      const filters = {
        query: rawQuery ? rawQuery.toLowerCase() : '',
        brands: [],
        priceRange: null,
        fuels: [],
        transmissions: [],
        mileageRange: null,
      };

      if (!filtersSidebar) return filters;

      const brandChecks = filtersSidebar.querySelectorAll('input[name="brand"]:checked');
      brandChecks.forEach(function (cb) {
        filters.brands.push(cb.value);
      });

      const priceRadio = filtersSidebar.querySelector('input[name="price-range"]:checked');
      if (priceRadio && priceRadio.value) filters.priceRange = priceRadio.value;

      const fuelChecks = filtersSidebar.querySelectorAll('input[name="fuel"]:checked');
      fuelChecks.forEach(function (cb) {
        filters.fuels.push(cb.value);
      });

      const transChecks = filtersSidebar.querySelectorAll('input[name="transmission"]:checked');
      transChecks.forEach(function (cb) {
        filters.transmissions.push(cb.value);
      });

      const mileageRadio = filtersSidebar.querySelector('input[name="mileage"]:checked');
      if (mileageRadio && mileageRadio.value) filters.mileageRange = mileageRadio.value;

      return filters;
    }

    function applyFilters(cars) {
      const f = getFilters();
      return cars.filter(function (car) {
        if (f.query) {
          const searchStr = (
            (car.name || '') + ' ' +
            (car.brand || '') + ' ' +
            (car.description || '')
          ).toLowerCase();
          if (!searchStr.includes(f.query)) return false;
        }
        if (f.brands.length && !f.brands.includes(car.brand)) return false;
        if (f.priceRange) {
          const parts = f.priceRange.split('-');
          const min = parseInt(parts[0], 10) || 0;
          const max = parts[1] === '+' ? Infinity : (parseInt(parts[1], 10) || Infinity);
          if (car.price < min) return false;
          if (max !== Infinity && car.price > max) return false;
        }
        if (f.fuels.length && !f.fuels.includes(car.fuel)) return false;
        if (f.transmissions.length && !f.transmissions.includes(car.transmission)) return false;
        if (f.mileageRange) {
          const odometer = estimateOdometer(car);
          const parts = f.mileageRange.split('-');
          const min = parseInt(parts[0], 10) || 0;
          const max = parts[1] === '+' ? Infinity : (parseInt(parts[1], 10) || Infinity);
          if (odometer < min) return false;
          if (max !== Infinity && odometer > max) return false;
        }
        return true;
      });
    }

    function applySort(cars, sortValue) {
      const list = cars.slice();
      switch (sortValue) {
        case 'price-asc':
          list.sort(function (a, b) { return a.price - b.price; });
          break;
        case 'price-desc':
          list.sort(function (a, b) { return b.price - a.price; });
          break;
        case 'year-desc':
          list.sort(function (a, b) { return b.year - a.year; });
          break;
        case 'mileage-asc':
          list.sort(function (a, b) { return estimateOdometer(a) - estimateOdometer(b); });
          break;
        case 'rating-desc':
          list.sort(function (a, b) { return (b.rating || 0) - (a.rating || 0); });
          break;
        default:
          break;
      }
      return list;
    }

    function renderCarCard(car, options) {
      options = options || {};
      const inWishlist = u.isInWishlist(car.id);
      const inCompare = u.isInCompareList(car.id);
      const detailsUrl = 'car-details.html?id=' + car.id;

      const imgHtml = car.image
        ? '<img src="' + car.image + '" alt="' + (car.name || '') + '">'
        : '';

      return (
        '<article class="dd-car-card" data-car-id="' + car.id + '">' +
          '<a href="' + detailsUrl + '" class="dd-car-image-link">' +
            '<div class="dd-car-image-placeholder">' + imgHtml + '</div>' +
          '</a>' +
          '<div class="dd-car-content">' +
            '<h3 class="dd-car-title"><a href="' + detailsUrl + '">' + (car.name || '') + '</a></h3>' +
            '<p class="dd-car-price">' + formatPrice(car.price) + '</p>' +
            '<p class="dd-car-meta">' +
              '<span class="dd-car-year">' + car.year + '</span> • ' +
              '<span class="dd-car-mileage">' + (car.mileage || '—') + '</span> • ' +
              '<span class="dd-car-fuel">' + (car.fuel || '—') + '</span>' +
            '</p>' +
            '<div class="dd-car-meta-secondary">' +
              '<span class="dd-car-transmission">' + (car.transmission || '—') + '</span>' +
              '<span class="dd-car-rating">' + (car.rating || '—') + ' ★</span>' +
            '</div>' +
            '<div class="dd-car-actions">' +
              '<a href="' + detailsUrl + '" class="dd-btn dd-btn-outline">View Details</a>' +
              '<button class="dd-btn dd-btn-ghost dd-btn-wishlist" type="button" data-car-id="' + car.id + '">' +
                (inWishlist ? 'In Wishlist' : 'Add to Wishlist') +
              '</button>' +
            '</div>' +
            (options.showCompare !== false ? (
              '<div class="dd-car-compare">' +
                '<label>' +
                  '<input type="checkbox" class="dd-compare-checkbox" data-car-id="' + car.id + '"' + (inCompare ? ' checked' : '') + '>' +
                  ' Add to Compare' +
                '</label>' +
              '</div>'
            ) : '') +
          '</div>' +
        '</article>'
      );
    }

    function render(cars) {
      const sortValue = sortSelect ? sortSelect.value : 'recommended';
      const sorted = applySort(cars, sortValue);
      const hasSearchQuery = getFilters().query.length > 0;

      if (countEl) {
        if (sorted.length === 0) {
          countEl.textContent = hasSearchQuery ? 'No cars match your search.' : 'No cars match your filters.';
        } else {
          countEl.textContent = 'Showing ' + sorted.length + ' car' + (sorted.length === 1 ? '' : 's');
        }
      }

      if (sorted.length === 0) {
        grid.innerHTML = '<p class="dd-no-results">' +
          (hasSearchQuery ? 'No cars match your search. Try different keywords or <a href="inventory.html">clear search</a>.' : 'Try adjusting your filters or search terms.') +
          '</p>';
      } else {
        grid.innerHTML = sorted.map(function (car) { return renderCarCard(car); }).join('');
      }

      attachCardListeners();
    }

    function attachCardListeners() {
      grid.querySelectorAll('.dd-btn-wishlist').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          if (!u.isLoggedIn()) {
            u.showLoginRequiredModal();
            return;
          }
          const id = parseInt(btn.getAttribute('data-car-id'), 10);
          const list = u.getWishlist();
          const idx = list.indexOf(id);
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

      grid.querySelectorAll('.dd-compare-checkbox').forEach(function (cb) {
        cb.addEventListener('change', function () {
          if (!u.isLoggedIn()) {
            cb.checked = false;
            u.showLoginRequiredModal();
            return;
          }
          const id = parseInt(cb.getAttribute('data-car-id'), 10);
          let list = u.getCompareList();
          if (cb.checked) {
            if (!list.includes(id)) {
              list.push(id);
              list = list.slice(0, u.compareLimit);
              u.saveCompareList(list);
              u.showToast('Added to compare');
            }
          } else {
            list = list.filter(function (x) { return x !== id; });
            u.saveCompareList(list);
          }
        });
      });
    }

    function run() {
      let cars = u.getAllCars();

      const brandParam = u.getQueryParam('brand');
      if (brandParam) {
        cars = cars.filter(function (c) { return c.brand === brandParam; });
        if (searchInput) searchInput.placeholder = 'Search in ' + brandParam + '...';
        if (filtersSidebar) {
          filtersSidebar.querySelectorAll('input[name="brand"]').forEach(function (cb) {
            cb.checked = cb.value === brandParam;
          });
        }
      }

      if (!urlQueryApplied && searchInput) {
        const queryParam = u.getQueryParam('query');
        if (queryParam != null) searchInput.value = String(queryParam).trim();
        urlQueryApplied = true;
      }

      const budgetParam = u.getQueryParam('budget');
      if (budgetParam) {
        const maxPrice = parseInt(budgetParam, 10) * 100; /* 10000=₹10L, 20000=₹20L, 30000=₹30L */
        if (maxPrice > 0) cars = cars.filter(function (c) { return c.price <= maxPrice; });
      }

      const fuelParam = u.getQueryParam('fuel');
      if (fuelParam) {
        cars = cars.filter(function (c) { return c.fuel === fuelParam; });
      }

      const filtered = applyFilters(cars);
      render(filtered);
    }

    function updateUrlFromSearch() {
      const q = getFilters().query;
      const url = new URL(window.location.href);
      if (q) {
        url.searchParams.set('query', q);
      } else {
        url.searchParams.delete('query');
      }
      const newSearch = url.searchParams.toString();
      const newUrl = url.pathname + (newSearch ? '?' + newSearch : '');
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, '', newUrl);
      }
    }

    if (searchForm) {
      searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        run();
        updateUrlFromSearch();
      });
    }

    if (searchInput) {
      var searchDebounce;
      searchInput.addEventListener('input', function () {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(function () {
          run();
          updateUrlFromSearch();
        }, 300);
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', run);
    }

    if (filtersSidebar) {
      filtersSidebar.addEventListener('change', run);
    }

    run();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
