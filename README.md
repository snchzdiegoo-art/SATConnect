# SAT Connect - Landing Page

**A premium Single Page Application for SAT Connect B2B Tourism Marketplace**

Modern React landing page built with Vite, Tailwind CSS, and Glassmorphism design. Features the T.H.R.I.V.E. Engine showcase, pricing tiers, marketplace preview, and lead capture.

---

## 🎯 Features

- ✅ **Hero Section** - Stunning background with glassmorphism overlay
- ✅ **T.H.R.I.V.E. Engine** - 6 pillar audit system explanation
- ✅ **Pricing Table** - 3 pricing tiers with countdown timer for founding members
- ✅ **Marketplace Preview** - Product showcase with modal interactions
- ✅ **Onboarding Form** - Lead capture with validation
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Smooth Animations** - Fade-in, hover effects, and scroll interactions
- ✅ **SEO Optimized** - Meta tags, Open Graph, structured data

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd "c:\Users\diego\Documents\SAT Connect\Antigravity\LANDING PAGE"

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173`

---

## 📦 Project Structure

```
LANDING PAGE/
├── public/
│   └── assets/
│       ├── hero_background.png    # Hero section background
│       ├── logo.png                # SAT Connect logo
│       ├── favicon.svg             # Site favicon
│       └── products/               # Product images (6 tours)
├── src/
│   ├── components/
│   │   ├── Hero.jsx                # Hero section
│   │   ├── ThriveEngine.jsx        # T.H.R.I.V.E. pillar cards
│   │   ├── PricingTable.jsx        # Pricing tiers + countdown
│   │   ├── MarketplacePreview.jsx  # Product showcase
│   │   ├── OnboardingForm.jsx      # Lead capture form
│   │   ├── Footer.jsx              # Footer with links
│   │   └── ui/                     # Reusable components
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Badge.jsx
│   │       └── CountdownTimer.jsx
│   ├── index.css                   # Tailwind + Custom styles
│   ├── App.jsx                     # Main app component
│   └── main.jsx                    # Entry point
├── package.json
├── vite.config.js
├── tailwind.config.js              # Custom design tokens
├── vercel.json                     # Vercel deployment config
├── netlify.toml                    # Netlify deployment config
└── README.md                       # This file
```

---

## 🎨 Design System

### Colors
- **Brand Dark**: `#0f172a` - Main background
- **Brand Darker**: `#020617` - Section backgrounds
- **Brand Accent**: `#00d2ff` - CTAs, links, highlights
- **Brand Secondary**: `#3a7bd5` - Gradients

### Typography
- **Display**: Outfit (headings)
- **Sans**: Inter (body text)

### Components
All components use **glassmorphism** design with:
- Backdrop blur
- Semi-transparent backgrounds
- Subtle borders
- Smooth hover effects

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
VITE_FORM_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
VITE_BOKUN_REDIRECT_URL=https://your-bokun-url.com
```

### FormSpree Setup (Lead Capture)

1. Go to [formspree.io](https://formspree.io)
2. Create a free account
3. Create a new form
4. Copy the form endpoint URL
5. Update `VITE_FORM_ENDPOINT` in `.env`
6. Uncomment the fetch code in `OnboardingForm.jsx` (line 63-68)

### Stripe Integration (Optional)

To enable Stripe Checkout:

1. Get your Stripe test keys from [stripe.com](https://stripe.com)
2. Update `VITE_STRIPE_PUBLIC_KEY` in `.env`
3. Update the `handlePlanClick` function in `PricingTable.jsx` with Stripe logic
4. Follow Stripe Checkout documentation

---

## 🏗️ Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

Follow prompts:
- **Project name**: sat-connect-landing
- **Framework**: Vite
- **Build command**: `npm run build`
- **Output directory**: `dist`

Your site will be live at `https://your-project.vercel.app`

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

Select `dist` as the publish directory.

### Custom Domain

Both Vercel and Netlify offer free SSL and custom domain configuration:

1. Add your domain in the platform dashboard
2. Update DNS records to point to the platform
3. SSL certificate is auto-configured

---

## ✅ Verification Checklist

### Visual Testing
- [ ] All sections render correctly
- [ ] Images load properly
- [ ] Fonts display correctly (Inter, Outfit)
- [ ] Glassmorphism effects visible
- [ ] Animations smooth (60fps)

### Responsive Testing
- [ ] Mobile (320px - 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px+)

### Functional Testing
- [ ] Hero CTAs scroll to correct sections
- [ ] Countdown timer counts down
- [ ] Pricing cards hover effects work
- [ ] Marketplace modal opens/closes
- [ ] Form validation works
- [ ] Form submission succeeds

### Performance
Run Lighthouse audit:
```bash
npm run build
npm run preview
# Open DevTools > Lighthouse > Run Audit
```

Target scores:
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

---

## 🔧 Customization

### Update Pricing

Edit `src/components/PricingTable.jsx` - `plans` array:

```javascript
const plans = [
  {
    name: 'Standard',
    price: 799,
    discountedPrice: 599,
    // ... more fields
  }
]
```

### Update Products

Edit `src/components/MarketplacePreview.jsx` - `products` array:

```javascript
const products = [
  {
    name: 'Your Tour Name',
    provider: 'Provider Name',
    price: 1299,
    // ... more fields
  }
]
```

### Update T.H.R.I.V.E. Pillars

Edit `src/components/ThriveEngine.jsx` - `pillars` array

### Change Colors

Edit `tailwind.config.js` - `theme.extend.colors`

---

## 🐛 Troubleshooting

### Images not loading

Check that images are in `public/assets/` and paths start with `/assets/`

### Fonts not loading

Check Google Fonts link in `index.html`

### Build errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 already in use

```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## 📝 TODO / Future Enhancements

- [ ] Connect FormSpree or custom backend for lead capture
- [ ] Integrate Stripe Checkout for payments
- [ ] Add Google Analytics or Plausible
- [ ] Implement i18n (Spanish/English toggle)
- [ ] Add blog section for SEO
- [ ] Create admin dashboard for content management

---

## 📞 Support

For questions or issues:
- Email: info@satconnect.travel
- Documentation: See `implementation_plan.md` in brain artifacts

---

## 🏆 Credits

**Built with**:
- React 18
- Vite 6
- Tailwind CSS 3.4
- Font Awesome 6
- Google Fonts (Inter, Outfit)

**Design**: Premium Glassmorphism UI/UX  
**Powered by**: SAT México + Bókun Partnership

---

**License**: Proprietary - © 2026 SAT Connect
