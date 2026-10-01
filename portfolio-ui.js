(() => {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const activeAnimations = new Set();
  const ease = "cubic-bezier(.22, 1, .36, 1)";

  async function animate(node, frames, options = {}) {
    if (reducedMotion.matches || !node.animate) return;
    const animation = node.animate(frames, { duration: 320, easing: ease, ...options });
    activeAnimations.add(animation);
    try { await animation.finished; } catch { /* A newer interaction may cancel motion. */ }
    finally { activeAnimations.delete(animation); }
  }

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) activeAnimations.forEach((animation) => animation.finish());
  });

  const enter = [
    { opacity: 0, transform: "translateY(14px)" },
    { opacity: 1, transform: "translateY(0)" }
  ];
  const root = document.querySelector("#project-list");
  const cards = [...root.querySelectorAll(".project-card")];

  // Animate only on arrival; scrolling back never hides already-read content.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.filter((entry) => entry.isIntersecting).forEach((entry, index) => {
        observer.unobserve(entry.target);
        animate(entry.target, enter, { duration: 480, delay: Math.min(index * 45, 135), fill: "backwards" });
      });
    }, { threshold: 0.06 });
    document.querySelectorAll(".hero-copy > *, .signal-panel, .section-heading, .project-card, .site-footer")
      .forEach((node) => observer.observe(node));
  }

  const toolbar = document.querySelector("#project-toolbar");
  const filters = toolbar.querySelector(".project-filters");
  const count = document.querySelector("#project-count");
  const categories = [
    { id: "all", label: "全部作品", matches: () => true },
    { id: "web", label: "网页应用", matches: (type) => /网页|网站/.test(type) },
    { id: "tools", label: "工具与 Skill", matches: (type) => /Skill|插件|小程序/i.test(type) },
    { id: "content", label: "内容创作", matches: (type) => /公众号/.test(type) }
  ];
  cards.forEach((card) => { card.dataset.type = card.querySelector(".project-type").textContent; });
  categories.filter((category) => cards.some((card) => category.matches(card.dataset.type)))
    .forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = category.label;
      button.dataset.filter = category.id;
      button.setAttribute("aria-pressed", String(category.id === "all"));
      button.setAttribute("aria-controls", "project-list");
      filters.append(button);
    });
  toolbar.hidden = cards.length === 0;
  count.textContent = `${cards.length} 件作品`;

  let revision = 0;
  let selected = "all";
  filters.addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button || button.dataset.filter === selected) return;
    selected = button.dataset.filter;
    const currentRevision = ++revision;
    root.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
    filters.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    root.setAttribute("aria-busy", "true");
    await animate(root, [{ opacity: 1 }, { opacity: 0, transform: "translateY(-6px)" }], { duration: 130 });
    if (currentRevision !== revision) return;
    const category = categories.find((item) => item.id === selected);
    cards.forEach((card) => { card.hidden = !category.matches(card.dataset.type); });
    count.textContent = `${cards.filter((card) => !card.hidden).length} / ${cards.length} 件作品`;
    root.removeAttribute("aria-busy");
    await animate(root, enter, { duration: 280 });
  });

  const dialog = document.querySelector(".image-dialog");
  const previewImage = dialog.querySelector("img");
  const previewTitle = dialog.querySelector("h2");
  let opener;
  let closing = false;
  let previousOverflow = "";

  root.addEventListener("click", (event) => {
    const button = event.target.closest(".media-preview");
    if (!button || dialog.open) return;
    opener = button;
    const image = button.querySelector("img");
    previewImage.src = image.currentSrc || image.src;
    previewImage.alt = image.alt;
    previewTitle.textContent = button.closest(".project-card").querySelector("h3").textContent;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    animate(dialog, [{ opacity: 0, transform: "translateY(12px) scale(.98)" }, { opacity: 1, transform: "none" }]);
  });

  async function closePreview() {
    if (closing || !dialog.open) return;
    closing = true;
    dialog.getAnimations().forEach((animation) => animation.cancel());
    dialog.classList.add("is-closing");
    await animate(dialog, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(8px) scale(.985)" }], { duration: 170 });
    dialog.close();
  }
  dialog.querySelector(".dialog-close").addEventListener("click", closePreview);
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); closePreview(); });
  dialog.addEventListener("click", (event) => { if (event.target === dialog) closePreview(); });
  dialog.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow;
    dialog.classList.remove("is-closing");
    closing = false;
    opener?.focus({ preventScroll: true });
  });

  const toast = document.querySelector(".toast");
  let toastTimer;
  let toastRevision = 0;
  function notify(message) {
    const currentRevision = ++toastRevision;
    clearTimeout(toastTimer);
    toast.getAnimations().forEach((animation) => animation.cancel());
    toast.textContent = message;
    toast.hidden = false;
    animate(toast, enter, { duration: 220 });
    toastTimer = setTimeout(async () => {
      await animate(toast, [{ opacity: 1 }, { opacity: 0, transform: "translateY(6px)" }], { duration: 160 });
      if (currentRevision === toastRevision) toast.hidden = true;
    }, 2600);
  }
  root.addEventListener("click", async (event) => {
    const button = event.target.closest(".copy-command");
    if (!button || button.disabled) return;
    const code = button.parentElement.querySelector("code");
    button.disabled = true;
    try {
      await navigator.clipboard.writeText(code.textContent);
      notify("安装命令已复制");
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      notify("请手动复制已选中的命令");
    } finally { button.disabled = false; }
  });
})();
