document.addEventListener("DOMContentLoaded", function () {
    const nav = document.querySelector(".nav");
    const navMobileBtn = document.querySelector(".nav-mobile-btn");

    function closeMobileMenu() {
        if (nav) {
            nav.classList.remove("open");
        }
        document.body.style.overflow = "auto";
        if (navMobileBtn) {
            navMobileBtn.x = 0;
        }
    }

    function handleNavResize() {
        if (window.innerWidth > 1067) {
            closeMobileMenu();
        }
    }

    if (nav && navMobileBtn) {
        navMobileBtn.addEventListener("click", function () {
            // 1067px se upar toggle kaam nahi karega
            if (window.innerWidth > 1067) return;

            this.x = ((this.x || 0) + 1) % 2;
            if (this.x) {
                nav.classList.add("open");
                document.body.style.overflow = "hidden";
            } else {
                nav.classList.remove("open");
                document.body.style.overflow = "auto";
            }
        });

        window.addEventListener("resize", handleNavResize);
        handleNavResize();
    }

    const navLinks = document.querySelectorAll(".mobile-menu-fade");
    let navDelay = 0;
    for (let i = 0; i < navLinks.length; i++) {
        navDelay += 0.05;
        navLinks[i].style.setProperty("--delay", `${navDelay}s`);
    }

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const allLinks = document.querySelectorAll(".nav-link, .nav-mobile-link");

    allLinks.forEach((link) => {
        const linkHref = link.getAttribute("href");

        if (
            linkHref === currentPage ||
            (currentPage === "" && linkHref === "index.html") ||
            (currentPage === "/" && linkHref === "index.html") ||
            (currentPage === "index.html" && linkHref === "/")
        ) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });

    let currentModalId;

    function openModal(modalId) {
        const modalEl = document.querySelector(modalId);
        if (modalEl) {
            modalEl.classList.add("open");
            document.body.style.overflow = "hidden";
            currentModalId = modalId;
        }
    }

    function closeModal() {
        if (currentModalId) {
            const modalEl = document.querySelector(currentModalId);
            if (modalEl) {
                modalEl.classList.remove("open");
            }
            document.body.style.overflow = "auto";
            currentModalId = null;
        }
    }

    const modalButtons = document.querySelectorAll("[openModal]");
    if (modalButtons.length) {
        modalButtons.forEach((modalTrigger) => {
            modalTrigger.addEventListener("click", function (e) {
                e.preventDefault();
                const modalId = modalTrigger.getAttribute("openModal");
                openModal(`[modal=${modalId}]`);
            });
        });

        document.querySelectorAll(".modal-close, .modal-bg").forEach((modalClose) => {
            modalClose.addEventListener("click", closeModal);
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                e.preventDefault();
                closeModal();
            }
        });
    }

    function getFbCookies() {
        const cs = document.cookie.split("; ");
        return {
            fbc: cs.find((x) => x.startsWith("_fbc="))?.split("=")[1] || "",
            fbp: cs.find((x) => x.startsWith("_fbp="))?.split("=")[1] || ""
        };
    }

    function getUtmParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get("utm_source") || "",
            utm_medium: params.get("utm_medium") || "",
            utm_campaign: params.get("utm_campaign") || "",
            utm_term: params.get("utm_term") || "",
            utm_content: params.get("utm_content") || "",
            utm_adgroup: params.get("utm_adgroup") || "",
            utm_placement: params.get("utm_placement") || ""
        };
    }

    document.addEventListener("click", (e) => {
        const el = e.target.closest(".cta-button-redirect");
        if (!el) return;

        e.preventDefault();
        e.stopPropagation();

        const base = "https://start.popcorn.space";
        const url = new URL(base);

        const { fbc, fbp } = getFbCookies();
        const {
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content,
            utm_adgroup,
            utm_placement
        } = getUtmParams();

        if (fbc) url.searchParams.set("fbc", fbc);
        if (fbp) url.searchParams.set("fbp", fbp);
        if (utm_source) url.searchParams.set("utm_source", utm_source);
        if (utm_medium) url.searchParams.set("utm_medium", utm_medium);
        if (utm_campaign) url.searchParams.set("utm_campaign", utm_campaign);
        if (utm_term) url.searchParams.set("utm_term", utm_term);
        if (utm_content) url.searchParams.set("utm_content", utm_content);
        if (utm_adgroup) url.searchParams.set("utm_adgroup", utm_adgroup);
        if (utm_placement) url.searchParams.set("utm_placement", utm_placement);

        const target = el.getAttribute("data-target") || "_blank";
        window.open(url.toString(), target);
    });

    function trackButtonByText(buttonText, eventName) {
        document.body.addEventListener("click", function (event) {
            if (event.target && event.target.textContent.trim() === buttonText) {
                if (typeof fbq === "function") {
                    fbq("track", eventName);
                }

                if (window.analytics) {
                    const {
                        utm_source,
                        utm_medium,
                        utm_campaign,
                        utm_term,
                        utm_content,
                        utm_placement,
                        utm_adgroup
                    } = getUtmParams();

                    const { fbc, fbp } = getFbCookies();

                    analytics.track("landing_cta_click", {
                        button_text: buttonText,
                        fbc: fbc || undefined,
                        fbp: fbp || undefined,
                        utm_source: utm_source || undefined,
                        utm_medium: utm_medium || undefined,
                        utm_campaign: utm_campaign || undefined,
                        utm_term: utm_term || undefined,
                        utm_content: utm_content || undefined,
                        utm_adgroup: utm_adgroup || undefined,
                        utm_placement: utm_placement || undefined
                    });
                }
            }
        });
    }

    // Track 'Sign Up' button clicks
    trackButtonByText("Sign up", "Lead");

    // Track 'Now live in Alpha!' button clicks
    trackButtonByText("Now live in Alpha!", "Lead");

    const canvas = document.getElementById("mapCanvas");

    if (canvas) {
        const ctx = canvas.getContext("2d");
        let animationFrameId;
        let isAnimating = false;

        const sparkleProbability = 0.002;
        const dotColor = "#E6ECF1";
        const sparkleColor = "#CDDFEE";
        const sparkleDuration = 60;
        const fadeInDuration = 10;
        const background = [];
        const sparkles = [];
        let cols, rows;
        let dotRadius = 4;
        let dotGap = 6;

        if (window.innerWidth < 480) {
            dotRadius = 2;
            dotGap = 3;
        }

        function initializeCanvas() {
            const parent = canvas.parentElement;
            if (!parent) return;

            canvas.style.width = "100%";
            canvas.style.height = "100%";

            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            cols = Math.floor(rect.width / (dotRadius * 2 + dotGap));
            rows = Math.floor(rect.height / (dotRadius * 2 + dotGap));

            background.length = 0;
            for (let x = 0; x < cols; x++) {
                background[x] = [];
                for (let y = 0; y < rows; y++) {
                    background[x][y] = dotColor;
                }
            }

            drawBackground();
        }

        function handleResize() {
            initializeCanvas();
        }

        function drawBackground() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    const offsetX = y % 2 === 0 ? dotRadius + dotGap / 2 : 0;
                    drawDot(x, y, background[x][y], offsetX);
                }
            }
        }

        function drawDot(x, y, color, offsetX = 0) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(
                x * (dotRadius * 2 + dotGap) + dotRadius + offsetX,
                y * (dotRadius * 2 + dotGap) + dotRadius,
                dotRadius,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        function animateSparkles() {
            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    if (Math.random() < sparkleProbability) {
                        sparkles.push({ x, y, opacity: 0, phase: "fadeIn" });
                    }
                }
            }

            const fadeRate = 1 / sparkleDuration;
            const fadeInRate = 1 / fadeInDuration;

            for (let i = sparkles.length - 1; i >= 0; i--) {
                const sparkle = sparkles[i];

                if (sparkle.phase === "fadeIn") {
                    sparkle.opacity += fadeInRate;
                    if (sparkle.opacity >= 1) {
                        sparkle.opacity = 1;
                        sparkle.phase = "fadeOut";
                    }
                } else {
                    sparkle.opacity -= fadeRate;
                    if (sparkle.opacity <= 0) {
                        sparkles.splice(i, 1);
                        continue;
                    }
                }

                const offsetX = sparkle.y % 2 === 0 ? dotRadius + dotGap / 2 : 0;
                ctx.globalAlpha = sparkle.opacity;
                drawDot(sparkle.x, sparkle.y, sparkleColor, offsetX);
                ctx.globalAlpha = 1;
            }
        }

        function animate() {
            drawBackground();
            animateSparkles();
            animationFrameId = requestAnimationFrame(animate);
        }

        function stopAnimation() {
            cancelAnimationFrame(animationFrameId);
        }

        function handleIntersection(entries) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (!isAnimating) {
                        isAnimating = true;
                        animate();
                    }
                } else {
                    if (isAnimating) {
                        isAnimating = false;
                        stopAnimation();
                    }
                }
            });
        }

        const canvasObserver = new IntersectionObserver(handleIntersection, {
            threshold: 0
        });

        canvasObserver.observe(canvas);
        window.addEventListener("resize", handleResize);
        initializeCanvas();
    }

    const scrollEls = document.querySelectorAll(".scroll-observe");
    const observerOptions = {
        threshold: 0,
        rootMargin: "0px 0px -10% 0px"
    };

    function scrollObserver(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
                entry.target.classList.add("visible");
            } else {
                entry.target.classList.remove("visible");
            }
        });
    }

    const observer = new IntersectionObserver(scrollObserver, observerOptions);
    scrollEls.forEach((scrollEl) => observer.observe(scrollEl));
});