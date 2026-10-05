/* =========================================================
   DR. YAHYA ETHAWI
   PREMIUM HEALTHCARE + INNOVATION WEBSITE
   GLOBAL ANIMATION SYSTEM
   GSAP + SCROLLTRIGGER
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       01. SITE BOOT
       ===================================================== */

    const boot = () => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const preloader = document.querySelector("#preloader");
        const hero = document.querySelector("#hero");

        const hasGSAP = typeof window.gsap !== "undefined";
        const hasScrollTrigger =
            hasGSAP &&
            typeof window.ScrollTrigger !== "undefined";

        /* =====================================================
           02. STATIC FALLBACK
           -----------------------------------------------------
           The page must remain visible even when GSAP fails.
           ===================================================== */

        const showStaticPage = () => {
            document.querySelectorAll("[data-reveal]").forEach((element) => {
                element.style.opacity = "1";
                element.style.transform = "none";
            });

            if (preloader) {
                preloader.style.opacity = "0";
                preloader.style.pointerEvents = "none";
                preloader.style.visibility = "hidden";
                preloader.style.display = "none";
                preloader.setAttribute("aria-hidden", "true");
            }
        };

        if (!hasGSAP || prefersReducedMotion) {
            showStaticPage();
            return;
        }

        /* =====================================================
           03. GSAP / SCROLLTRIGGER
           ===================================================== */

        if (hasScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
        }

        gsap.defaults({
            ease: "power3.out",
            duration: 0.8
        });

        /* =====================================================
           04. PRELOADER
           -----------------------------------------------------
           This is deliberately independent of window.load.
           window.load is still used when available, but a
           hard safety timeout guarantees that the site can
           never remain trapped behind the preloader.
           ===================================================== */

        let preloaderHidden = false;
        let pageLoaded = false;

        const hidePreloader = () => {
            if (!preloader || preloaderHidden) {
                return;
            }

            preloaderHidden = true;

            const preloaderContent = preloader.querySelector(
                ".preloader__content"
            );

            const preloaderLine = preloader.querySelector(
                ".preloader__line"
            );

            const finish = () => {
                preloader.style.display = "none";
                preloader.style.visibility = "hidden";
                preloader.style.pointerEvents = "none";
                preloader.setAttribute("aria-hidden", "true");
            };

            const timeline = gsap.timeline({
                onComplete: finish,
                defaults: {
                    ease: "power3.inOut"
                }
            });

            if (preloaderLine) {
                timeline.to(
                    preloaderLine,
                    {
                        scaleX: 1,
                        duration: 0.55,
                        transformOrigin: "left center"
                    },
                    0
                );
            }

            if (preloaderContent) {
                timeline.to(
                    preloaderContent,
                    {
                        opacity: 0,
                        y: -12,
                        duration: 0.35
                    },
                    0.5
                );
            }

            timeline.to(
                preloader,
                {
                    opacity: 0,
                    duration: 0.65,
                    pointerEvents: "none"
                },
                0.72
            );
        };

        const startPageIntro = () => {
            if (pageLoaded) {
                return;
            }

            pageLoaded = true;
            hidePreloader();
        };

        /* Normal path: wait for the page load event. */
        if (document.readyState === "complete") {
            window.setTimeout(startPageIntro, 250);
        } else {
            window.addEventListener(
                "load",
                () => window.setTimeout(startPageIntro, 250),
                { once: true }
            );
        }

        /* Hard fallback: external assets must never trap the page. */
        window.setTimeout(startPageIntro, 3500);

        /* =====================================================
           05. HERO ENTRANCE
           ===================================================== */

        const initHeroAnimation = () => {
            if (!hero) {
                return;
            }

            const heroContent = hero.querySelectorAll(
                ".hero__eyebrow, " +
                ".hero__title, " +
                ".hero__role, " +
                ".hero__statement, " +
                ".hero__actions, " +
                ".hero__scroll"
            );

            const heroVisual = hero.querySelector(
                ".hero__portrait-wrap"
            );

            const heroFrame = hero.querySelector(
                ".hero__visual-frame"
            );

            const heroNodes = hero.querySelectorAll(
                ".hero__data-node"
            );

            const timeline = gsap.timeline({
                defaults: {
                    ease: "power3.out"
                },
                delay: 1.25
            });

            if (heroContent.length) {
                timeline.fromTo(
                    heroContent,
                    {
                        opacity: 0,
                        y: 35
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        stagger: 0.1
                    }
                );
            }

            if (heroVisual) {
                timeline.fromTo(
                    heroVisual,
                    {
                        opacity: 0,
                        scale: 0.97,
                        y: 20
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 1.1
                    },
                    "-=0.65"
                );
            }

            if (heroFrame) {
                timeline.fromTo(
                    heroFrame,
                    {
                        opacity: 0,
                        scale: 0.96
                    },
                    {
                        opacity: 0.6,
                        scale: 1,
                        duration: 1
                    },
                    "-=0.8"
                );
            }

            if (heroNodes.length) {
                timeline.fromTo(
                    heroNodes,
                    {
                        opacity: 0,
                        y: 8
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.12
                    },
                    "-=0.45"
                );
            }
        };

        /* =====================================================
           06. GENERIC SCROLL REVEALS
           ===================================================== */

        const initScrollReveals = () => {
            if (!hasScrollTrigger) {
                document.querySelectorAll("[data-reveal]").forEach((element) => {
                    gsap.set(element, {
                        opacity: 1,
                        y: 0,
                        scale: 1
                    });
                });
                return;
            }

            gsap.utils.toArray("[data-reveal]").forEach((element) => {
                if (hero && hero.contains(element)) {
                    return;
                }

                const revealType = element.dataset.reveal || "up";
                const fromVars = {
                    opacity: 0,
                    duration: 0.8
                };
                const toVars = {
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 88%",
                        once: true
                    }
                };

                if (revealType === "up") {
                    fromVars.y = "var(--motion-distance-md)";
                    toVars.y = 0;
                }

                if (revealType === "fade") {
                    fromVars.opacity = 0;
                    toVars.opacity = 1;
                }

                if (revealType === "scale") {
                    fromVars.scale = 0.97;
                    toVars.scale = 1;
                }

                gsap.fromTo(element, fromVars, toVars);
            });
        };

        /* =====================================================
           07. SECTION HEADER REVEALS
           ===================================================== */

        const initSectionHeaders = () => {
            if (!hasScrollTrigger) {
                return;
            }

            gsap.utils
                .toArray(
                    ".section-header, .academic__intro, .collaboration__content"
                )
                .forEach((header) => {
                    const divider = header.querySelector(
                        ".section-divider"
                    );
                    const title = header.querySelector("h2");
                    const description = header.querySelector("p");
                    const elements = [divider, title, description].filter(Boolean);

                    if (!elements.length) {
                        return;
                    }

                    gsap.fromTo(
                        elements,
                        {
                            opacity: 0,
                            y: 28
                        },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            stagger: 0.08,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: header,
                                start: "top 82%",
                                once: true
                            }
                        }
                    );
                });
        };

        /* =====================================================
           08. EXPERTISE
           ===================================================== */

        const initExpertiseAnimation = () => {
            if (!hasScrollTrigger) {
                return;
            }

            const items = gsap.utils.toArray(
                ".expertise__item"
            );

            if (!items.length) {
                return;
            }

            gsap.fromTo(
                items,
                {
                    opacity: 0,
                    y: 24
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.08,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".expertise__grid",
                        start: "top 82%",
                        once: true
                    }
                }
            );
        };

        /* =====================================================
           09. IDENTITY PILLARS
           ===================================================== */

        const initIdentityAnimation = () => {
            if (!hasScrollTrigger) {
                return;
            }

            const pillars = gsap.utils.toArray(
                ".identity__pillar"
            );

            if (!pillars.length) {
                return;
            }

            gsap.fromTo(
                pillars,
                {
                    opacity: 0,
                    y: 25
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.75,
                    stagger: 0.12,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".identity__pillars",
                        start: "top 82%",
                        once: true
                    }
                }
            );
        };

        /* =====================================================
           10. INNOVATION TRANSITION
           ===================================================== */

        const initInnovationTransition = () => {
            if (!hasScrollTrigger) {
                return;
            }

            const section = document.querySelector("#innovation");
            if (!section) {
                return;
            }

            const eyebrow = section.querySelector(
                ".innovation-transition__eyebrow"
            );
            const title = section.querySelector(
                ".innovation-transition__title"
            );
            const items = section.querySelectorAll(
                ".innovation-transition__item"
            );
            const result = section.querySelector(
                ".innovation-transition__result"
            );

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 72%",
                    once: true
                }
            });

            if (eyebrow) {
                timeline.fromTo(
                    eyebrow,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6 }
                );
            }

            if (title) {
                timeline.fromTo(
                    title,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.9 },
                    "-=0.3"
                );
            }

            if (items.length) {
                timeline.fromTo(
                    items,
                    { opacity: 0, y: 15 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.55,
                        stagger: 0.1
                    },
                    "-=0.35"
                );
            }

            if (result) {
                timeline.fromTo(
                    result,
                    { opacity: 0, y: 15 },
                    { opacity: 1, y: 0, duration: 0.7 },
                    "-=0.25"
                );
            }
        };

        /* =====================================================
           11. NOOR CAPABILITY REVEALS
           -----------------------------------------------------
           Global entrance only. Detailed interaction is in
           noor.js.
           ===================================================== */

        const initNoorCapabilities = () => {
            if (!hasScrollTrigger) {
                return;
            }

            const capabilityCards = gsap.utils.toArray(
                ".noor__capability"
            );

            if (!capabilityCards.length) {
                return;
            }

            gsap.fromTo(
                capabilityCards,
                {
                    opacity: 0,
                    y: 24
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.07,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".noor__capabilities",
                        start: "top 84%",
                        once: true
                    }
                }
            );
        };

        /* =====================================================
           12. STAT REVEALS
           ===================================================== */

        const initStatAnimation = () => {
            if (!hasScrollTrigger) {
                return;
            }

            const statCards = gsap.utils.toArray(
                ".stat-card"
            );

            if (!statCards.length) {
                return;
            }

            gsap.fromTo(
                statCards,
                {
                    opacity: 0,
                    y: 25
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.75,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".noor__stats",
                        start: "top 82%",
                        once: true
                    }
                }
            );
        };

        /* =====================================================
           13. MONITORING
           ===================================================== */

        const initMonitoringAnimation = () => {
            if (!hasScrollTrigger) {
                return;
            }

            const featured = document.querySelector(
                ".monitoring__featured"
            );

            const cards = gsap.utils.toArray(
                ".monitoring__data-card"
            );

            if (featured) {
                gsap.fromTo(
                    featured,
                    {
                        opacity: 0,
                        y: 28
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: featured,
                            start: "top 82%",
                            once: true
                        }
                    }
                );
            }

            if (cards.length) {
                gsap.fromTo(
                    cards,
                    {
                        opacity: 0,
                        y: 20
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.65,
                        stagger: 0.08,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: ".monitoring__visualization-grid",
                            start: "top 84%",
                            once: true
                        }
                    }
                );
            }
        };

        /* =====================================================
           14. HUMAN + AI
           ===================================================== */

        const initHumanAIAnimation = () => {
            if (!hasScrollTrigger) {
                return;
            }

            const items = gsap.utils.toArray(
                ".human-ai__item"
            );

            if (!items.length) {
                return;
            }

            gsap.fromTo(
                items,
                {
                    opacity: 0,
                    y: 20
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.65,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".human-ai__flow",
                        start: "top 82%",
                        once: true
                    }
                }
            );
        };

        /* =====================================================
           15. FUTURE VISION
           ===================================================== */

        const initFutureAnimation = () => {
            if (!hasScrollTrigger) {
                return;
            }

            const stages = gsap.utils.toArray(
                ".future__stage"
            );

            if (!stages.length) {
                return;
            }

            gsap.fromTo(
                stages,
                {
                    opacity: 0,
                    y: 28
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.14,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".future__stages",
                        start: "top 82%",
                        once: true
                    }
                }
            );

            const visionNote = document.querySelector(
                ".future__vision-note"
            );

            if (visionNote) {
                gsap.fromTo(
                    visionNote,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 0.7,
                        scrollTrigger: {
                            trigger: visionNote,
                            start: "top 88%",
                            once: true
                        }
                    }
                );
            }
        };

        /* =====================================================
           16. COLLABORATION
           ===================================================== */

        const initCollaborationAnimation = () => {
            if (!hasScrollTrigger) {
                return;
            }

            const fields = gsap.utils.toArray(
                ".collaboration__field"
            );

            if (!fields.length) {
                return;
            }

            gsap.fromTo(
                fields,
                {
                    opacity: 0,
                    x: 20
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.65,
                    stagger: 0.08,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".collaboration__fields",
                        start: "top 82%",
                        once: true
                    }
                }
            );
        };

        /* =====================================================
           17. VIDEO
           ===================================================== */

        const initVideoAnimation = () => {
            if (!hasScrollTrigger) {
                return;
            }

            const videoFrame = document.querySelector(
                ".video-section__frame"
            );

            if (!videoFrame) {
                return;
            }

            gsap.fromTo(
                videoFrame,
                {
                    opacity: 0,
                    y: 25,
                    scale: 0.985
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: videoFrame,
                        start: "top 84%",
                        once: true
                    }
                }
            );
        };

        /* =====================================================
           18. FINAL CTA
           ===================================================== */

        const initFinalCTA = () => {
            if (!hasScrollTrigger) {
                return;
            }

            const section = document.querySelector(
                "#final-cta"
            );

            if (!section) {
                return;
            }

            const title = section.querySelector(
                ".final-cta__title"
            );
            const description = section.querySelector(
                ".final-cta__description"
            );
            const actions = section.querySelector(
                ".final-cta__actions"
            );

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 72%",
                    once: true
                }
            });

            if (title) {
                timeline.fromTo(
                    title,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 1 }
                );
            }

            if (description) {
                timeline.fromTo(
                    description,
                    { opacity: 0, y: 15 },
                    { opacity: 1, y: 0, duration: 0.65 },
                    "-=0.45"
                );
            }

            if (actions) {
                timeline.fromTo(
                    actions,
                    { opacity: 0, y: 15 },
                    { opacity: 1, y: 0, duration: 0.65 },
                    "-=0.3"
                );
            }
        };

        /* =====================================================
           19. SUBTLE BACKGROUND PARALLAX
           -----------------------------------------------------
           Very restrained. Disabled on touch / coarse pointer.
           ===================================================== */

        const initParallax = () => {
            if (!hasScrollTrigger) {
                return;
            }

            const canUseParallax = window.matchMedia(
                "(hover: hover) and (pointer: fine)"
            ).matches;

            if (!canUseParallax) {
                return;
            }

            const heroOrb = document.querySelector(
                ".hero__orb"
            );

            if (heroOrb) {
                gsap.to(heroOrb, {
                    y: 60,
                    ease: "none",
                    scrollTrigger: {
                        trigger: "#hero",
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }
        };

        /* =====================================================
           20. FOOTER
           ===================================================== */

        const initFooterAnimation = () => {
            if (!hasScrollTrigger) {
                return;
            }

            const footer = document.querySelector(
                ".site-footer"
            );

            if (!footer) {
                return;
            }

            const identity = footer.querySelector(
                ".site-footer__identity"
            );
            const links = footer.querySelector(
                ".site-footer__links"
            );
            const elements = [identity, links].filter(Boolean);

            if (!elements.length) {
                return;
            }

            gsap.fromTo(
                elements,
                {
                    opacity: 0,
                    y: 18
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: footer,
                        start: "top 88%",
                        once: true
                    }
                }
            );
        };

        /* =====================================================
           21. INITIALIZE GLOBAL ANIMATIONS
           ===================================================== */

        const initAnimations = () => {
            initHeroAnimation();
            initScrollReveals();
            initSectionHeaders();
            initIdentityAnimation();
            initExpertiseAnimation();
            initInnovationTransition();
            initNoorCapabilities();
            initStatAnimation();
            initMonitoringAnimation();
            initHumanAIAnimation();
            initFutureAnimation();
            initCollaborationAnimation();
            initVideoAnimation();
            initFinalCTA();
            initParallax();
            initFooterAnimation();

            if (hasScrollTrigger) {
                window.requestAnimationFrame(() => {
                    ScrollTrigger.refresh();
                });
            }
        };

        initAnimations();
    };

    /* =====================================================
       22. DOM READY
       -----------------------------------------------------
       Prevents the script from querying the DOM too early.
       ===================================================== */

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, {
            once: true
        });
    } else {
        boot();
    }
})();
