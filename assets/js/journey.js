/* =========================================================
   DR. YAHYA ETHAWI
   PREMIUM HEALTHCARE + INNOVATION WEBSITE
   PROFESSIONAL JOURNEY INTERACTION
   GSAP + SCROLLTRIGGER
   ========================================================= */

(() => {
    "use strict";


    /* =====================================================
       01. DOM
       ===================================================== */

    const journey = document.querySelector(
        "[data-journey]"
    );

    if (!journey) {
        return;
    }


    const track = journey.querySelector(
        ".journey__track"
    );

    const progress = journey.querySelector(
        ".journey__progress"
    );

    const items = Array.from(
        journey.querySelectorAll(
            "[data-journey-item]"
        )
    );

    const nodes = Array.from(
        journey.querySelectorAll(
            ".timeline-node"
        )
    );


    if (
        !track ||
        !progress ||
        !items.length ||
        !nodes.length
    ) {
        return;
    }


    /* =====================================================
       02. GSAP AVAILABILITY
       ===================================================== */

    const hasGSAP =
        typeof window.gsap !== "undefined";

    const hasScrollTrigger =
        hasGSAP &&
        typeof window.ScrollTrigger !== "undefined";


    if (!hasGSAP) {

        /*
         * Static fallback:
         * keep first milestone active and timeline visible.
         */

        progress.style.width = "100%";

        items[0]?.classList.add("is-active");
        nodes[0]?.classList.add("is-active");

        return;
    }


    if (hasScrollTrigger) {

        gsap.registerPlugin(
            ScrollTrigger
        );

    }


    /* =====================================================
       03. STATE
       ===================================================== */

    let currentIndex = 0;
    let isMobile = false;


    /* =====================================================
       04. BREAKPOINT
       -----------------------------------------------------
       992px matches the responsive architecture where the
       horizontal Journey changes to its vertical form.
       ===================================================== */

    const getIsMobile = () => {
        return window.matchMedia(
            "(max-width: 992px)"
        ).matches;
    };


    /* =====================================================
       05. ACTIVE ITEM
       ===================================================== */

    const setActiveItem = (index) => {

        const safeIndex = Math.max(
            0,
            Math.min(index, items.length - 1)
        );


        currentIndex = safeIndex;


        items.forEach(
            (item, itemIndex) => {

                item.classList.toggle(
                    "is-active",
                    itemIndex === safeIndex
                );

            }
        );


        nodes.forEach(
            (node, nodeIndex) => {

                node.classList.toggle(
                    "is-active",
                    nodeIndex <= safeIndex
                );

            }
        );

    };


    /* =====================================================
       06. CALCULATE JOURNEY PROGRESS
       ===================================================== */

    const calculateProgress = (self) => {

        if (!self) {
            return 0;
        }

        return Math.max(
            0,
            Math.min(
                1,
                self.progress
            )
        );

    };


    /* =====================================================
       07. UPDATE HORIZONTAL PROGRESS
       ===================================================== */

    const updateHorizontalProgress = (value) => {

        if (!progress) {
            return;
        }


        progress.style.width =
            `${value * 100}%`;

    };


    /* =====================================================
       08. UPDATE VERTICAL PROGRESS
       ===================================================== */

    const updateVerticalProgress = (value) => {

        if (!progress) {
            return;
        }


        progress.style.height =
            `${value * 100}%`;

    };


    /* =====================================================
       09. DETERMINE ACTIVE MILESTONE
       ===================================================== */

    const calculateActiveIndex = (value) => {

        if (items.length <= 1) {
            return 0;
        }


        const scaled =
            value * (items.length - 1);


        /*
         * Slightly bias the activation forward so the next
         * milestone becomes active naturally as the user
         * approaches it.
         */

        return Math.min(
            items.length - 1,
            Math.round(scaled)
        );

    };


    /* =====================================================
       10. DESKTOP JOURNEY
       ===================================================== */

    const initDesktopJourney = () => {

        if (!hasScrollTrigger) {
            return null;
        }


        const trigger = {
            trigger: journey,
            start: "top 70%",
            end: "bottom 72%",
            scrub: 0.5,
            invalidateOnRefresh: true,

            onUpdate: (self) => {

                const value =
                    calculateProgress(self);


                updateHorizontalProgress(
                    value
                );


                setActiveItem(
                    calculateActiveIndex(
                        value
                    )
                );

            },

            onLeaveBack: () => {

                updateHorizontalProgress(0);

                setActiveItem(0);

            },

            onEnter: () => {

                setActiveItem(0);

            }

        };


        return ScrollTrigger.create(
            trigger
        );

    };


    /* =====================================================
       11. MOBILE JOURNEY
       ===================================================== */

    const initMobileJourney = () => {

        if (!hasScrollTrigger) {
            return null;
        }


        const trigger = {
            trigger: journey,
            start: "top 76%",
            end: "bottom 72%",
            scrub: 0.5,
            invalidateOnRefresh: true,

            onUpdate: (self) => {

                const value =
                    calculateProgress(self);


                updateVerticalProgress(
                    value
                );


                setActiveItem(
                    calculateActiveIndex(
                        value
                    )
                );

            },

            onLeaveBack: () => {

                updateVerticalProgress(0);

                setActiveItem(0);

            },

            onEnter: () => {

                setActiveItem(0);

            }

        };


        return ScrollTrigger.create(
            trigger
        );

    };


    /* =====================================================
       12. INTERACTIVE ITEM HOVER / FOCUS
       -----------------------------------------------------
       This does not replace scroll progression. It gives
       pointer and keyboard users immediate feedback.
       ===================================================== */

    const initItemInteractions = () => {

        items.forEach(
            (item, index) => {

                item.addEventListener(
                    "mouseenter",
                    () => {

                        setActiveItem(index);

                    }
                );


                item.addEventListener(
                    "focusin",
                    () => {

                        setActiveItem(index);

                    }
                );

            }
        );

    };


    /* =====================================================
       13. TIMELINE NODE INTERACTIONS
       ===================================================== */

    const initNodeInteractions = () => {

        nodes.forEach(
            (node, index) => {

                node.addEventListener(
                    "click",
                    () => {

                        setActiveItem(index);

                    }
                );

            }
        );

    };


    /* =====================================================
       14. RESET PROGRESS AXIS
       ===================================================== */

    const resetProgressAxis = () => {

        isMobile = getIsMobile();


        if (!progress) {
            return;
        }


        if (isMobile) {

            progress.style.width = "1px";

            if (!progress.style.height) {
                progress.style.height = "0";
            }

        } else {

            progress.style.height = "1px";

            if (!progress.style.width) {
                progress.style.width = "0";
            }

        }

    };


    /* =====================================================
       15. SCROLLTRIGGER REFERENCE
       ===================================================== */

    let scrollTriggerInstance = null;


    /* =====================================================
       16. BUILD JOURNEY
       ===================================================== */

    const buildJourney = () => {

        isMobile = getIsMobile();


        /*
         * Remove previous ScrollTrigger instance so the
         * direction can safely change after a resize.
         */

        if (scrollTriggerInstance) {

            scrollTriggerInstance.kill();

            scrollTriggerInstance = null;

        }


        resetProgressAxis();


        if (hasScrollTrigger) {

            scrollTriggerInstance =
                isMobile
                    ? initMobileJourney()
                    : initDesktopJourney();

        }


        /*
         * Restore the currently selected milestone after
         * rebuilding.
         */

        setActiveItem(
            Math.min(
                currentIndex,
                items.length - 1
            )
        );


        if (hasScrollTrigger) {

            ScrollTrigger.refresh();

        }

    };


    /* =====================================================
       17. RESIZE HANDLING
       ===================================================== */

    let resizeTimer = null;

    window.addEventListener(
        "resize",
        () => {

            window.clearTimeout(
                resizeTimer
            );


            resizeTimer =
                window.setTimeout(
                    () => {

                        const nextMode =
                            getIsMobile();


                        if (
                            nextMode !== isMobile
                        ) {

                            buildJourney();

                        } else if (
                            hasScrollTrigger
                        ) {

                            ScrollTrigger.refresh();

                        }

                    },
                    180
                );

        },
        {
            passive: true
        }
    );


    /* =====================================================
       18. INITIALIZE
       ===================================================== */

    setActiveItem(0);

    initItemInteractions();

    initNodeInteractions();

    buildJourney();


})();