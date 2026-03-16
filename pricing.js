// pricing.js

const API_URL = "https://sadiqesafar.com/api/subscription-plan/multiple/1";

const byId = (id) => document.getElementById(id);

const safeText = (v) => (v === null || v === undefined || v === "" ? "-" : String(v));

const moneyINR = (n) => {
    const num = Number(n);
    if (Number.isNaN(num)) return safeText(n);
    return num.toLocaleString("en-IN");
};

function planKeyFromType(subscription_type) {
    const s = (subscription_type || "").toLowerCase();
    if (s.includes("free")) return "free";
    if (s.includes("basic")) return "basic";
    if (s.includes("premium")) return "premium";
    return null;
}

function supportToText(supportArr) {
    if (!Array.isArray(supportArr) || supportArr.length === 0) return "-";
    return supportArr
        .map((x) => x?.type)
        .filter(Boolean)
        .join(" + ");
}

function buildFeatures(plan) {
    // Exactly like your UI labels
    return [
        `${safeText(plan.packages)} Packages`,
        `${safeText(plan.events)} Events (Schedules)`,
        `${moneyINR(plan.tourist_data)} Tourist Data (PAX)`,
        `${moneyINR(plan.passport_scan)} Passport Scan API / Month`,
        `${moneyINR(plan.invoices)} Invoices`,
        `${moneyINR(plan.receipts)} Receipts`,
        `${supportToText(plan.support)} Support`,
    ];
}

function renderPlanCard(plan, key) {
    const isPremium = key === "premium";

    const cardClass = isPremium ? "pricing-card popular" : "pricing-card";
    const headerClass = isPremium ? "card-header prem-card" : "card-header";

    const badgeHtml = isPremium ? `<div class="popular-badge">Most Popular</div>` : "";

    const nameStyle = isPremium ? `style="color:white; padding-top:20px;"` : "";
    const currencyStyle = isPremium ? `style="color:white;"` : "";
    const priceStyle = isPremium ? `style="color:white;"` : "";
    const periodStyle = isPremium ? `style="color:white;"` : "";
    const descStyle = isPremium ? `style="color:white;"` : "";

    const btnText = key === "free" ? "Start Free Trial" : key === "basic" ? "Choose Basic" : "Choose Premium";
    const btnClass = isPremium ? "cta-button standard-button popular-button" : "cta-button standard-button";

    const features = buildFeatures(plan);

    // Description (you can customize if API does not have description)
    const description =
        key === "free"
            ? "Perfect for agencies who want to test the platform."
            : key === "basic"
                ? "Small travel agencies ke liye best."
                : "Growing agencies & tour organizers ke liye.";

    return `
    <div class="${cardClass}" data-plan="${key}">
      ${badgeHtml}
      <div class="${headerClass}">
        <h3 class="plan-name" ${nameStyle}>${safeText(plan.subscription_type)}</h3>
        <div class="plan-price">
          <span class="currency" ${currencyStyle}>₹</span>
          <span ${priceStyle}>${moneyINR(plan.price_per_month)}</span>
          <span class="plan-period" ${periodStyle}>/ month</span>
        </div>
        <p class="plan-description" ${descStyle}>${description}</p>
      </div>

      <div class="card-body">
        <ul class="features-list">
          ${features
            .map(
                (f) => `
              <li class="feature-included">
                <span class="feature-icon-pricing"><i class="fas fa-check"></i></span>
                <span>${safeText(f)}</span>
              </li>
            `
            )
            .join("")}
        </ul>
        <a href="#" class="${btnClass}">${btnText}</a>
      </div>
    </div>
  `;
}

function setCell(id, value, formatter) {
    const el = byId(id);
    if (!el) return;
    el.textContent = formatter ? formatter(value) : safeText(value);
}

function fillTable(plan, key) {
    // Fill exact IDs in HTML
    setCell(`${key}_packages`, plan.packages);
    setCell(`${key}_events`, plan.events);
    setCell(`${key}_tourist_data`, plan.tourist_data, moneyINR);
    setCell(`${key}_passport_scan`, plan.passport_scan, moneyINR);
    setCell(`${key}_invoices`, plan.invoices, moneyINR);
    setCell(`${key}_receipts`, plan.receipts, moneyINR);
    setCell(`${key}_payment_reminders`, plan.payment_reminders, moneyINR);
    setCell(`${key}_room_auto_allotment`, plan.room_auto_allotment, moneyINR);
    setCell(`${key}_enquiries`, plan.enquiries, moneyINR);
    setCell(`${key}_profit_loss_report`, plan.profit_loss_report);
    setCell(`${key}_income_expense_report`, plan.income_expense_report);
    setCell(`${key}_sub_user`, plan.sub_user);
    setCell(`${key}_support`, supportToText(plan.support));
}

function updateTableHeaders(plansByKey) {
    const basic = plansByKey.basic;
    const premium = plansByKey.premium;

    if (basic && byId("thBasic")) {
        byId("thBasic").innerHTML = `Basic Plan<br>₹${moneyINR(basic.price_per_month)}/mo (₹${moneyINR(
            basic.price_per_year
        )}/yr)`;
    }

    if (premium && byId("thPremium")) {
        byId("thPremium").innerHTML = `Premium Plan<br>₹${moneyINR(premium.price_per_month)}/mo (₹${moneyINR(
            premium.price_per_year
        )}/yr)`;
    }
}

async function loadPricing() {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({}),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const json = await res.json();
        const plans = Array.isArray(json?.data) ? json.data : [];

        // Build key map
        const plansByKey = {};
        for (const p of plans) {
            const key = planKeyFromType(p.subscription_type);
            if (key) plansByKey[key] = p;
        }

        // Render cards
        const wrap = byId("pricingCards");
        const custom = byId("customPlanCard");

        // Remove old injected cards
        wrap.querySelectorAll('[data-plan="free"],[data-plan="basic"],[data-plan="premium"]').forEach((n) => n.remove());

        const html =
            (plansByKey.free ? renderPlanCard(plansByKey.free, "free") : "") +
            (plansByKey.basic ? renderPlanCard(plansByKey.basic, "basic") : "") +
            (plansByKey.premium ? renderPlanCard(plansByKey.premium, "premium") : "");

        custom.insertAdjacentHTML("beforebegin", html);

        // Fill table
        if (plansByKey.free) fillTable(plansByKey.free, "free");
        if (plansByKey.basic) fillTable(plansByKey.basic, "basic");
        if (plansByKey.premium) fillTable(plansByKey.premium, "premium");

        updateTableHeaders(plansByKey);
    } catch (err) {
        console.error("Pricing load failed:", err);
        // fallback: show static values (if any)
    }
}

// Mobile menu toggle (simple)
function initMobileMenu() {
    const nav = byId("nav");
    const btn = byId("mobileBtn");
    const menu = byId("mobileMenu");
    if (!nav || !btn || !menu) return;

    btn.addEventListener("click", () => {
        menu.classList.toggle("open");
        nav.classList.toggle("open");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    loadPricing();
});