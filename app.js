(() => {
  const body = document.body;
  const root = document.documentElement;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const menuButton = document.querySelector("[data-menu-toggle]");
  const backdrop = document.querySelector("[data-sidebar-backdrop]");
  const sectionLinks = [...document.querySelectorAll("[data-section-link]")];
  const sections = [...document.querySelectorAll("[data-section]")];

  function setTheme(theme) {
    root.dataset.theme = theme;
    const dark = theme === "dark";
    if (themeButton) {
      themeButton.setAttribute("aria-pressed", String(dark));
      const themeAction = dark ? "Switch to light mode" : "Switch to dark mode";
      themeButton.title = themeAction;
      themeButton.setAttribute("aria-label", themeAction);
    }
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = dark ? "#15181c" : "#ffffff";
    localStorage.setItem("qz-theme", theme);
  }

  const savedTheme = localStorage.getItem("qz-theme");
  const initialTheme = savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  setTheme(initialTheme);
  if (themeButton) {
    themeButton.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));
  }

  function closeMenu() {
    body.classList.remove("menu-open");
    if (menuButton) menuButton.setAttribute("aria-expanded", "false");
  }

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      const opening = !body.classList.contains("menu-open");
      body.classList.toggle("menu-open", opening);
      menuButton.setAttribute("aria-expanded", String(opening));
    });
  }
  if (backdrop) backdrop.addEventListener("click", closeMenu);
  sectionLinks.forEach((link) => link.addEventListener("click", closeMenu));
  addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        sectionLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
        });
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.15, 0.4] }
    );
    sections.forEach((section) => observer.observe(section));
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
