# Mindful Auth Astro Template 

Official Astro template for Mindful Auth authentication integration. This Astro template provides a complete authentication portal with:

* Server-side session validation via Astro middleware
* Authentication proxy to Mindful Auth central API
* Clean Astro components with minimal JavaScript
* Hybrid static/SSR rendering for optimal performance
* Easy deployment to Cloudflare Workers

## Prerequisites
* Mindful Auth account with registered hostnames. Create account at [https://app.mindfulauth.com/register](https://app.mindfulauth.com/register)
* Internal API Key: Generated for your tenant (used for server-to-server validation). The INTERNAL_API_KEY must be added as a secret environment variable in your deployment platform (e.g. Cloudflare Workers).
* Node.js 18+: Required for Astro development

## Support
For support with this template, please reach out to the Mindful Auth team at https://mindfulauth.com/contact/ or join our Discord community at https://discord.gg/TACH9jP4pG