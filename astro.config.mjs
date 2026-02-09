// Astro configuration for Mindful Auth Portal

import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

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
    }
});