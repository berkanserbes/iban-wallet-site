// Light/dark theme toggle. Follows the system theme until the visitor picks one;
// the choice is kept in localStorage and dropped again when it matches the system.
(function () {
  var KEY = "theme";
  var root = document.documentElement;
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  var choice = null;

  try {
    var saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") choice = saved;
  } catch (e) {}

  function current() {
    return choice || (systemDark.matches ? "dark" : "light");
  }

  function apply() {
    var theme = current();
    root.setAttribute("data-theme", theme);

    // Dark screenshots: <source data-dark> picks them only in the dark theme
    var sources = document.querySelectorAll("source[data-dark]");
    for (var i = 0; i < sources.length; i++) {
      sources[i].media = theme === "dark" ? "all" : "not all";
    }

    var button = document.querySelector(".theme-toggle");
    if (button) {
      var label = theme === "dark" ? button.dataset.labelLight : button.dataset.labelDark;
      button.setAttribute("aria-label", label);
      button.title = label;
    }
  }

  function toggle() {
    var next = current() === "dark" ? "light" : "dark";
    choice = next === (systemDark.matches ? "dark" : "light") ? null : next;
    try {
      if (choice) localStorage.setItem(KEY, choice);
      else localStorage.removeItem(KEY);
    } catch (e) {}
    apply();
  }

  apply();

  document.addEventListener("DOMContentLoaded", function () {
    apply();
    var button = document.querySelector(".theme-toggle");
    if (button) button.addEventListener("click", toggle);
  });

  if (systemDark.addEventListener) systemDark.addEventListener("change", apply);
})();
