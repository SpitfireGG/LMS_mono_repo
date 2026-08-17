# Positivus Landing Page

A modern, responsive landing page for a digital marketing agency, built from a Figma design. This project showcases a pixel-perfect implementation of a professional landing page with smooth animations, interactive components, and a fully responsive design.

🌐 **Live Demo:** [https://zakariamouhid-positivus.vercel.app](https://zakariamouhid-positivus.vercel.app)

![Project Mockup](Project-Mockup.png)

## 🎨 Design Attribution

This project is based on a design from Figma Community:

- **Design by:** [Olga](https://www.figma.com/@olgaaverchenko)
- **Figma Design:** [Positivus Landing Page Design](https://www.figma.com/community/file/1230604708032389430/positivus-landing-page-design)
- **License:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

**Coded by:** [zakariamouhid](https://zakariamouhid.blogspot.com/)

## ✨ Features

- 🎯 **Pixel-Perfect Design** - Faithful implementation of the Figma design
- 📱 **Fully Responsive** - Optimized for all screen sizes (mobile, tablet, desktop)
- ⚡ **Performance Optimized** - Built with Next.js 16 for optimal performance
- 🎨 **Modern UI Components** - Interactive testimonials, service cards, and more
- ♿ **Accessible** - ARIA labels and semantic HTML for better accessibility
- 🎭 **Smooth Animations** - Engaging user interactions throughout
- 🔍 **SEO Optimized** - Proper meta tags and semantic structure

## ⚡ Performance

Check out the performance metrics for this site:

- **PageSpeed Insights Analysis:** [View Mobile Performance Report](https://pagespeed.web.dev/analysis/https-zakariamouhid-positivus-vercel-app/i6mvfrymag?form_factor=mobile)

![Lighthouse Performance Score](Screenshot-Lighthouse-2025-12-27-132752.png)

## 🛠️ Tech Stack

- **Framework:** [Next.js 16.1.1](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Library:** [React 19](https://react.dev/)
- **Font:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (via Next.js Font Optimization)
- **SVG Handling:** [@svgr/webpack](https://react-svgr.com/)
- **Utilities:**
  - `clsx` & `tailwind-merge` for className management
  - `use-local-storage-state` for local storage state management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/positivus-from-figma.git
cd positivus-from-figma
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy on Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📁 Project Structure

```
positivus-from-figma/
├── app/
│   ├── assets/          # Images, icons, and illustrations
│   ├── components/      # React components
│   ├── lib/             # Utility functions
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── lib/                 # Build configuration
├── public/              # Static assets
└── ...config files
```

## 🎯 Key Components

- **NavigationBar** - Responsive navigation with mobile menu
- **Header** - Hero section with CTA
- **Services** - Service cards with illustrations
- **CaseStudies** - Portfolio showcase
- **Process** - Step-by-step workflow
- **Team** - Team member cards
- **Testimonials** - Interactive testimonial carousel
- **Contact** - Contact form with validation
- **Footer** - Footer with links and subscription form

## 📝 Notes

- The project includes debug tools for design comparison (accessible at `/debug`)
- Forms are currently set up with placeholder handlers (see TODO comments in code)
- All SVG icons are optimized and imported as React components

## 📄 License

This project is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design by [Olga (@olgaaverchenko)](https://www.figma.com/@olgaaverchenko) from Figma Community
- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
