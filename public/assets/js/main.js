/**
 * Espaço Arte-Ciência — Script leve de aprimoramento progressivo (WCAG 2.2 AA).
 * Todo o conteúdo essencial (equipe, agenda, biografias, FAQ e CTAs) funciona sem JS.
 */
(function () {
  "use strict";

  // 1. Menu móvel acessível com controle de foco e tecla Escape
  var menuToggle = document.getElementById("menu-toggle");
  var primaryNav = document.getElementById("primary-navigation");

  function closeMenu(returnFocus) {
    if (!menuToggle || !primaryNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
    if (returnFocus) {
      menuToggle.focus();
    }
  }

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", function () {
      var expanded = menuToggle.getAttribute("aria-expanded") === "true";
      var nextState = !expanded;
      menuToggle.setAttribute("aria-expanded", String(nextState));
      primaryNav.classList.toggle("is-open", nextState);
    });

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        closeMenu(true);
      }
    });

    document.addEventListener("click", function (ev) {
      if (
        menuToggle.getAttribute("aria-expanded") === "true" &&
        !primaryNav.contains(ev.target) &&
        !menuToggle.contains(ev.target)
      ) {
        closeMenu(false);
      }
    });
  }

  // 2. Filtro progressivo na central "Atividades do Espaço"
  var filterButtons = document.querySelectorAll("[data-activity-filter]");
  var filterCards = document.querySelectorAll("[data-seminar-state]");
  var filterEmptyState = document.getElementById("filter-empty-state");

  if (filterButtons.length > 0 && filterCards.length > 0) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filterValue = btn.getAttribute("data-activity-filter");

        filterButtons.forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });

        var visibleCount = 0;
        filterCards.forEach(function (card) {
          var state = card.getAttribute("data-seminar-state");
          var year = card.getAttribute("data-seminar-year");
          var match =
            filterValue === "todos" ||
            filterValue === state ||
            filterValue === year;

          card.hidden = !match;
          if (match) visibleCount++;
        });

        if (filterEmptyState) {
          filterEmptyState.hidden = visibleCount > 0;
        }
      });
    });
  }

  // 3. Instrumentação ética de intenção de contato (apenas se analytics real estiver configurado)
  // Não instala rastreadores com IDs inventados e nunca envia mensagens ou dados pessoais.
  function trackEvent(eventName, params) {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        cta_origin: params.cta_origin || null,
        seminar_id: params.seminar_id || null
      });
    }
    if (typeof window.CustomEvent === "function") {
      window.dispatchEvent(new CustomEvent("eac:analytics", {
        detail: { event: eventName, params: params }
      }));
    }
  }

  document.addEventListener("click", function (ev) {
    var waLink = ev.target.closest("[data-cta-origin]");
    if (waLink) {
      trackEvent("whatsapp_click", {
        cta_origin: waLink.getAttribute("data-cta-origin"),
        seminar_id: waLink.getAttribute("data-seminar-id") || "geral"
      });
      return;
    }

    var semLink = ev.target.closest("[data-seminar-view], [data-seminar-link]");
    if (semLink) {
      var semId =
        semLink.getAttribute("data-seminar-view") ||
        semLink.getAttribute("data-seminar-link");
      trackEvent("seminar_view", {
        cta_origin: "card_link",
        seminar_id: semId
      });
    }
  });
  // 4. Acordeão exclusivo para biografia/trajetória dos analistas
  // Garante que apenas uma trajetória permaneça aberta por vez
  var analystDetails = document.querySelectorAll(".analyst-card__expand");
  if (analystDetails.length > 0) {
    analystDetails.forEach(function (detail) {
      detail.addEventListener("toggle", function () {
        if (detail.open) {
          analystDetails.forEach(function (other) {
            if (other !== detail && other.open) {
              other.removeAttribute("open");
            }
          });
        }
      });
    });
  }
})();
