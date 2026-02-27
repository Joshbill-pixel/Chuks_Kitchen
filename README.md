# Chuks Kitchen - Food Delivery Web Application

![Chuks Kitchen](https://via.placeholder.com/800x400/f97316/ffffff?text=Chuks+Kitchen)

A modern, responsive food delivery web application for authentic Nigerian cuisine. Built with React, Tailwind CSS, and modern web technologies.

## 🚀 Live Demo

[View Live Demo](https://your-deployment-url.com) *(Update with your actual URL)*

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Design Interpretation](#design-interpretation)
- [API Integration Guide](#api-integration-guide)
- [Limitations & Roadmap](#limitations--roadmap)
- [Contributing](#contributing)

---

## 🍽️ Project Overview

**Chuks Kitchen** is a complete end-to-end food ordering platform that brings authentic Nigerian home cooking to customers' doorsteps. The application handles everything from menu browsing to payment processing, with a focus on user experience and modern design patterns.

### What We Built

| Feature | Description |
|---------|-------------|
| **Menu System** | Category-based browsing with detailed food customization |
| **Shopping Cart** | Persistent cart with real-time price calculation |
| **User Accounts** | Secure authentication with profile management |
| **Order Management** | Full order lifecycle from placement to delivery |
| **Payment Processing** | Multiple payment methods with secure handling |
| **Receipt System** | Downloadable, printable transaction receipts |

### Target Users

- Busy professionals seeking authentic Nigerian meals
- Diaspora community craving home-style cooking
- Event planners ordering catering services
- Anyone exploring Nigerian cuisine

---

## ✨ Features

### Core Functionality

#### 🏠 Customer-Facing
- **Browse Menu**: Filter by categories (Jollof Delights, Swallow & Soups, Grills & BBQ, Sweet Treats)
- **Customize Orders**: Select proteins (Fried Chicken, Grilled Fish, Beef) and sides (Plantain, Coleslaw, Pepper Sauce)
- **Schedule Delivery**: ASAP or pick specific date/time slots
- **Multiple Payment Options**: Card, bank transfer, or direct bank payment
- **Order Tracking**: Real-time status updates (Pending → Preparing → Out for Delivery → Delivered)
- **Reorder**: One-click reorder from order history

#### 👤 User Account
- **Profile Management**: Update personal info, upload profile picture
- **Saved Addresses**: Multiple delivery addresses with default selection
- **Payment Methods**: Save cards securely for faster checkout
- **Order History**: Complete purchase history with detailed receipts

#### 🛡️ Security Features
- Password strength requirements with visual feedback
- Session management with automatic expiration
- Form validation on all inputs
- Secure payment flow simulation

---

## 🛠️ Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI library with hooks and concurrent features |
| **Vite** | 5.x | Fast development server and optimized builds |
| **React Router** | 6.x | Declarative client-side routing |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **shadcn/ui** | Latest | Accessible, customizable component primitives |

### Supporting Libraries

| Library | Purpose |
|---------|---------|
| `lucide-react` | Modern icon system |
| `@radix-ui/react-*` | Headless UI primitives (via shadcn) |
| `clsx` / `tailwind-merge` | Conditional class utilities |

### Why This Stack?

1. **Development Speed**: Tailwind + shadcn/ui enables rapid UI development
2. **Performance**: Vite's ESM-based HMR and React 18's optimizations
3. **Accessibility**: shadcn/ui components follow WAI-ARIA guidelines
4. **Maintainability**: Component-based architecture with clear separation
5. **Scalability**: Easy to extend; Context API can migrate to Redux if needed

---

## 📁 Project Structure
chuks-kitchen/
├── public/
│   └── images/                    # Static assets
│       ├── hero-banner.jpg
│       ├── food items/
│       └── icons/
│
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── modal.jsx
│   │   │   └── ...
│   │   ├── Navbar.jsx             # Site navigation
│   │   └── Footer.jsx             # Site footer
│   │
│   ├── context/
│   │   └── CartContext.jsx        # Global cart state
│   │
│   ├── data/
│   │   └── foodData.js            # Menu data & mock APIs
│   │
│   ├── pages/
│   │   ├── HomePage.jsx           # Landing page
│   │   ├── MenuPage.jsx           # Full menu
│   │   ├── FoodDetailsPage.jsx    # Item customization
│   │   ├── CartPage.jsx           # Shopping cart
│   │   ├── OrderSummaryPage.jsx   # Order review
│   │   ├── DeliveryDetailsPage.jsx # Address & scheduling
│   │   ├── PaymentPage.jsx        # Payment processing
│   │   ├── OrderSuccessPage.jsx   # Confirmation
│   │   ├── OrdersPage.jsx         # Order history
│   │   ├── SignUpPage.jsx         # Registration
│   │   ├── SignInPage.jsx         # Login
│   │   └── AccountPage.jsx        # Profile management
│   │
│   ├── hooks/
│   │   └── use-mobile.jsx         # Responsive detection
│   │
│   ├── lib/
│   │   └── utils.js               # Utility functions
│   │
│   ├── App.jsx                    # Root with routing
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
│
├── tailwind.config.js             # Tailwind customization
├── vite.config.js                 # Vite configuration
└── package.json
plain
Copy

### Key Files Explained

| File | Responsibility |
|------|---------------|
| `CartContext.jsx` | Manages cart state, persists to localStorage, calculates totals |
| `foodData.js` | Single source of truth for all menu items and options |
| `FoodDetailsPage.jsx` | Complex state management for dynamic pricing based on selections |
| `PaymentPage.jsx` | Multi-method payment flow with validation |
| `DeliveryDetailsPage.jsx` | Address book management with schedule time picker |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chuks-kitchen.git

# Navigate to project
cd chuks-kitchen

# Install dependencies
npm install

# Start development server
npm run dev
The app will be available at http://localhost:5173
Build for Production
bash
Copy
# Create optimized build
npm run build

# Preview production build locally
npm run preview
Environment Variables
Create .env file in root:
env
Copy
# API Configuration (when backend is ready)
VITE_API_BASE_URL=https://api.chukkitchen.com
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Feature Flags
VITE_ENABLE_PAYMENT=true
VITE_ENABLE_SCHEDULING=true
🎨 Design Interpretation
Color Palette
Table
Copy
Color	Hex	Usage
Primary Orange	#f97316	CTAs, prices, active states
Success Green	#22c55e	Delivered status, success messages
Error Red	#ef4444	Validation errors, delete actions
Info Blue	#3b82f6	Bank payment method
Neutral Gray	#6b7280	Secondary text, borders
Typography Scale
Table
Copy
Element	Size	Weight
H1 (Page titles)	1.875rem (30px)	Bold (700)
H2 (Section headers)	1.5rem (24px)	Semibold (600)
Body	1rem (16px)	Regular (400)
Caption	0.875rem (14px)	Regular (400)
Price	1.25rem (20px)	Bold (700)
Responsive Breakpoints
Table
Copy
Breakpoint	Width	Layout Changes
Mobile	< 640px	Single column, stacked cards
Tablet	640-1024px	2-column grids
Desktop	> 1024px	Full layout, side-by-side sections
Figma-to-Code Decisions
Assumptions Made
Table
Copy
Missing in Design	Implementation Choice
Hover states	Subtle scale(1.02) + darken color by 10%
Loading states	Spinner buttons + skeleton screens
Error states	Inline validation with red borders
Empty states	Illustrated empty views with CTAs
Animations	200ms ease transitions on all interactions
Dark mode	Not implemented (future enhancement)
Components Built from Scratch
Schedule Time Picker: Custom modal with date/time selection (not in original design)
Receipt Modal: Downloadable/printable receipt generator
Address Manager: Full CRUD for delivery addresses
Password Strength Meter: Visual indicator with requirements checklist
🔌 API Integration Guide
Current State
All data is currently mock-based. To connect to a real backend:
1. Authentication Endpoints
JavaScript
Copy
// Replace localStorage simulation with actual API calls

// Sign Up
POST /api/auth/register
Body: { email, phone, password, name }

// Sign In
POST /api/auth/login
Body: { email, password }
Response: { token, user }

// Verify Token
GET /api/auth/me
Headers: { Authorization: Bearer ${token} }
2. Menu Endpoints
JavaScript
Copy
// Get all categories
GET /api/categories

// Get menu items by category
GET /api/menu?category=jollof-delights

// Get single item details
GET /api/menu/:id
3. Order Endpoints
JavaScript
Copy
// Create order
POST /api/orders
Body: { items, address, paymentMethod, scheduledTime }

// Get user orders
GET /api/orders

// Get order details
GET /api/orders/:id

// Track order status
GET /api/orders/:id/track
4. Payment Integration
Replace simulated payment with actual provider:
JavaScript
Copy
// Example Stripe integration
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const { error, paymentIntent } = await stripe.confirmCardPayment(
  clientSecret,
  {
    payment_method: {
      card: cardElement,
      billing_details: { name: cardDetails.name }
    }
  }
);
⚠️ Limitations & Roadmap
Current Limitations
Table
Copy
Area	Limitation	Impact
Backend	All data is mock/localStorage only	No real persistence, no multi-device sync
Authentication	JWT simulation with localStorage	Vulnerable to XSS, no refresh tokens
Payments	Simulated delays only	No actual money processing
Images	No optimization	Large bundle size, slow loading
Real-time	No WebSocket connection	Manual refresh for order updates
Development Roadmap
Phase 1: Foundation (Completed ✅)
[x] UI/UX implementation
[x] Client-side state management
[x] Form validation
[x] Responsive design
Phase 2: Backend Integration (Next)
[ ] REST API connection
[ ] Real authentication with httpOnly cookies
[ ] Database persistence
[ ] Image upload to CDN
Phase 3: Enhanced Features
[ ] Real-time order tracking (WebSocket)
[ ] Push notifications
[ ] Advanced search with filters
[ ] Reviews and ratings system
Phase 4: Scale
[ ] React Native driver app
[ ] Admin dashboard
[ ] Analytics and reporting
[ ] Multi-restaurant support
Immediate Improvements for New Developers
Add TypeScript: Migrate to .tsx for type safety
Testing: Implement Jest + React Testing Library
Performance: Add React.lazy() for code splitting
Accessibility: Implement focus management in modals
SEO: Add React Helmet for meta tags
🤝 Contributing
Code Style
Use functional components with hooks
Prefer const over let, avoid var
Destructure props at component level
Use cn() for conditional Tailwind classes
Git Workflow
bash
Copy
# Create feature branch
git checkout -b feature/your-feature-name

# Make commits
git commit -m "feat: add schedule time picker"

# Push and create PR
git push origin feature/your-feature-name
Commit Convention
Table
Copy
Prefix	Use Case
feat:	New feature
fix:	Bug fix
docs:	Documentation
style:	Formatting, no code change
refactor:	Code restructuring
test:	Adding tests
📄 License
MIT License - feel free to use this project for learning or commercial purposes.
📞 Support
For questions or issues:
Email: support@chukkitchen.com
Phone: +234 801 234 5678
Built with ❤️ for Nigerian food lovers everywhere
plain
Copy

---

## How to Create the File:

1. **Open your code editor** (VS Code, etc.)
2. **Create new file** in your project root folder
3. **Name it**: `README.md`
4. **Paste all the content above**
5. **Save the file**

The file will automatically render with Markdown formatting on GitHub or any Markdown viewer.