// ============================
// DriveDeck - Wishlist Page
// ============================

;(function () {
  'use strict';

  function init() {
    const u = window.DriveDeck && window.DriveDeck.utils;
    if (!u || !window.carsData) return;

    const grid = document.getElementById('wishlist-cars-grid');
    const countEl = document.getElementById('wishlist-count-text');

    if (!grid) return;

    function formatPrice(price) {
      if (typeof price !== 'number') return '₹—';
      return '₹' + price.toLocaleString('en-IN');
    }

    function renderCarCard(car) {
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
          '<div class="dd-car-actions">' +
            '<a href="' + detailsUrl + '" class="dd-btn dd-btn-outline">View Details</a>' +
            '<button class="dd-btn dd-btn-ghost dd-btn-remove" type="button" data-car-id="' + car.id + '">Remove</button>' +
          '</div>' +
          '<div class="dd-car-compare">' +
            '<label>' +
              '<input type="checkbox" class="dd-compare-checkbox" data-car-id="' + car.id + '"' + (inCompare ? ' checked' : '') + '>' +
              ' Add to Compare' +
            '</label>' +
          '</div>' +
        '</div>' +
      '</article>'
      );
    }

    function render() {
      const ids = u.getWishlist();
      const cars = ids
        .map(function (id) { return u.getCarById(id); })
        .filter(Boolean);
      const loggedIn = u.isLoggedIn();

      if (countEl) {
        if (!loggedIn) {
          countEl.textContent = 'Please login to view and save cars to your wishlist.';
        } else {
          countEl.textContent = cars.length === 0
            ? 'You have no cars in your wishlist yet.'
            : 'You have ' + cars.length + ' car' + (cars.length === 1 ? '' : 's') + ' in your wishlist.';
        }
      }

      if (cars.length === 0) {
        if (!loggedIn) {
          grid.innerHTML = '<p class="dd-empty-wishlist">Please <a href="login.html">login</a> to save cars to your wishlist, or <a href="inventory.html">browse the inventory</a>.</p>';
        } else {
          grid.innerHTML = '<p class="dd-empty-wishlist">Browse the <a href="inventory.html">inventory</a> to add cars to your wishlist.</p>';
        }
      } else {
        grid.innerHTML = cars.map(function (car) { return renderCarCard(car); }).join('');
      }

      attachListeners();
    }

    function attachListeners() {
      grid.querySelectorAll('.dd-btn-remove').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          const id = parseInt(btn.getAttribute('data-car-id'), 10);
          const list = u.getWishlist().filter(function (x) { return x !== id; });
          u.saveWishlist(list);
          render();
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
