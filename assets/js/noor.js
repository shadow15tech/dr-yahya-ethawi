/* =========================================================
   SHADOW15 — DR. YAHYA ETHAWI
   NOOR EMAD INTERACTION ENGINE
   ---------------------------------------------------------
   Handles:
   - NOOR central experience
   - Capability interactions
   - NOOR process / 10-stage pathway
   - Conceptual monitoring/data interactions
   - Future vision interaction
   - Optional selective Three.js experience
   - Mobile-safe behavior
   - Reduced-motion support
   ========================================================= */

(() => {
  "use strict";

  const SELECTORS = {
    noor: "[data-noor], .noor",
    experience: ".noor__experience",
    core: ".noor__core",
    orbit: ".noor__orbit",
    capability: "[data-noor-capability], .noor__capability",
    stat: "[data-noor-stat], .noor__stat",
    process: "[data-noor-process], .noor-process",
    processItem:
      "[data-process-step], [data-noor-step], [data-noor-process-item], .noor-process__step, .noor-process__item",
    future: "[data-future], .future",
    futureStage:
      "[data-future-stage], [data-future-item], .future__stage",
    network:
      "[data-noor-network], .noor__network, [data-noor-canvas]"
  };

  const CONFIG = {
    mobileBreakpoint: 768,
    tabletBreakpoint: 992,
    hoverScale: 1.035,
    activeScale: 1.045,
    orbRotateDuration: 45,
    reducedMotion:
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  const state = {
    isMobile: window.innerWidth < CONFIG.mobileBreakpoint,
    isTablet: window.innerWidth < CONFIG.tabletBreakpoint,
    activeCapability: null,
    activeProcess: 0,
    activeFuture: null,
    threeInstance: null
  };

  /* ---------------------------------------------------------
     UTILITIES
  --------------------------------------------------------- */

  const $ = (selector, scope = document) =>
    scope.querySelector(selector);

  const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  const hasGSAP = () =>
    typeof window.gsap !== "undefined";

  const hasScrollTrigger = () =>
    typeof window.ScrollTrigger !== "undefined";

  const shouldAnimate = () =>
    !CONFIG.reducedMotion;

  const isTouchDevice = () =>
    window.matchMedia &&
    window.matchMedia("(hover: none)").matches;

  const waitForElement = (selector, callback, attempts = 60) => {
    const element = $(selector);

    if (element) {
      callback(element);
      return;
    }

    if (attempts <= 0) return;

    window.setTimeout(() => {
      waitForElement(selector, callback, attempts - 1);
    }, 100);
  };

  /* ---------------------------------------------------------
     RESPONSIVE STATE
  --------------------------------------------------------- */

  const updateResponsiveState = () => {
    state.isMobile =
      window.innerWidth < CONFIG.mobileBreakpoint;

    state.isTablet =
      window.innerWidth < CONFIG.tabletBreakpoint;
  };

  /* ---------------------------------------------------------
     ACCESSIBILITY HELPERS
  --------------------------------------------------------- */

  const setAriaState = (element, expanded) => {
    if (!element) return;

    if (
      element.matches(
        "button, [role='button'], [aria-expanded]"
      )
    ) {
      element.setAttribute(
        "aria-expanded",
        String(expanded)
      );
    }
  };

  const setActiveClass = (
    collection,
    activeElement,
    className = "is-active"
  ) => {
    collection.forEach((item) => {
      item.classList.toggle(
        className,
        item === activeElement
      );
    });
  };

  /* ---------------------------------------------------------
     NOOR CORE / CENTRAL EXPERIENCE
  --------------------------------------------------------- */

  const initNoorCore = () => {
    const section = $(SELECTORS.noor);
    const experience = $(
      SELECTORS.experience,
      section || document
    );

    if (!section || !experience) return;

    const core = $(SELECTORS.core, experience);
    const orbits = $$(SELECTORS.orbit, experience);

    /*
     Controlled orbital motion.
     Only activates when reduced-motion is disabled.
    */
    if (
      shouldAnimate() &&
      hasGSAP() &&
      orbits.length &&
      !state.isMobile
    ) {
      orbits.forEach((orbit, index) => {
        const reverse = index % 2 !== 0;

        gsap.to(orbit, {
          rotation: reverse ? -360 : 360,
          duration:
            CONFIG.orbRotateDuration + index * 12,
          ease: "none",
          repeat: -1,
          overwrite: "auto"
        });
      });
    }

    /*
     Core breathing effect.
     Very subtle — NO exaggerated pulsing.
    */
    if (
      core &&
      shouldAnimate() &&
      hasGSAP() &&
      !state.isMobile
    ) {
      gsap.to(core, {
        scale: CONFIG.activeScale,
        duration: 2.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        overwrite: "auto"
      });
    }

    /*
     Pointer interaction on the complete experience.
     Disabled on touch devices for stability.
    */
    if (
      experience &&
      !isTouchDevice() &&
      shouldAnimate() &&
      hasGSAP()
    ) {
      const handlePointerMove = (event) => {
        const rect =
          experience.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width;

        const y =
          (event.clientY - rect.top) /
          rect.height;

        const rotateX =
          (0.5 - y) * 4;

        const rotateY =
          (x - 0.5) * 4;

        gsap.to(experience, {
          rotateX,
          rotateY,
          transformPerspective: 900,
          duration: 0.65,
          ease: "power2.out",
          overwrite: "auto"
        });
      };

      const resetPointer = () => {
        gsap.to(experience, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto"
        });
      };

      experience.addEventListener(
        "pointermove",
        handlePointerMove
      );

      experience.addEventListener(
        "pointerleave",
        resetPointer
      );
    }
  };

  /* ---------------------------------------------------------
     NOOR CAPABILITY INTERACTIONS
  --------------------------------------------------------- */

  const initCapabilities = () => {
    const section = $(SELECTORS.noor);

    if (!section) return;

    const capabilities = $$(
      SELECTORS.capability,
      section
    );

    if (!capabilities.length) return;

    capabilities.forEach((card, index) => {
      /*
       Keyboard accessibility for non-button cards.
      */
      if (
        !card.matches("button, a") &&
        !card.hasAttribute("tabindex")
      ) {
        card.setAttribute("tabindex", "0");
      }

      const activate = () => {
        state.activeCapability = index;

        setActiveClass(
          capabilities,
          card,
          "is-active"
        );

        /*
         Keep the interaction visual,
         without forcing layout changes.
        */
        if (
          shouldAnimate() &&
          hasGSAP()
        ) {
          capabilities.forEach((item) => {
            gsap.to(item, {
              scale:
                item === card
                  ? CONFIG.activeScale
                  : 1,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto"
            });
          });
        }
      };

      const deactivate = () => {
        if (isTouchDevice()) return;

        state.activeCapability = null;

        if (
          shouldAnimate() &&
          hasGSAP()
        ) {
          capabilities.forEach((item) => {
            gsap.to(item, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto"
            });
          });
        }
      };

      card.addEventListener(
        "mouseenter",
        activate
      );

      card.addEventListener(
        "mouseleave",
        deactivate
      );

      card.addEventListener(
        "focus",
        activate
      );

      card.addEventListener(
        "blur",
        deactivate
      );

      card.addEventListener(
        "click",
        activate
      );

      card.addEventListener(
        "keydown",
        (event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            activate();
          }
        }
      );
    });
  };

  /* ---------------------------------------------------------
     NOOR STATS / METRICS
  --------------------------------------------------------- */

  const initStats = () => {
    const section = $(SELECTORS.noor);

    if (!section) return;

    const stats = $$(
      SELECTORS.stat,
      section
    );

    if (!stats.length) return;

    stats.forEach((stat) => {
      stat.setAttribute(
        "aria-live",
        "polite"
      );

      /*
       Optional number reveal when a numeric value
       exists inside a dedicated data attribute.
      */
      const valueNode = $(
        "[data-noor-value]",
        stat
      );

      if (!valueNode) return;

      const rawValue =
        valueNode.getAttribute(
          "data-noor-value"
        );

      const target = Number(rawValue);

      if (
        !Number.isFinite(target) ||
        !shouldAnimate() ||
        !hasGSAP()
      ) {
        return;
      }

      const decimalPlaces =
        String(rawValue).includes(".")
          ? String(rawValue).split(".")[1].length
          : 0;

      const counter = {
        value: 0
      };

      const render = () => {
        valueNode.textContent =
          counter.value.toFixed(
            decimalPlaces
          );
      };

      gsap.to(counter, {
        value: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger:
          hasScrollTrigger()
            ? {
                trigger: stat,
                start: "top 85%",
                once: true
              }
            : undefined,
        onUpdate: render
      });
    });
  };

  /* ---------------------------------------------------------
     NOOR — HOW IT WORKS / 10-STAGE PATHWAY
  --------------------------------------------------------- */

  const initNoorProcess = () => {
    const process = $(SELECTORS.process);

    if (!process) return;

    const items = $$(
      SELECTORS.processItem,
      process
    );

    if (!items.length) return;

    const activateStep = (index) => {
      const safeIndex = clamp(
        index,
        0,
        items.length - 1
      );

      state.activeProcess = safeIndex;

      const activeItem = items[safeIndex];

      setActiveClass(
        items,
        activeItem,
        "is-active"
      );

      /*
       Optional progress representation.
       Uses data attributes only when supplied.
      */
      const progress =
        $(
          "[data-noor-progress]",
          process
        );

      if (progress) {
        const percent =
          items.length === 1
            ? 100
            : (safeIndex /
                (items.length - 1)) *
              100;

        progress.style.setProperty(
          "--noor-progress",
          `${percent}%`
        );
      }

      /*
       On mobile, bring the selected step into view.
       Avoid automatic scrolling on desktop.
      */
      if (
        state.isMobile &&
        activeItem &&
        document.activeElement !== activeItem
      ) {
        activeItem.scrollIntoView({
          behavior:
            shouldAnimate()
              ? "smooth"
              : "auto",
          block: "nearest"
        });
      }
    };

    items.forEach((item, index) => {
      if (
        !item.matches(
          "button, a, [role='button']"
        ) &&
        !item.hasAttribute("tabindex")
      ) {
        item.setAttribute(
          "tabindex",
          "0"
        );
      }

      item.addEventListener(
        "mouseenter",
        () => {
          if (!isTouchDevice()) {
            activateStep(index);
          }
        }
      );

      item.addEventListener(
        "focus",
        () => {
          activateStep(index);
        }
      );

      item.addEventListener(
        "click",
        () => {
          activateStep(index);
        }
      );

      item.addEventListener(
        "keydown",
        (event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            activateStep(index);
          }

          if (
            event.key === "ArrowDown" ||
            event.key === "ArrowRight"
          ) {
            event.preventDefault();
            activateStep(
              Math.min(
                index + 1,
                items.length - 1
              )
            );
          }

          if (
            event.key === "ArrowUp" ||
            event.key === "ArrowLeft"
          ) {
            event.preventDefault();
            activateStep(
              Math.max(
                index - 1,
                0
              )
            );
          }
        }
      );
    });

    /*
     Scroll-driven activation.
     Desktop and mobile both use the same semantic model.
    */
    if (
      hasGSAP() &&
      hasScrollTrigger() &&
      shouldAnimate()
    ) {
      items.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 68%",
          end: "bottom 68%",
          onEnter: () =>
            activateStep(index),
          onEnterBack: () =>
            activateStep(index)
        });
      });
    }

    activateStep(0);
  };

  /* ---------------------------------------------------------
     CONCEPTUAL DATA / MONITORING INTERACTION
  --------------------------------------------------------- */

  const initMonitoringInteraction = () => {
    const monitoring =
      $("[data-monitoring]");

    if (!monitoring) return;

    const visualizationCards =
      $$(
        "[data-monitoring-item], .monitoring__visual-card, .monitoring__data-card",
        monitoring
      );

    const waveform =
      $(
        "[data-monitoring-waveform]",
        monitoring
      );

    visualizationCards.forEach(
      (card, index) => {
        if (
          !card.matches(
            "button, a, [role='button']"
          ) &&
          !card.hasAttribute("tabindex")
        ) {
          card.setAttribute(
            "tabindex",
            "0"
          );
        }

        const activate = () => {
          setActiveClass(
            visualizationCards,
            card,
            "is-active"
          );

          if (
            waveform &&
            shouldAnimate() &&
            hasGSAP()
          ) {
            gsap.to(waveform, {
              opacity:
                0.78 +
                index * 0.025,
              duration: 0.35,
              ease: "power2.out",
              overwrite: true
            });
          }
        };

        card.addEventListener(
          "mouseenter",
          () => {
            if (!isTouchDevice()) {
              activate();
            }
          }
        );

        card.addEventListener(
          "focus",
          activate
        );

        card.addEventListener(
          "click",
          activate
        );

        card.addEventListener(
          "keydown",
          (event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              event.preventDefault();
              activate();
            }
          }
        );
      }
    );
  };

  /* ---------------------------------------------------------
     FUTURE VISION
  --------------------------------------------------------- */

  const initFutureVision = () => {
    const future =
      $(SELECTORS.future);

    if (!future) return;

    const stages =
      $$(SELECTORS.futureStage, future);

    if (!stages.length) return;

    const activateStage = (stage) => {
      state.activeFuture = stage;

      setActiveClass(
        stages,
        stage,
        "is-active"
      );

      if (
        shouldAnimate() &&
        hasGSAP()
      ) {
        stages.forEach((item) => {
          gsap.to(item, {
            y:
              item === stage
                ? -5
                : 0,
            scale:
              item === stage
                ? 1.02
                : 1,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
          });
        });
      }
    };

    stages.forEach((stage) => {
      if (
        !stage.matches(
          "button, a, [role='button']"
        ) &&
        !stage.hasAttribute("tabindex")
      ) {
        stage.setAttribute(
          "tabindex",
          "0"
        );
      }

      stage.addEventListener(
        "mouseenter",
        () => {
          if (!isTouchDevice()) {
            activateStage(stage);
          }
        }
      );

      stage.addEventListener(
        "focus",
        () => activateStage(stage)
      );

      stage.addEventListener(
        "click",
        () => activateStage(stage)
      );
    });

    activateStage(stages[0]);
  };

  /* ---------------------------------------------------------
     OPTIONAL THREE.JS EXPERIENCE
     ---------------------------------------------------------
     Three.js is deliberately optional.

     The script only activates when:
       - THREE exists
       - a NOOR network container exists
       - reduced motion is disabled
       - device width is appropriate

     No generic particles / globe / spinning sphere.
     --------------------------------------------------------- */

  const initThreeNetwork = () => {
    const container =
      $(SELECTORS.network);

    if (!container) return;

    if (
      !shouldAnimate() ||
      typeof window.THREE === "undefined"
    ) {
      container.classList.add(
        "noor-network--fallback"
      );
      return;
    }

    /*
     On smaller screens keep the visual lightweight.
    */
    if (state.isMobile) {
      container.classList.add(
        "noor-network--fallback"
      );
      return;
    }

    const THREE = window.THREE;

    try {
      const scene =
        new THREE.Scene();

      const camera =
        new THREE.PerspectiveCamera(
          42,
          1,
          0.1,
          100
        );

      camera.position.z = 8;

      const renderer =
        new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference:
            "high-performance"
        });

      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio || 1,
          1.5
        )
      );

      renderer.setClearColor(
        0x000000,
        0
      );

      container.appendChild(
        renderer.domElement
      );

      /*
       Medical / information network:
       central intelligence node + connected nodes.
      */
      const group =
        new THREE.Group();

      scene.add(group);

      const nodeMaterial =
        new THREE.MeshBasicMaterial({
          color: 0x39d0d6
        });

      const centerMaterial =
        new THREE.MeshBasicMaterial({
          color: 0x74e5e7
        });

      const lineMaterial =
        new THREE.LineBasicMaterial({
          color: 0x39d0d6,
          transparent: true,
          opacity: 0.22
        });

      const centerGeometry =
        new THREE.SphereGeometry(
          0.42,
          20,
          20
        );

      const center =
        new THREE.Mesh(
          centerGeometry,
          centerMaterial
        );

      group.add(center);

      const nodes = [];
      const lines = [];

      const nodeCount =
        state.isTablet ? 7 : 10;

      for (
        let index = 0;
        index < nodeCount;
        index += 1
      ) {
        const angle =
          (Math.PI * 2 * index) /
          nodeCount;

        const radius =
          index % 2 === 0
            ? 2.25
            : 1.75;

        const y =
          Math.sin(angle * 1.7) *
          0.85;

        const x =
          Math.cos(angle) *
          radius;

        const z =
          Math.sin(angle) *
          radius *
          0.78;

        const geometry =
          new THREE.SphereGeometry(
            index % 3 === 0
              ? 0.14
              : 0.1,
            10,
            10
          );

        const mesh =
          new THREE.Mesh(
            geometry,
            nodeMaterial
          );

        mesh.position.set(
          x,
          y,
          z
        );

        group.add(mesh);

        nodes.push(mesh);

        const points = [
          center.position.clone(),
          mesh.position.clone()
        ];

        const lineGeometry =
          new THREE.BufferGeometry().setFromPoints(
            points
          );

        const line =
          new THREE.Line(
            lineGeometry,
            lineMaterial
          );

        group.add(line);

        lines.push(line);
      }

      const resize = () => {
        const rect =
          container.getBoundingClientRect();

        const width =
          Math.max(rect.width, 1);

        const height =
          Math.max(rect.height, 1);

        camera.aspect =
          width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(
          width,
          height,
          false
        );
      };

      resize();

      window.addEventListener(
        "resize",
        resize,
        { passive: true }
      );

      /*
       Mouse influence.
       Very restrained movement.
      */
      let pointerX = 0;
      let pointerY = 0;

      if (!isTouchDevice()) {
        container.addEventListener(
          "pointermove",
          (event) => {
            const rect =
              container.getBoundingClientRect();

            pointerX =
              ((event.clientX - rect.left) /
                rect.width -
                0.5) *
              0.8;

            pointerY =
              ((event.clientY - rect.top) /
                rect.height -
                0.5) *
              0.5;
          }
        );

        container.addEventListener(
          "pointerleave",
          () => {
            pointerX = 0;
            pointerY = 0;
          }
        );
      }

      let animationFrame;

      const render = () => {
        group.rotation.y +=
          0.0018;

        group.rotation.x +=
          (pointerY * 0.08 -
            group.rotation.x) *
          0.025;

        group.rotation.z +=
          (pointerX * 0.06 -
            group.rotation.z) *
          0.025;

        center.scale.setScalar(
          1 +
            Math.sin(
              performance.now() *
                0.0015
            ) *
              0.035
        );

        renderer.render(
          scene,
          camera
        );

        animationFrame =
          window.requestAnimationFrame(
            render
          );
      };

      render();

      state.threeInstance = {
        scene,
        camera,
        renderer,
        group,
        nodes,
        lines,
        destroy() {
          window.cancelAnimationFrame(
            animationFrame
          );

          window.removeEventListener(
            "resize",
            resize
          );

          renderer.dispose();

          if (
            renderer.domElement &&
            renderer.domElement.parentNode
          ) {
            renderer.domElement.parentNode.removeChild(
              renderer.domElement
            );
          }
        }
      };

      container.classList.add(
        "noor-network--active"
      );
    } catch (error) {
      console.warn(
        "NOOR Three.js experience could not initialize.",
        error
      );

      container.classList.add(
        "noor-network--fallback"
      );
    }
  };

  /* ---------------------------------------------------------
     SCROLL-BASED NOOR ENTRANCE
  --------------------------------------------------------- */

  const initNoorEntrance = () => {
    const section =
      $(SELECTORS.noor);

    if (
      !section ||
      !shouldAnimate() ||
      !hasGSAP()
    ) {
      return;
    }

    const targets = [
      $(
        ".noor__eyebrow",
        section
      ),
      $(
        ".noor__heading",
        section
      ),
      $(
        ".noor__intro",
        section
      ),
      $(
        ".noor__experience",
        section
      ),
      ...$$(
        SELECTORS.capability,
        section
      )
    ].filter(Boolean);

    if (!targets.length) return;

    if (hasScrollTrigger()) {
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: 24
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            once: true
          }
        }
      );
    }
  };

  /* ---------------------------------------------------------
     CLEANUP / RESIZE
  --------------------------------------------------------- */

  let resizeTimeout;

  const handleResize = () => {
    window.clearTimeout(
      resizeTimeout
    );

    resizeTimeout = window.setTimeout(
      () => {
        const previousMobile =
          state.isMobile;

        updateResponsiveState();

        /*
         Reinitialize Three.js only when crossing
         the mobile boundary.
        */
        if (
          previousMobile !==
          state.isMobile
        ) {
          if (
            state.threeInstance &&
            state.threeInstance.destroy
          ) {
            state.threeInstance.destroy();
            state.threeInstance = null;
          }

          initThreeNetwork();
        }

        if (
          hasScrollTrigger()
        ) {
          ScrollTrigger.refresh();
        }
      },
      180
    );
  };

  /* ---------------------------------------------------------
     PUBLIC INITIALIZER
  --------------------------------------------------------- */

  const init = () => {
    updateResponsiveState();

    /*
     Give the DOM one frame to settle before initializing
     interactive systems.
    */
    window.requestAnimationFrame(() => {
      initNoorCore();
      initCapabilities();
      initStats();
      initNoorProcess();
      initMonitoringInteraction();
      initFutureVision();
      initNoorEntrance();

      /*
       Initialize optional 3D experience last.
       This prevents it from blocking the core UI.
      */
      initThreeNetwork();
    });

    window.addEventListener(
      "resize",
      handleResize,
      { passive: true }
    );
  };

  /* ---------------------------------------------------------
     BOOT
  --------------------------------------------------------- */

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

  /*
   Debug access is intentionally minimal.
   Useful during development without exposing
   implementation details globally.
  */
  window.NoorExperience = {
    getState: () => ({
      ...state
    })
  };

})();