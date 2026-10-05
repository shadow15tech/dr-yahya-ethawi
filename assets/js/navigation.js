/* =========================================================
   DR. YAHYA ETHAWI
   PREMIUM HEALTHCARE + INNOVATION WEBSITE
   NAVIGATION SYSTEM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";


    /* =====================================================
       01. ELEMENT REFERENCES
       ===================================================== */

    const header = document.querySelector("#site-header");
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const mobileMenu = document.querySelector("#mobile-menu");

    const desktopNavLinks = document.querySelectorAll(
        "[data-nav-link]"
    );

    const mobileNavLinks = document.querySelectorAll(
        "[data-mobile-nav-link]"
    );

    const allAnchorLinks = document.querySelectorAll(
        'a[href^="#"]'
    );


    /* =====================================================
       02. STATE
       ===================================================== */

    let isMenuOpen = false;
    let lastScrollY = window.scrollY;
    let scrollTicking = false;


    /* =====================================================
       03. UTILITY
       ===================================================== */

    const getScrollHeaderOffset = () => {
        const headerHeight = header?.offsetHeight || 0;

        return headerHeight + 16;
    };


    const getTargetFromLink = (link) => {
        if (!link) {
            return null;
        }

        const href = link.getAttribute("href");

        if (!href || href === "#") {
            return null;
        }

        let target = null;

        try {
            target = document.querySelector(href);
        } catch (error) {
            return null;
        }

        return target;
    };


    const lockBodyScroll = () => {
        document.body.style.overflow = "hidden";
        document.documentElement.classList.add("menu-is-open");
    };


    const unlockBodyScroll = () => {
        document.body.style.overflow = "";
        document.documentElement.classList.remove("menu-is-open");
    };


    /* =====================================================
       04. MOBILE MENU
       ===================================================== */

    const openMobileMenu = () => {
        if (!menuToggle || !mobileMenu) {
            return;
        }

        isMenuOpen = true;

        mobileMenu.classList.add("is-open");
        menuToggle.classList.add("is-active");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

        lockBodyScroll();
    };


    const closeMobileMenu = () => {
        if (!menuToggle || !mobileMenu) {
            return;
        }

        isMenuOpen = false;

        mobileMenu.classList.remove("is-open");
        menuToggle.classList.remove("is-active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

        unlockBodyScroll();
    };


    const toggleMobileMenu = () => {
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    };


    if (menuToggle && mobileMenu) {

        menuToggle.addEventListener(
            "click",
            toggleMobileMenu
        );

    }


    /* =====================================================
       05. CLOSE MOBILE MENU AFTER LINK CLICK
       ===================================================== */

    mobileNavLinks.forEach((link) => {

        link.addEventListener("click", () => {

            closeMobileMenu();

        });

    });


    /* =====================================================
       06. ESCAPE KEY
       ===================================================== */

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            isMenuOpen
        ) {

            closeMobileMenu();

            menuToggle?.focus();

        }

    });


    /* =====================================================
       07. RESIZE SAFETY
       ===================================================== */

    window.addEventListener("resize", () => {

        if (
            window.innerWidth > 992 &&
            isMenuOpen
        ) {

            closeMobileMenu();

        }

    });


    /* =====================================================
       08. SMOOTH ANCHOR NAVIGATION
       ===================================================== */

    allAnchorLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const href = link.getAttribute("href");

            if (
                !href ||
                href === "#" ||
                !href.startsWith("#")
            ) {
                return;
            }


            /*
             * The current HTML contains a "Contact" navigation
             * reference while the final CTA section uses
             * #final-cta. Handle that transition safely until
             * the final ID is standardized in the HTML.
             */

            let targetSelector = href;

            if (
                href === "#contact" &&
                !document.querySelector("#contact") &&
                document.querySelector("#final-cta")
            ) {
                targetSelector = "#final-cta";
            }


            let target = null;

            try {

                target = document.querySelector(
                    targetSelector
                );

            } catch (error) {

                return;

            }


            if (!target) {
                return;
            }


            event.preventDefault();


            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                getScrollHeaderOffset();


            window.scrollTo({
                top: Math.max(targetPosition, 0),
                behavior: "smooth"
            });


            /*
             * Close mobile menu after navigation.
             */

            if (isMenuOpen) {
                closeMobileMenu();
            }

        });

    });


    /* =====================================================
       09. HEADER SCROLL STATE
       ===================================================== */

    const updateHeaderState = () => {

        if (!header) {
            return;
        }

        const currentScrollY = window.scrollY;


        /* ---------------------------------------------
           Scrolled state
           --------------------------------------------- */

        if (currentScrollY > 32) {

            header.classList.add("is-scrolled");

        } else {

            header.classList.remove("is-scrolled");

        }


        /* ---------------------------------------------
           Header visibility
           --------------------------------------------- */

        const scrollingDown =
            currentScrollY > lastScrollY;

        const passedThreshold =
            currentScrollY > 160;


        if (
            scrollingDown &&
            passedThreshold &&
            !isMenuOpen
        ) {

            header.classList.add("is-hidden");

        } else {

            header.classList.remove("is-hidden");

        }


        lastScrollY = currentScrollY;

    };


    /* =====================================================
       10. OPTIMIZED SCROLL HANDLER
       ===================================================== */

    window.addEventListener("scroll", () => {

        if (!scrollTicking) {

            window.requestAnimationFrame(() => {

                updateHeaderState();

                scrollTicking = false;

            });

            scrollTicking = true;

        }

    }, {
        passive: true
    });


    /* =====================================================
       11. ACTIVE NAVIGATION
       ===================================================== */

    const navigationSections = [];

    desktopNavLinks.forEach((link) => {

        const href = link.getAttribute("href");

        if (
            !href ||
            !href.startsWith("#")
        ) {
            return;
        }


        let section = null;

        try {

            section = document.querySelector(href);

        } catch (error) {

            return;

        }


        /*
         * Contact fallback for current HTML structure.
         */

        if (
            href === "#contact" &&
            !section
        ) {

            section = document.querySelector(
                "#final-cta"
            );

        }


        if (section) {

            navigationSections.push({
                link,
                section
            });

        }

    });


    const setActiveNavigation = (activeSection) => {

        navigationSections.forEach(
            ({ link, section }) => {

                const isActive =
                    section === activeSection;

                link.classList.toggle(
                    "is-active",
                    isActive
                );

            }
        );


        mobileNavLinks.forEach((link) => {

            let href = link.getAttribute("href");

            if (
                href === "#contact" &&
                !document.querySelector("#contact") &&
                document.querySelector("#final-cta")
            ) {

                href = "#final-cta";

            }


            const isActive =
                href &&
                activeSection &&
                `#${activeSection.id}` === href;

            link.classList.toggle(
                "is-active",
                Boolean(isActive)
            );

        });

    };


    const updateActiveNavigation = () => {

        if (
            !navigationSections.length
        ) {
            return;
        }


        const activationPoint =
            window.scrollY +
            getScrollHeaderOffset() +
            window.innerHeight * 0.25;


        let activeSection =
            navigationSections[0].section;


        navigationSections.forEach(
            ({ section }) => {

                if (
                    section.offsetTop <= activationPoint
                ) {

                    activeSection = section;

                }

            }
        );


        setActiveNavigation(activeSection);

    };


    window.addEventListener("scroll", () => {

        if (!scrollTicking) {

            window.requestAnimationFrame(() => {

                updateActiveNavigation();

                scrollTicking = false;

            });

            scrollTicking = true;

        }

    }, {
        passive: true
    });


    /* =====================================================
       12. CURRENT YEAR
       ===================================================== */

    const currentYear = new Date()
        .getFullYear();

    document
        .querySelectorAll("[data-current-year]")
        .forEach((element) => {

            element.textContent = currentYear;

        });


    /* =====================================================
       13. INITIAL STATE
       ===================================================== */

    updateHeaderState();
    updateActiveNavigation();


    /* =====================================================
       14. INITIAL MOBILE ACCESSIBILITY STATE
       ===================================================== */

    if (mobileMenu) {

        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (menuToggle) {

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }

});