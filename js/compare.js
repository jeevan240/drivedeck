// ============================
// DriveDeck - Compare Page
// ============================

;(function () {
  'use strict';

  function init() {
    const u = window.DriveDeck && window.DriveDeck.utils;
    if (!u || !window.carsData) return;

    const summaryEl = document.getElementById('compare-summary-text');
    const tableWrapper = document.querySelector('.dd-compare-table-wrapper');
    const table = document.getElementById('compare-table');

    if (!table) return;

    function formatPrice(price) {
      if (typeof price !== 'number') return '₹—';
      return '₹' + price.toLocaleString('en-IN');
    }

    function setCellContent(id, content) {
      const el = document.getElementById(id);
      if (el) el.textContent = content;
    }

    function setCellHtml(id, html) {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    }

    function renderCar(slot, car) {
      if (!car) return;

      const prefix = 'compare-car-' + slot + '-';
      setCellContent(prefix + 'title', car.name);
      setCellContent(prefix + 'meta', car.brand + ' • ' + car.year + ' • ' + car.fuel);
      setCellContent(prefix + 'price', formatPrice(car.price));
      setCellContent(prefix + 'year', String(car.year));
      setCellContent(prefix + 'mileage', car.mileage || '—');
      setCellContent(prefix + 'fuel', car.fuel || '—');
      setCellContent(prefix + 'transmission', car.transmission || '—');
      setCellContent(prefix + 'engine', car.engine || '—');
      setCellContent(prefix + 'power', car.power || '—');
      setCellContent(prefix + 'torque', car.torque || '—');
      setCellContent(prefix + 'drivetrain', car.drivetrain || '—');
      setCellContent(prefix + 'color', car.color || '—');
      setCellContent(prefix + 'registeredCity', car.registeredCity || '—');
      setCellContent(prefix + 'rating', (car.rating || '—') + ' ★');
      setCellContent(prefix + 'description', (car.description || '').substring(0, 120) + (car.description && car.description.length > 120 ? '…' : ''));

      const imgHtml = car.image
        ? '<img src="' + car.image + '" alt="' + (car.name || '') + '">'
        : '';
      setCellHtml(prefix + 'image', imgHtml);
    }

    function renderEmptySlot(slot) {
      const prefix = 'compare-car-' + slot + '-';
      const empty = '—';
      setCellContent(prefix + 'title', 'Car ' + slot);
      setCellContent(prefix + 'meta', 'Add from inventory or wishlist');
      setCellContent(prefix + 'price', empty);
      setCellContent(prefix + 'year', empty);
      setCellContent(prefix + 'mileage', empty);
      setCellContent(prefix + 'fuel', empty);
      setCellContent(prefix + 'transmission', empty);
      setCellContent(prefix + 'engine', empty);
      setCellContent(prefix + 'power', empty);
      setCellContent(prefix + 'torque', empty);
      setCellContent(prefix + 'drivetrain', empty);
      setCellContent(prefix + 'color', empty);
      setCellContent(prefix + 'registeredCity', empty);
      setCellContent(prefix + 'rating', empty);
      setCellContent(prefix + 'description', '');
      setCellHtml(prefix + 'image', '');
    }

    function render() {
      const ids = u.getCompareList();
      const cars = ids.map(function (id) { return u.getCarById(id); }).filter(Boolean);

      if (cars.length === 0) {
        if (summaryEl) {
          if (u.isLoggedIn()) {
            summaryEl.textContent = 'Select cars from the inventory or wishlist to begin comparison.';
          } else {
            summaryEl.innerHTML = 'Please <a href="login.html">login</a> to compare cars.';
          }
        }
        if (tableWrapper) tableWrapper.style.display = 'none';
        renderEmptySlot(1);
        renderEmptySlot(2);
        renderEmptySlot(3);
        return;
      }

      if (tableWrapper) tableWrapper.style.display = 'block';
      if (summaryEl) summaryEl.textContent = 'Comparing ' + cars.length + ' car' + (cars.length === 1 ? '' : 's') + '.';

      renderCar(1, cars[0]);
      renderCar(2, cars[1]);
      renderCar(3, cars[2]);

      for (var s = cars.length + 1; s <= 3; s++) {
        renderEmptySlot(s);
      }
    }

    function run() {
      render();
    }

    run();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
