document.addEventListener("DOMContentLoaded", function () {
    const nav = document.querySelector(".nav");
    const navMobileBtn = document.querySelector(".nav-mobile-btn");

    if (nav && navMobileBtn) {
        navMobileBtn.addEventListener("click", function () {
            this.x = ((this.x || 0) + 1) % 2;

            if (this.x) {
                nav.classList.add("open");
                document.body.style.overflow = "hidden";
            } else {
                nav.classList.remove("open");
                document.body.style.overflow = "auto";
            }
        });
    }

    const navLinks = document.querySelectorAll(".mobile-menu-fade");
    let navDelay = 0;
    for (let i = 0; i < navLinks.length; i++) {
        navDelay += 0.05;
        navLinks[i].style.setProperty("--delay", `${navDelay}s`);
    }

    let currentModalId;

    function openModal(modalId) {
        const modal = document.querySelector(modalId);
        if (modal) {
            modal.classList.add("open");
            document.body.style.overflow = "hidden";
            currentModalId = modalId;
        }
    }

    function closeModal() {
        if (currentModalId) {
            const modal = document.querySelector(currentModalId);
            if (modal) {
                modal.classList.remove("open");
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
                        utm_placement: utm_placement || undefined,
                    });
                }
            }
        });
    }

    // Track buttons
    trackButtonByText("Sign up", "Lead");
    trackButtonByText("Now live in Alpha!", "Lead");

    /* =========================
       FAQ DROPDOWN SCRIPT
    ========================= */
    document.querySelectorAll(".faq-header").forEach((header) => {
        header.addEventListener("click", () => {
            const item = header.parentElement;

            document.querySelectorAll(".faq-item").forEach((faq) => {
                if (faq !== item) {
                    faq.classList.remove("active");
                }
            });

            item.classList.toggle("active");
        });
    });
});