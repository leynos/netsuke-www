(function () {
  "use strict";

  var SELECTORS = {
    toggle: "#navbar-mobile-toggle",
    menu: "#navbar-mobile-menu",
    navbar: "#navbar"
  };

  var CLASSES = { open: "is-open", hidden: "hidden" };

  function init() {
    var toggle = document.querySelector(SELECTORS.toggle);
    var menu = document.querySelector(SELECTORS.menu);
    var navbar = document.querySelector(SELECTORS.navbar);
    if (!toggle || !menu || !navbar) return;

    var openIcon = toggle.querySelector(".hm-hamburger__open");
    var closeIcon = toggle.querySelector(".hm-hamburger__close");

    function isOpen() {
      return menu.classList.contains(CLASSES.open);
    }

    function openMenu() {
      menu.classList.remove(CLASSES.hidden);
      // Force a reflow so the transition triggers from max-height:0
      void menu.offsetHeight;
      menu.classList.add(CLASSES.open);
      toggle.setAttribute("aria-expanded", "true");
      if (openIcon) openIcon.style.display = "none";
      if (closeIcon) closeIcon.style.display = "";
      var first = menu.querySelector("a, button");
      if (first) first.focus();
    }

    function closeMenu(options) {
      var opts = options || {};
      var restoreFocus = !!opts.restoreFocus;
      var hideImmediately = !!opts.hideImmediately;

      menu.classList.remove(CLASSES.open);
      toggle.setAttribute("aria-expanded", "false");
      if (openIcon) openIcon.style.display = "";
      if (closeIcon) closeIcon.style.display = "none";
      if (restoreFocus) toggle.focus();
      if (hideImmediately) {
        menu.classList.add(CLASSES.hidden);
        return;
      }
      menu.addEventListener(
        "transitionend",
        function hide() {
          if (!isOpen()) menu.classList.add(CLASSES.hidden);
          menu.removeEventListener("transitionend", hide);
        }
      );
    }

    // Toggle on click
    toggle.addEventListener("click", function () {
      if (isOpen()) closeMenu({ restoreFocus: true });
      else openMenu();
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        closeMenu({ restoreFocus: true });
      }
    });

    // Close on click outside navbar
    document.addEventListener("click", function (e) {
      if (isOpen() && !navbar.contains(e.target)) {
        closeMenu();
      }
    });

    // Close when viewport crosses md breakpoint
    var mql = window.matchMedia("(min-width: 768px)");
    function onBreakpoint() {
      if (mql.matches && isOpen()) closeMenu({ hideImmediately: true });
    }
    if (mql.addEventListener) mql.addEventListener("change", onBreakpoint);
    else mql.addListener(onBreakpoint);

    // Focus trap: Tab cycles through the toggle and menu items in both
    // directions while the menu is open.
    menu.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !isOpen()) return;
      var focusable = menu.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        toggle.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        toggle.focus();
      }
    });

    // When focus leaves toggle while menu is open, wrap to the matching edge.
    toggle.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !isOpen()) return;
      var focusable = menu.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) {
        e.preventDefault();
        if (e.shiftKey) focusable[focusable.length - 1].focus();
        else focusable[0].focus();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
