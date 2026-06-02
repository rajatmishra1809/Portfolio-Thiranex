# 🌌 Rajat Mishra Portfolio

A high-performance, ultra-modern multi-page personal portfolio engineered with a strict focus on **semantic HTML5 architectures**, **WCAG accessibility compliance**, and fluid responsive layouts. 

Built using a production-ready **Vite + TypeScript** compilation pipeline.

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Lighthouse Score](https://img.shields.io/badge/Lighthouse-100%25_A11y_%26_SEO-success?style=for-the-badge&logo=lighthouse&logoColor=FFE500)

---

## 🎨 Design System & Philosophy

The user interface pivots around an aesthetic, minimal dark-mode dashboard concept:
* **Monochromatic Base:** Engineered with a deep matte background (`#09090b` / `#141417`) to maximize visual contrast and eliminate screen fatigue.
* **Electric Accents:** Features smooth royal purple (`#a855f7`) gradients and ambient glows.
* **Strict Accessibility:** Contrast parameters rigorously cross-check and exceed WCAG AA targets ($> 4.5:1$ ratio scales) alongside native keyboard tab-navigation routing.

---

## 📂 Project Architecture

```text
RAJAT-MISHRA-PORTFOLIO/
│
├── assets/                  # Core static assets, images, and brand iconography
├── src/                     # TypeScript implementation mechanics & execution layers
│
├── index.html               # Semantic landing platform & core hero showcase
├── about.html               # Professional bio, experience grid & core competencies
├── projects.html            # Production-ready code case studies & hardware repository index
├── contact.html             # Accessible, tab-navigable form interface with ARIA tracking
│
├── vite.config.ts           # Highly optimized bundling and building parameters
├── tsconfig.json            # Strict type checking configuration
├── package.json             # Engine script and dependency registry
├── metadata.json            # Dynamic portfolio configurations
├── .gitignore               # System environment asset exclusions
└── .env.example             # Decoupled credential key templates
Key Technical Features
HTML5 Semantic Standards: Replaced standard tag structures completely with native structural landmarks (<header>, <nav>, <main>, <section>, <article>, <footer>) ensuring clean document outlines.

Advanced Screen Reader Optimization: Mapped explicit focus-visible borders (#38bdf8) and custom ARIA labels (aria-labelledby, aria-describedby, aria-current) for flawless screen reader interpretation.

Vite Execution Speed: Bundled natively over a fast building pipeline running hot module replacement (HMR) speeds.

SEO-Ready Core: Configured with robust structural <meta> tags, semantic headings tracking, and search-crawler canonical parameters.

🛠️ Local Development Installation
Prerequisites
Ensure you have Node.js installed on your development device.

1. Clone the Repository
Bash
git clone [https://github.com/your-username/rajat-mishra-portfolio.git](https://github.com/your-username/rajat-mishra-portfolio.git)
cd rajat-mishra-portfolio
2. Install Project Dependencies
Bash
npm install
3. Initialize Environment Configurations
Bash
cp .env.example .env
4. Fire Up the Local Development Server
Bash
npm run dev
Your terminal will expose a local loopback link (typically http://localhost:5173). Open it in your browser to inspect the application.

5. Production Compiling & Optimization
To build a highly compressed, production-grade static build directory, execute:

Bash
npm run build
👤 Author
Rajat Mishra - Computer Science Engineering Student @ VIT Chennai

Focus Area: Inclusive User Experience Layouts, Relational Database Frameworks, and Core System Architectures.


***

### 💡 Tips for Github:
1. Copy this block directly into your `README.md` file.
2. Remember to update the `your-username` placeholder in the **Clone the Repository** link to match your actual GitHub username so the link routes accurately!
