/**
 * active-links.js
 * High-performance active class toggling for modern browsers.
 *
 * @copyright 2025 Michael Welter <me@mikinho.com>
 * @license MIT
 * @version __VERSION__
 */

(function () {
    "use strict";

    // This string will be replaced by the GitHub Action
    const VERSION = "__VERSION__";

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
                for (let i = 0; i < CONFIG.ignoredParams.length; ++i) {
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

    /**
     * Removes active/ancestor classes from ALL elements.
     * efficient: Only touches elements that actually have the class.
     */
    function removeActiveClasses() {
        const selector = `.${CONFIG.activeClass}, .${CONFIG.ancestorClass}`;
        const activeElements = document.querySelectorAll(selector);
        
        for (let i = 0; i < activeElements.length; ++i) {
            activeElements[i].classList.remove(CONFIG.activeClass, CONFIG.ancestorClass);
        }
    }

    /**
     * Where the magic happens. Iterate over links and add 
     * classes for active and ancestor links
     */
    function setActiveClasses() {
        // Clean up old state first
        removeActiveClasses();

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

    /**
     * Initialize listeners and Monkey Patch History API
     * so we detect SPA navigation (React, Vue, Next.js, etc.)
     */
    function init() {
        // Run on initial load
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", setActiveClasses);
        } else {
            setActiveClasses();
        }

        // Listen for Back/Forward button clicks
        window.addEventListener("popstate", setActiveClasses);

        // Monkey patch pushState and replaceState
        const originalPushState = history.pushState;
        history.pushState = function () {
            originalPushState.apply(this, arguments);
            setTimeout(setActiveClasses, 0);
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function () {
            originalReplaceState.apply(this, arguments);
            setTimeout(setActiveClasses, 0);
        };
    }

    // Start the engine
    init();
})();