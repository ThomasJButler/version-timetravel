# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is my personal portfolio evolution timeline - a visual journey showcasing the gradual transformation of my portfolio website over time. I've built this to document and celebrate my web development journey, capturing each iteration from the initial v1.0 in August 2024 through to the planned v3.0 (React-based) version.

The project serves as both a portfolio piece and a learning showcase, demonstrating my growth as a developer through the evolution of design, code complexity, and feature implementation.

## Architecture & Structure

This is a Vite-powered static site with a Matrix-themed timeline interface. The project uses a hybrid structure with modern build tools while showcasing legacy versions:

### Directory Structure

```
version-timetravel/
├── src/                      # Main application source (Vite-based)
│   ├── main.js              # Entry point with all initialization logic
│   ├── styles/              # Modern CSS files
│   │   ├── global.css       # Global styles and CSS variables
│   │   ├── timeline.css     # Timeline component styles
│   │   ├── viewer.css       # Version viewer styles
│   │   └── loading.css      # Loading states and skeletons
│   ├── js/                  # Modern JavaScript modules
│   │   ├── matrix.js        # Matrix rain effect (Canvas API)
│   │   ├── timeline.js      # Timeline component logic
│   │   └── viewer.js        # Version viewer logic
│   ├── data/                # Application data
│   │   └── versions.json    # Version metadata and configuration
│   └── versions/            # Consolidated version files
│       ├── v1/index.html    # Self-contained v1 with inline CSS/JS
│       └── v2/index.html    # Self-contained v2 with inline CSS/JS
├── css/                     # Legacy CSS files (for standalone versions)
│   ├── global.css           # Original global styles
│   ├── globalv29.css        # v2.9 specific global styles
│   ├── styles.css           # UNUSED - can be removed
│   ├── version1.css         # Styles for version1.html
│   ├── version2.css         # Styles for version2.html
│   ├── version25.css        # Styles for version25.html
│   ├── version28.css        # Styles for version28.html
│   └── version29.css        # Styles for version29.html
├── js/                      # Legacy JS files (for standalone versions)
│   ├── timetravel.js        # UNUSED - can be removed
│   ├── version1.js          # Scripts for version1.html
│   ├── version2.js          # Scripts for version2.html
│   ├── version25.js         # Scripts for version25.html
│   ├── version28.js         # Scripts for version28.html
│   └── version29.js         # Scripts for version29.js
├── index.html               # Main timeline page
├── viewer.html              # Version preview page
├── landingpage.html         # Standalone landing page version
├── version1.html            # Standalone v1 (needs CSS path fix)
├── version2.html            # Standalone v2 (needs CSS path fix)
├── version25.html           # Standalone v2.5
├── version28.html           # Standalone v2.8
├── version29.html           # Standalone v2.9 (consider removing)
├── package.json             # Node.js dependencies
├── vite.config.js           # Vite configuration
├── postcss.config.js        # PostCSS configuration
├── README.md                # Main documentation
├── CHANGELOG.md             # Version history
└── files-to-remove.md       # Cleanup documentation
```

### Core Components

#### 1. Timeline System (`/src/js/timeline.js`)
- Loads version data from JSON
- Dynamically generates timeline cards
- Handles interactions (clicks, hover effects)
- Implements lazy loading for images
- Shows loading skeletons during data fetch

#### 2. Matrix Rain Effect (`/src/js/matrix.js`)
- Ultra-subtle background animation
- Binary characters only (0s and 1s)
- Sparse columns for performance
- Respects prefers-reduced-motion

#### 3. Version Viewer (`/src/js/viewer.js`)
- Iframe-based preview system
- Desktop/tablet/mobile viewport switching
- Loading states with Matrix-themed spinner
- Keyboard shortcuts for navigation

#### 4. Main Application (`/src/main.js`)
- Initializes all components
- Sets up smooth scrolling
- Implements keyboard navigation (1-7 for versions)
- Back-to-top button functionality
- Scroll progress indicator
- Mobile menu toggle

### Styling Architecture

#### CSS Custom Properties (Design Tokens)
- Matrix color palette (green, cyan, magenta, red)
- Typography scale and fonts
- Spacing system
- Animation durations and easings
- Responsive breakpoints

#### Component Styles
- **Timeline**: Alternating left/right layout with prominent desktop screenshots
- **Loading**: Skeleton screens and Matrix-themed spinners
- **Viewer**: Device frame simulation for different viewports

### Data Structure (`/src/data/versions.json`)

Each version contains:
- `id`: Unique identifier (e.g., "v1", "v2.5")
- `number`: Display version number
- `date`: Release date
- `title`: Version tagline
- `screenshots`: Desktop and mobile image URLs
- `features`: Array of key changes
- `techStack`: Technologies used
- `path`: Path to standalone version file
- `isLive`: Boolean for current version (v3.0)

### Version Files

#### Standalone Versions (Root Directory)
- Full HTML files with external CSS/JS references
- Used by the version viewer for authentic preview
- Preserve original code structure

#### Consolidated Versions (`/src/versions/`)
- Self-contained HTML with inline CSS/JS
- Include learning documentation and reflections
- Created for reduced complexity

### Build Process

1. **Development**: `npm run dev` - Vite dev server with HMR
2. **Build**: `npm run build` - Production build with optimization
3. **Preview**: `npm run preview` - Preview production build

### Key Features Implementation

#### Loading States
- Initial page load screen ("INITIALIZING...")
- Timeline skeleton loaders during data fetch
- Image lazy loading with intersection observer
- Version viewer loading spinner

#### Keyboard Navigation
- Numbers 1-7: Jump to specific versions
- Arrow keys: Navigate timeline
- ESC: Return to top or close viewer
- F: Toggle fullscreen in viewer

#### Responsive Design
- Mobile-first approach
- Timeline adapts to single column
- Touch-friendly interactions
- Hamburger menu for mobile

### Performance Optimizations

- Lazy loading for images
- Debounced scroll events
- Request Animation Frame for Matrix effect
- CSS transforms for animations
- Minimal JavaScript for legacy versions

### Maintenance Notes

#### When Adding New Versions
1. Add entry to `versions.json`
2. Create standalone HTML file (optional)
3. Add corresponding CSS/JS files
4. Update quick access links count
5. Update keyboard navigation array
6. Add to skeleton loader count

#### Common Issues
- Version files need absolute paths (`/css/` not `src/css/`)
- Images should use CDN URLs or absolute paths
- Timeline alternates mobile position (check CSS nth-child)

### Future Enhancements

- Add v3.0 when it goes live
- Consider removing redundant versions (v2.9)
- Add Puppeteer tests for functionality
- Implement service worker for offline viewing
- Add analytics to track popular versions