/**
 * active-links.js
 * High-performance active class toggling for modern browsers.
 *
 * @copyright 2025 Michael Welter <me@mikinho.com>
 * @license MIT
 * @version 1.0.6
 */

(function () {
    "use strict";

    // This string will be replaced by the GitHub Action
    const VERSION = "1.0.6";

    const CONFIG = {
        version: VERSION, 
        ancestorClass: "is-ancestor",
        activeClass: "is-active",
        ignoredParams: [
            "utm_source", "utm_medium", "utm_campaign", 
            "fbclid", "gclid", "ref"
        ]
    };

    /**
     * Helper: Removes trailing slash from a path string 
     * unless it is the root "/".
     */
    function stripTrailingSlash(pathname) {
        if (pathname.length > 1 && pathname.endsWith("/")) {
            return pathname.slice(0, -1);
        }
        return pathname;
    }

    /**
     * Cleans a URL string by removing ignored parameters
     * and normalizing trailing slashes.
     */
    function getCleanUrl(urlString) {
        try {
            const url = new URL(urlString, window.location.origin);
            
            // Normalize Slash (e.g. "/foo/" -> "/foo")
            url.pathname = stripTrailingSlash(url.pathname);

            // Clean Params
            if (url.search) {
                const params = url.searchParams;
                // Remove ignored params
                for (let i = 0; i < CONFIG.ignoredParams.length; i++) {
                    params.delete(CONFIG.ignoredParams[i]);
                }
                // Sort for consistency
                params.sort();
            }

            return url.href;
        } catch (e) {
            return urlString;
        }
    }

    function setActiveClasses() {
        const loc = window.location;
        const currentOrigin = loc.origin;
        
        // Prepare current URL: Clean params and normalize slashes
        const currentUrl = getCleanUrl(loc.href);

        const links = document.links;
        
        // Cached length loop for performance
        for (let i = 0, len = links.length; i < len; ++i) {
            const link = links[i];

            // Protocol Check
            // Skip mailto:, tel:, javascript:, etc. immediately
            if (link.protocol !== "http:" && link.protocol !== "https:") {
                continue;
            }

            // Origin Check
            // Skip external links
            if (link.origin !== currentOrigin) {
                continue;
            }

            let linkUrl;

            // Fast Path vs Full Parse
            // If no query string, we can do simple string manipulation 
            if (!link.search) {
                const cleanPath = stripTrailingSlash(link.pathname);
                linkUrl = link.origin + cleanPath + link.hash;
            } else {
                linkUrl = getCleanUrl(link.href);
            }

            // Check for hierarchy match (Starts With)
            // Prevent root "/" from matching everything by ensuring length difference
            if (linkUrl.length > currentOrigin.length + 1 && currentUrl.startsWith(linkUrl)) {
                link.classList.add(CONFIG.ancestorClass);
            }

            // Check for exact match
            if (currentUrl === linkUrl) {
                link.classList.add(CONFIG.activeClass);
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setActiveClasses);
    } else {
        setActiveClasses();
    }
})();