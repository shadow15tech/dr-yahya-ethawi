/* =========================================================
   SHADOW15 — DR. YAHYA ETHAWI
   GLOBAL SITE CONTROLLER
   ---------------------------------------------------------
   Responsibilities:
   - Global JavaScript boot sequence
   - Dependency readiness
   - Site-level state
   - Accessibility / performance safeguards
   - Global resize / visibility handling
   - Custom lifecycle events
   ========================================================= */

(() => {
  "use strict";

  const APP = {
    name: "Dr. Yahya Ethawi",
    version: "1.0.0"
  };

  const state = {
    ready: false,
    isVisible: !document.hidden,
    isReducedMotion: false,
    width: window.innerWidth,
    height: window.innerHeight
  };

  const SELECTORS = {
    page: "body",
    main: "main",
    sections: "main > section",
    footer: ".site-footer"
  };

  /* ---------------------------------------------------------
     HELPERS
  --------------------------------------------------------- */

  const $ = (selector, scope = document) =>
    scope.querySelector(selector);

  const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

  const dispatch = (
    eventName,
    detail = {}
  ) => {
    document.dispatchEvent(
      new CustomEvent(eventName, {
        detail
      })
    );
  };

  /* ---------------------------------------------------------
     REDUCED MOTION
  --------------------------------------------------------- */

  const setupMotionPreference = () => {
    const mediaQuery = window.matchMedia
      ? window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        )
      : null;

    state.isReducedMotion =
      Boolean(mediaQuery?.matches);

    document.documentElement.classList.toggle(
      "reduce-motion",
      state.isReducedMotion
    );

    if (!mediaQuery) return;

    const handleChange = (event) => {
      state.isReducedMotion =
        event.matches;

      document.documentElement.classList.toggle(
        "reduce-motion",
        state.isReducedMotion
      );

      dispatch(
        "site:motionchange",
        {
          reducedMotion:
            state.isReducedMotion
        }
      );
    };

    if (
      typeof mediaQuery.addEventListener ===
      "function"
    ) {
      mediaQuery.addEventListener(
        "change",
        handleChange
      );
    } else if (
      typeof mediaQuery.addListener ===
      "function"
    ) {
      mediaQuery.addListener(
        handleChange
      );
    }
  };

  /* ---------------------------------------------------------
     BASIC ENVIRONMENT CHECK
  --------------------------------------------------------- */

  const checkEnvironment = () => {
    const body = $(
      SELECTORS.page
    );

    if (!body) return;

    body.classList.add(
      "js-enabled"
    );

    /*
     Marks browsers where JavaScript is active.
    */
    document.documentElement.dataset.js =
      "enabled";

    /*
     Helps CSS react to touch-capable devices
     without changing layout.
    */
    const touchCapable =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    document.documentElement.classList.toggle(
      "touch-device",
      touchCapable
    );
  };

  /* ---------------------------------------------------------
     DEPENDENCY REPORT
  --------------------------------------------------------- */

  const checkDependencies = () => {
    const dependencies = {
      gsap:
        typeof window.gsap !==
        "undefined",

      scrollTrigger:
        typeof window.ScrollTrigger !==
        "undefined",

      three:
        typeof window.THREE !==
        "undefined"
    };

    /*
     GSAP and ScrollTrigger are expected.
     Three.js is intentionally optional.
    */
    if (!dependencies.gsap) {
      console.warn(
        "[Dr. Yahya] GSAP is unavailable. " +
        "Animated interactions will use graceful fallbacks."
      );
    }

    if (!dependencies.scrollTrigger) {
      console.warn(
        "[Dr. Yahya] ScrollTrigger is unavailable. " +
        "Scroll-driven effects may be reduced."
      );
    }

    /*
     Do not warn about missing Three.js as an error.
     It is intentionally selective and optional.
    */

    window.__YAHYA_DEPENDENCIES__ =
      dependencies;

    dispatch(
      "site:dependencies",
      dependencies
    );
  };

  /* ---------------------------------------------------------
     GLOBAL VIEWPORT STATE
  --------------------------------------------------------- */

  let resizeTimer = null;

  const updateViewportState = () => {
    state.width =
      window.innerWidth;

    state.height =
      window.innerHeight;

    document.documentElement.style.setProperty(
      "--viewport-height",
      `${window.innerHeight}px`
    );

    document.documentElement.dataset.viewport =
      state.width < 576
        ? "mobile"
        : state.width < 992
        ? "tablet"
        : "desktop";
  };

  const handleResize = () => {
    window.clearTimeout(
      resizeTimer
    );

    resizeTimer = window.setTimeout(
      () => {
        updateViewportState();

        dispatch(
          "site:resize",
          {
            width: state.width,
            height: state.height
          }
        );
      },
      160
    );
  };

  /* ---------------------------------------------------------
     PAGE VISIBILITY
  --------------------------------------------------------- */

  const setupVisibilityHandling = () => {
    document.addEventListener(
      "visibilitychange",
      () => {
        state.isVisible =
          !document.hidden;

        document.documentElement.classList.toggle(
          "page-hidden",
          document.hidden
        );

        dispatch(
          "site:visibilitychange",
          {
            visible:
              state.isVisible
          }
        );
      }
    );
  };

  /* ---------------------------------------------------------
     EXTERNAL LINK SAFETY
  --------------------------------------------------------- */

  const setupExternalLinks = () => {
    const links = $$(
      "a[href^='http://'], " +
        "a[href^='https://']"
    );

    links.forEach((link) => {
      const href =
        link.getAttribute("href");

      if (!href) return;

      let url;

      try {
        url = new URL(
          href,
          window.location.href
        );
      } catch {
        return;
      }

      const isExternal =
        url.origin !==
        window.location.origin;

      if (!isExternal) return;

      /*
       Do not override links that explicitly
       define their own target/relationship.
      */
      if (
        !link.hasAttribute("target")
      ) {
        link.setAttribute(
          "target",
          "_blank"
        );
      }

      const currentRel =
        link.getAttribute("rel") || "";

      const relValues =
        new Set(
          currentRel
            .split(/\s+/)
            .filter(Boolean)
        );

      relValues.add("noopener");
      relValues.add("noreferrer");

      link.setAttribute(
        "rel",
        Array.from(
          relValues
        ).join(" ")
      );
    });
  };

  /* ---------------------------------------------------------
     IMAGE LOADING BEHAVIOR
  --------------------------------------------------------- */

  const optimizeImages = () => {
    const images =
      $$("img");

    images.forEach(
      (image, index) => {
        /*
         Don't alter explicitly defined eager loading.
        */
        if (
          !image.hasAttribute(
            "loading"
          )
        ) {
          image.setAttribute(
            "loading",
            index < 2
              ? "eager"
              : "lazy"
          );
        }

        if (
          !image.hasAttribute(
            "decoding"
          )
        ) {
          image.setAttribute(
            "decoding",
            "async"
          );
        }
      }
    );
  };

  /* ---------------------------------------------------------
     FOCUS VISIBILITY
  --------------------------------------------------------- */

  const setupKeyboardDetection = () => {
    let keyboardNavigation =
      false;

    document.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Tab" ||
          event.key.startsWith(
            "Arrow"
          )
        ) {
          keyboardNavigation =
            true;

          document.documentElement.classList.add(
            "keyboard-user"
          );
        }
      }
    );

    document.addEventListener(
      "pointerdown",
      () => {
        keyboardNavigation =
          false;

        document.documentElement.classList.remove(
          "keyboard-user"
        );
      },
      {
        passive: true
      }
    );

    /*
     Avoid unused-state warnings while retaining
     explicit state semantics.
    */
    void keyboardNavigation;
  };

  /* ---------------------------------------------------------
     SECTION OBSERVABILITY
  --------------------------------------------------------- */

  const setupSectionObserver = () => {
    const sections = $$(
      SELECTORS.sections
    );

    if (!sections.length) return;

    /*
     IntersectionObserver is only used to expose
     semantic visibility state. It does not replace
     GSAP animation logic.
    */
    if (
      typeof IntersectionObserver ===
      "undefined"
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              entry.target.classList.toggle(
                "is-in-view",
                entry.isIntersecting
              );

              if (
                entry.isIntersecting
              ) {
                dispatch(
                  "site:sectionenter",
                  {
                    section:
                      entry.target.id ||
                      entry.target.dataset
                        .section ||
                      null
                  }
                );
              }
            }
          );
        },
        {
          root: null,
          rootMargin:
            "0px 0px -15% 0px",
          threshold: 0.08
        }
      );

    sections.forEach(
      (section) => {
        observer.observe(
          section
        );
      }
    );
  };

  /* ---------------------------------------------------------
     YEAR FALLBACK
     --------------------------------------------------------- */

  const setupYearFallback = () => {
    const yearNodes = $$(
      "[data-current-year]"
    );

    if (!yearNodes.length) return;

    const year =
      new Date().getFullYear();

    yearNodes.forEach(
      (node) => {
        node.textContent =
          String(year);
      }
    );
  };

  /* ---------------------------------------------------------
     GLOBAL ERROR VISIBILITY
  --------------------------------------------------------- */

  const setupRuntimeDiagnostics = () => {
    window.addEventListener(
      "error",
      (event) => {
        /*
         Development diagnostics only.
         Do not interrupt the visitor experience.
        */
        if (
          window.location.hostname ===
            "localhost" ||
          window.location.hostname ===
            "127.0.0.1"
        ) {
          console.warn(
            "[Dr. Yahya] Runtime error:",
            event.error ||
              event.message
          );
        }
      }
    );

    window.addEventListener(
      "unhandledrejection",
      (event) => {
        if (
          window.location.hostname ===
            "localhost" ||
          window.location.hostname ===
            "127.0.0.1"
        ) {
          console.warn(
            "[Dr. Yahya] Promise rejection:",
            event.reason
          );
        }
      }
    );
  };

  /* ---------------------------------------------------------
     GLOBAL CSS STATE
  --------------------------------------------------------- */

  const setupGlobalState = () => {
    document.documentElement.dataset.site =
      "dr-yahya-ethawi";

    document.documentElement.dataset.version =
      APP.version;

    updateViewportState();
  };

  /* ---------------------------------------------------------
     APPLICATION READY
  --------------------------------------------------------- */

  const markReady = () => {
    state.ready = true;

    document.documentElement.classList.add(
      "site-ready"
    );

    dispatch(
      "site:ready",
      {
        app: APP.name,
        version:
          APP.version
      }
    );

    /*
     Expose only a small read-only-ish state surface
     for debugging and future modules.
    */
    window.YahyaSite = {
      version:
        APP.version,

      getState() {
        return {
          ...state
        };
      }
    };
  };

  /* ---------------------------------------------------------
     BOOT SEQUENCE
  --------------------------------------------------------- */

  const boot = () => {
    setupGlobalState();
    checkEnvironment();
    setupMotionPreference();
    checkDependencies();

    setupVisibilityHandling();
    setupKeyboardDetection();
    setupExternalLinks();
    optimizeImages();
    setupSectionObserver();
    setupYearFallback();
    setupRuntimeDiagnostics();

    window.addEventListener(
      "resize",
      handleResize,
      {
        passive: true
      }
    );

    /*
     Notify already-loaded modules that the global
     controller has completed initialization.
    */
    markReady();
  };

  /* ---------------------------------------------------------
     START
  --------------------------------------------------------- */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      boot,
      {
        once: true
      }
    );
  } else {
    boot();
  }

})();