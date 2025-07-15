# 🚀 Portfolio Version TimeTravel

> An interactive timeline showcasing the evolution of my portfolio from static HTML to modern React

<img width="1287" height="720" alt="image" src="https://github.com/user-attachments/assets/d7463e9c-a685-47d6-9ac9-8a10a6544f15" />

![Version TimeTravel](https://img.shields.io/badge/Portfolio-Evolution-00FF00?style=for-the-badge&logo=github)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🎯 Overview

Portfolio Version TimeTravel is a visual journey through my web development evolution. This standalone application documents each iteration of my portfolio, capturing not just the visual changes but the technical growth and learning milestones along the way.

### ✨ Features

- **Interactive Timeline**: Smooth-scrolling timeline with 6 portfolio versions
- **Version Viewer**: Preview each version in desktop, tablet, and mobile viewports
- **Matrix Theme**: Elegant cyberpunk aesthetic with ultra-subtle rain effect
- **Keyboard Navigation**: Quick access with number keys (1-6) and arrow navigation
- **Learning Documentation**: Each version includes detailed notes about challenges and victories
- **Responsive Design**: Fully optimized for all devices
- **Performance Optimized**: Built with Vite for lightning-fast loading

## 🛠️ Tech Stack

- **Build Tool**: Vite
- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: PostCSS with Autoprefixer
- **Animations**: CSS animations and transitions
- **Design**: Matrix-themed custom design system

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ThomasJButler/version-timetravel.git
cd version-timetravel
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

### Building for Production

```bash
npm run build
```

The optimized files will be in the `dist` directory.

## 📁 Project Structure

```
version-timetravel/
├── src/
│   ├── main.js           # Application entry point
│   ├── styles/           # CSS files
│   │   ├── global.css    # Global styles and design system
│   │   ├── timeline.css  # Timeline component styles
│   │   └── viewer.css    # Version viewer styles
│   ├── js/               # JavaScript modules
│   │   ├── matrix.js     # Matrix rain effect
│   │   ├── timeline.js   # Timeline functionality
│   │   └── viewer.js     # Version preview system
│   ├── data/             # Application data
│   │   └── versions.json # Version metadata
│   └── versions/         # Preserved portfolio versions
│       ├── v1/          # Version 1.0 (August 2024)
│       ├── v2/          # Version 2.0 (September 2024)
│       └── ...          # Additional versions
├── index.html           # Main timeline page
├── viewer.html          # Version preview page
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies
```

## 🎮 Keyboard Shortcuts

- **1-6**: Jump to specific version
- **↑/↓**: Navigate between versions
- **ESC**: Return to top
- **Space**: Play/pause animations

## 🌟 Version History

1. **v1.0** (Aug 2024) - The Beginning
   - First portfolio with Matrix rain effect
   - Basic HTML/CSS/JavaScript

2. **v2.0** (Sep 2024) - Matrix Theme Born
   - Introduction of cyberpunk aesthetic
   - GSAP animations and ScrollMagic

3. **v2.5** (Oct 2024) - Animation Upgrade
   - Enhanced visual effects
   - Performance optimizations

4. **Landing Page** (Nov 2024) - Experimental Features
   - Testing ground for new ideas
   - Interactive CV prototype

5. **v2.8** (Jan 2025) - Matrix Evolution
   - Refined design system
   - Better mobile experience

6. **v3.0** (Feb 2025) - Current Live Version
   - Modern React application
   - Full-stack implementation

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to GitHub Pages

## 🤝 Contributing

While this is a personal portfolio project, suggestions and feedback are welcome! Feel free to open an issue or submit a pull request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by The Matrix (1999)
- Built with passion in Liverpool, UK
- Special thanks to the web development community

---

**Created by Thomas J Butler** | [Portfolio](https://thomasjbutler.co.uk) | [LinkedIn](https://www.linkedin.com/in/thomasbutleruk/) | [GitHub](https://github.com/ThomasJButler)