# DriveDeck — Complete Image Asset List

This document lists every image required for the DriveDeck website.

---

## 1. Car Images (30 cars)

All car images are stored in `images/cars/` and used on Home, Inventory, Car Details, Wishlist, and Compare pages.

| File Path | Type | Recommended Size | Format |
|-----------|------|------------------|--------|
| images/cars/tata-nexon.jpg | Car image | 800×600 | JPG |
| images/cars/tata-nexon-ev.jpg | Car image | 800×600 | JPG |
| images/cars/tata-harrier.jpg | Car image | 800×600 | JPG |
| images/cars/tata-altroz.jpg | Car image | 800×600 | JPG |
| images/cars/hyundai-creta.jpg | Car image | 800×600 | JPG |
| images/cars/hyundai-venue.jpg | Car image | 800×600 | JPG |
| images/cars/hyundai-i20.jpg | Car image | 800×600 | JPG |
| images/cars/hyundai-verna.jpg | Car image | 800×600 | JPG |
| images/cars/toyota-fortuner.jpg | Car image | 800×600 | JPG |
| images/cars/toyota-innova-crysta.jpg | Car image | 800×600 | JPG |
| images/cars/toyota-glanza.jpg | Car image | 800×600 | JPG |
| images/cars/toyota-urban-cruiser-hyryder.jpg | Car image | 800×600 | JPG |
| images/cars/honda-city.jpg | Car image | 800×600 | JPG |
| images/cars/honda-amaze.jpg | Car image | 800×600 | JPG |
| images/cars/honda-wrv.jpg | Car image | 800×600 | JPG |
| images/cars/mahindra-xuv700.jpg | Car image | 800×600 | JPG |
| images/cars/mahindra-scorpio-n.jpg | Car image | 800×600 | JPG |
| images/cars/mahindra-thar.jpg | Car image | 800×600 | JPG |
| images/cars/mahindra-bolero-neo.jpg | Car image | 800×600 | JPG |
| images/cars/kia-seltos.jpg | Car image | 800×600 | JPG |
| images/cars/kia-sonet.jpg | Car image | 800×600 | JPG |
| images/cars/kia-carens.jpg | Car image | 800×600 | JPG |
| images/cars/bmw-x1.jpg | Car image | 800×600 | JPG |
| images/cars/bmw-x3.jpg | Car image | 800×600 | JPG |
| images/cars/bmw-3-series.jpg | Car image | 800×600 | JPG |
| images/cars/bmw-x5.jpg | Car image | 800×600 | JPG |
| images/cars/mercedes-gla.jpg | Car image | 800×600 | JPG |
| images/cars/mercedes-glc.jpg | Car image | 800×600 | JPG |
| images/cars/mercedes-c-class.jpg | Car image | 800×600 | JPG |
| images/cars/mercedes-e-class.jpg | Car image | 800×600 | JPG |

---

## 2. Brand Logos (8 brands)

Brand logos are used on the Brands page (`brands.html`) and optionally on the Home page brand preview.

| File Path | Type | Recommended Size | Format |
|-----------|------|------------------|--------|
| images/brands/tata.png | Brand logo | 200×200 | PNG |
| images/brands/hyundai.png | Brand logo | 200×200 | PNG |
| images/brands/toyota.png | Brand logo | 200×200 | PNG |
| images/brands/honda.png | Brand logo | 200×200 | PNG |
| images/brands/mahindra.png | Brand logo | 200×200 | PNG |
| images/brands/kia.png | Brand logo | 200×200 | PNG |
| images/brands/bmw.png | Brand logo | 200×200 | PNG |
| images/brands/mercedes.png | Brand logo | 200×200 | PNG |

---

## 3. Hero / Banner

| File Path | Type | Recommended Size | Format |
|-----------|------|------------------|--------|
| images/hero-placeholder.jpg | Hero background | 1920×1080 | JPG |

Used as the hero section background on the Home page (`index.html`). Referenced in `css/style.css`.

---

## 4. Car Details Page Placeholders (optional)

The car-details page uses the car's main image from `cars-data.js`. These sample placeholders are only used when no car is found or as fallback thumbnails in the static HTML (replaced dynamically by JS):

| File Path | Type | Recommended Size | Format |
|-----------|------|------------------|--------|
| images/cars/sample-car.jpg | Car placeholder | 800×600 | JPG |
| images/cars/sample-car-2.jpg | Car thumbnail | 400×300 | JPG |
| images/cars/sample-car-3.jpg | Car thumbnail | 400×300 | JPG |

*Note: These are overwritten by JavaScript when a valid car is loaded. You may use a generic placeholder or omit them if all 30 car images exist.*

---

## 5. UI / Icons

The site uses CSS gradients and system fonts for team avatars, map placeholder, and icons. No additional image assets are required for:

- Team avatars (About page) — CSS gradient
- Map container (Contact page) — CSS pattern
- Navigation icons — HTML/CSS only

---

## Summary Count

| Category | Count |
|----------|-------|
| Car images | 30 |
| Brand logos | 8 |
| Hero background | 1 |
| Car details placeholders | 3 (optional) |
| **Total required** | **39** |
| **Total with placeholders** | **42** |

---

## Recommended Directory Structure

```
driveDeck/
├── images/
│   ├── cars/           (30 car images)
│   ├── brands/         (8 brand logos)
│   └── hero-placeholder.jpg
```
