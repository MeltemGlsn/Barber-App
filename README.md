# Sharp Mobile Barber

A fast, SEO-focused one-page website for a mobile barber service in Portsmouth, UK.
Built as a static site with no backend: bookings are handled through a pre-filled WhatsApp message.

## Features

- **Local SEO**: keyword-led title and H1, `HairSalon` structured data with services, prices, service areas and opening hours, FAQ schema, NAP block and Open Graph cards
- **Serverless booking**: validated form that composes a WhatsApp message (service, date, time slot, postcode)
- **Signature interactions**:
  - Intro animation where scissors cut the screen open (once per session)
  - Scissors cursor over interactive elements
  - Hair clippings that scatter on click (mouse, touch and keyboard)
  - Scissors sweep on in-page navigation and animated dividers under section headings
- **Gallery lightbox** built on the native `<dialog>` element with keyboard navigation
- **Accessible**: semantic landmarks, skip link, visible focus states, ARIA on interactive controls and a calm alternative for `prefers-reduced-motion`
- **Responsive**: mobile-first layout, tested down to 375px
- **Secure by default**: strict Content Security Policy and security headers, no inline scripts

## Tech stack

- HTML5, CSS3 (custom properties, grid, keyframe animations)
- Vanilla JavaScript (ES2020, Web Animations API, IntersectionObserver)
- Hosted on Cloudflare Pages

No frameworks, build step or dependencies.

## Project structure

```
mobile-barber/
├── index.html        Markup, meta tags and JSON-LD structured data
├── css/style.css     Styles; design tokens in :root
├── js/intro.js       Intro flag (render-blocking, runs before first paint)
├── js/main.js        Navigation, booking form and visual effects
├── images/           Optimised images (WebP)
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── _headers          Security and caching headers for Cloudflare Pages
```

## Running locally

Any static file server works, for example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Configuration

| Setting | Location |
|---|---|
| Business name, phone, email, social links | `index.html` (visible content, JSON-LD and footer NAP) |
| WhatsApp number | `index.html` links and `WHATSAPP_NUMBER` in `js/main.js` |
| Services and prices | Service cards, booking form options and `hasOfferCatalog` in JSON-LD |
| Service areas | Areas list, FAQ and `areaServed` in JSON-LD |
| Colours and typography | `:root` in `css/style.css` |
| Hair clipping colours | `HAIR_COLORS` in `js/main.js` |
| Domain | `canonical`, Open Graph URLs, JSON-LD, `robots.txt`, `sitemap.xml` |

Structured data, visible content and the Google Business Profile must stay consistent.
The FAQ section mirrors the `FAQPage` schema one-to-one.

## Images

| Asset | Spec |
|---|---|
| Gallery | WebP, 600×750, < 200 KB, descriptive file name and `alt` text, `loading="lazy"` |
| Hero | WebP, < 200 KB; if used as `<img>`, set `fetchpriority="high"` and do not lazy-load |
| `images/og-image.jpg` | 1200×630 |
| `images/logo.png` | Square, at least 112×112 |
| `images/apple-touch-icon.png` | 180×180 |

## Deployment (Cloudflare Pages)

1. Create a Pages project connected to the repository (or use Direct Upload).
2. Framework preset: **None**. Build command: *empty*. Output directory: `/`.
3. Add the custom domain under **Custom domains**.
4. Every push to the main branch deploys automatically; previous deployments can be rolled back from the dashboard.

## Security

- `_headers` applies a strict CSP (first-party scripts only, Google Fonts allowed), HSTS, `X-Frame-Options: DENY`, `nosniff`, a referrer policy and a restrictive permissions policy.
- No personal data is stored or transmitted by the site; the booking form only opens WhatsApp.
- New third-party services must be added to the CSP before use.
- Recommended for all related accounts (hosting, domain, Google, social): unique passwords, app-based two-factor authentication, domain auto-renew and registrar lock.

## Pre-launch checklist

- [ ] Replace placeholder business details, domain and social links
- [ ] Replace sample testimonials and statistics with verified figures
- [ ] Confirm credentials shown on the page (experience, DBS check, insurance)
- [ ] Add gallery, hero, Open Graph, logo and touch icon images
- [ ] Validate structured data: https://search.google.com/test/rich-results
- [ ] Check performance (target 90+ on mobile): https://pagespeed.web.dev
- [ ] Check headers: https://securityheaders.com
- [ ] Submit `sitemap.xml` in Google Search Console
- [ ] Link the website from the Google Business Profile

## License

© 2026 All rights reserved. This code is proprietary and may not be copied or reused without permission.
