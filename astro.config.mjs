// Astro configuration for Mindful Auth Portal
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { mauthSecurityConfig, getMauthViteDefines } from '@mindfulauth/core/config';

// Configure Mindful Auth security settings
const mauthCfg = mauthSecurityConfig({
       skipAssets: [],
       csp: {
         scriptSources: [],
         connectSources: [],
         frameSources: [],
         fontSources: [],
         styleSources: [],
         imageSources: [],
         frameAncestors: [],
         workerSources: [],
         manifestSources: [],
         objectSources: [],
         baseUris: [],
         formActions: []
       }
     });

// Export the Astro configuration
export default defineConfig({
    // Server-side rendering required for session validation
    output: 'server',

    // Deploy to Cloudflare Workers (change adapter for other platforms)
    adapter: cloudflare({
        routes: {
            // Serve static assets directly without going through SSR middleware
            include: ['/favicon.ico', '/robots.txt', '/.well-known/*'],
            exclude: [],
        }
    }),

    image: {
        service: { entrypoint: 'astro/assets/services/sharp' }
    },

    vite: {
        define: getMauthViteDefines(mauthCfg),
        ssr: {
            external: ['cloudflare:workers']
        }
    },

    security: {
        // Validates the Origin header on incoming POST/PATCH/DELETE/PUT requests
        // to prevent Cross-Site Request Forgery (CSRF) attacks.
        checkOrigin: true,

        // Validates the X-Forwarded-Host header against trusted domains.
        allowedDomains: [
            { hostname: 'example.com', protocol: 'https' }
        ]
    }

});