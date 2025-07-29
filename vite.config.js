import { defineConfig } from 'vite'
import path from 'path'
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'

export default defineConfig({
  // Important: Set base to your repo name for GitHub Pages
  base: '/version-timetravel/',
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        viewer: path.resolve(__dirname, 'viewer.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  plugins: [
    {
      name: 'copy-version-files',
      closeBundle() {
        // Copy version HTML files to dist
        const versionFiles = [
          'version1.html',
          'version2.html', 
          'version25.html',
          'version28.html',
          'landingpage.html'
        ];
        
        versionFiles.forEach(file => {
          try {
            // Read the file content
            let content = readFileSync(file, 'utf8');
            
            // Replace absolute paths with base-relative paths
            content = content.replace(/href="\/css\//g, 'href="css/');
            content = content.replace(/src="\/js\//g, 'src="js/');
            content = content.replace(/href="\/images\//g, 'href="images/');
            content = content.replace(/src="\/images\//g, 'src="images/');
            
            // Write the modified content
            writeFileSync(`dist/${file}`, content);
            console.log(`Copied and updated ${file} to dist/`);
          } catch (err) {
            console.error(`Failed to copy ${file}:`, err);
          }
        });
        
        // Copy src/versions directory if it exists
        try {
          mkdirSync('dist/src', { recursive: true });
          mkdirSync('dist/src/versions', { recursive: true });
          mkdirSync('dist/src/versions/v1', { recursive: true });
          mkdirSync('dist/src/versions/v2', { recursive: true });
          copyFileSync('src/versions/v1/index.html', 'dist/src/versions/v1/index.html');
          copyFileSync('src/versions/v2/index.html', 'dist/src/versions/v2/index.html');
          console.log('Copied src/versions/ to dist/');
        } catch (err) {
          console.error('Failed to copy src/versions:', err);
        }
        
        // Copy CSS and JS directories for legacy version files
        try {
          mkdirSync('dist/css', { recursive: true });
          mkdirSync('dist/js', { recursive: true });
          
          // Copy all CSS files
          const cssFiles = readdirSync('css').filter(f => f.endsWith('.css'));
          cssFiles.forEach(file => {
            copyFileSync(`css/${file}`, `dist/css/${file}`);
          });
          console.log('Copied CSS files to dist/css/');
          
          // Copy all JS files
          const jsFiles = readdirSync('js').filter(f => f.endsWith('.js'));
          jsFiles.forEach(file => {
            copyFileSync(`js/${file}`, `dist/js/${file}`);
          });
          console.log('Copied JS files to dist/js/');
        } catch (err) {
          console.error('Failed to copy CSS/JS directories:', err);
        }
      }
    }
  ]
})