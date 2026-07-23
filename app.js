const data = window.SITE_DATA || {};

const textFields = document.querySelectorAll("[data-field]");

textFields.forEach((node) => {
  const key = node.getAttribute("data-field");
  if (key === "projectCount") {
    node.textContent = String(data.projects?.length || 0);
    return;
  }
  if (key === "skillCount") {
    node.textContent = String(data.skills?.length || 0);
    return;
  }
  if (key === "footerName") {
    node.textContent = data.name || data.siteTitle || "个人网站";
    return;
  }
  if (data[key]) {
    node.textContent = data[key];
  }
});

document.title = `${data.name || "个人网站"} | AI 探索与个人简介`;

renderHeroEducation(data.experience || []);
renderExperience(data.experience || []);
renderProjects(data.projects || []);
renderSkills(data.skills || []);

function renderHeroEducation(items) {
  const root = document.querySelector("#hero-education");
  if (!root) return;

  const education = items.find((item) => item.kind === "education");
  if (!education) {
    root.hidden = true;
    return;
  }

  root.innerHTML = `
    <span class="hero-education-label">教育背景</span>
    <strong>${escapeHtml(education.organization)}</strong>
    <span>${escapeHtml(education.title)}</span>
    <span class="hero-education-period">${escapeHtml(education.period)}</span>
  `;
}

function renderExperience(items) {
  const root = document.querySelector("#experience-list");
  if (!root) return;

  const educationItems = items.filter((item) => item.kind === "education");
  const workItems = items.filter((item) => item.kind !== "education");
  const groups = [
    { label: "教育背景", items: educationItems },
    { label: "工作经历", kind: "work", items: workItems }
  ].filter((group) => group.items.length);

  root.innerHTML = groups.map(resumeGroup).join("");
}

function resumeGroup(group) {
  const content =
    group.kind === "work"
      ? groupWorkItems(group.items)
      : group.items.map(resumeItem).join("");

  return `
    <section class="resume-group" aria-label="${escapeAttribute(group.label)}">
      <div class="resume-group-label">
        <h3>${escapeHtml(group.label)}</h3>
      </div>
      <div class="resume-group-list">
        ${content}
      </div>
    </section>
  `;
}

function groupWorkItems(items) {
  const companyGroups = [];
  const groupsByCompany = new Map();

  items.forEach((item) => {
    const key = `${item.organization}\u0000${item.department || ""}`;
    let group = groupsByCompany.get(key);

    if (!group) {
      group = {
        organization: item.organization,
        department: item.department,
        items: []
      };
      groupsByCompany.set(key, group);
      companyGroups.push(group);
    }

    group.items.push(item);
  });

  return companyGroups.map(companyGroup).join("");
}

function companyGroup(group) {
  return `
    <section class="company-group" aria-label="${escapeAttribute(group.organization)}">
      <header class="company-heading">
        <h3>${escapeHtml(group.organization)}</h3>
        ${
          group.department
            ? `<p class="company-department">${escapeHtml(group.department)}</p>`
            : ""
        }
      </header>
      <div class="company-roles">
        ${group.items.map(workRoleItem).join("")}
      </div>
    </section>
  `;
}

function workRoleItem(item) {
  return `
    <article class="timeline-item timeline-item--role">
      <div class="timeline-time">${escapeHtml(item.period)}</div>
      <div>
        <h4 class="timeline-role-title">${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.description)}</p>
      </div>
    </article>
  `;
}

function resumeItem(item) {
  return `
    <article class="timeline-item timeline-item--education">
      <div class="timeline-main">
        <h3>${escapeHtml(item.organization)}</h3>
        <p class="timeline-role">${escapeHtml(item.title)}</p>
        ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
      </div>
      <div class="timeline-time">${escapeHtml(item.period)}</div>
    </article>
  `;
}

function renderProjects(items) {
  const root = document.querySelector("#project-list");
  if (!root) return;

  if (!items.length) {
    root.innerHTML = emptyState("个人 AI 探索项目待补充");
    return;
  }

  root.innerHTML = items.map(projectCard).join("");
}

function renderSkills(items) {
  const root = document.querySelector("#skill-list");
  if (!root) return;

  if (!items.length) {
    root.innerHTML = emptyState("Skills 与 Demo 待补充");
    return;
  }

  root.innerHTML = items.map(skillCard).join("");
}

function emptyState(message) {
  return `
    <article class="skill-card">
      <div class="card-meta"><span class="pill">待整理</span></div>
      <h3>${escapeHtml(message)}</h3>
      <p>后续根据你单独提供的小程序、Chrome 插件、Skills 和 Demo 信息更新。</p>
    </article>
  `;
}

function projectCard(item, index) {
  const tags = [item.status, ...(item.tags || [])].filter(Boolean);
  const cardClasses = ["project-card", "project-card--featured"];
  if (item.mediaVariant === "compact") cardClasses.push("project-card--compact-media");
  return `
    <article class="${cardClasses.join(" ")}">
      ${renderProjectMedia(item, index)}
      <div class="project-card-content">
        <div class="project-identity">
          <div class="project-kind">
            <span class="project-index">${String(index + 1).padStart(2, "0")}</span>
            <span class="project-type">${escapeHtml(item.type)}</span>
          </div>
          <div class="project-build">
            <span class="project-year">${escapeHtml(item.year)}</span>
            <span aria-hidden="true">·</span>
            <span>${escapeHtml(item.builtWith)}</span>
          </div>
        </div>
        <div class="project-title-row">
          ${renderProjectIcon(item)}
          <h3>${escapeHtml(item.title)}</h3>
        </div>
        <p>${escapeHtml(item.description)}</p>
        <div class="card-meta">${renderTags(tags)}</div>
        ${renderProjectMetrics(item)}
        ${renderInstallCommands(item)}
        ${renderLinks(item)}
      </div>
    </article>
  `;
}

function renderProjectIcon(item) {
  if (!item.iconUrl) return "";

  return `
    <span class="project-icon">
      <img
        src="${escapeAttribute(item.iconUrl)}"
        alt="${escapeAttribute(item.iconAlt || `${item.title}图标`)}"
        width="128"
        height="128"
        loading="eager"
      />
    </span>
  `;
}

function renderProjectMetrics(item) {
  if (!item.metrics?.length) return "";

  return `
    <div class="project-metrics" aria-label="${escapeAttribute(item.title)}使用数据">
      ${item.metrics
        .map(
          (metric) => `
            <span class="project-metric">
              <strong>${escapeHtml(metric.value)}</strong>
              <span>${escapeHtml(metric.label)}</span>
            </span>
          `
        )
        .join("")}
    </div>
  `;
}

function renderProjectMedia(item, index) {
  if (!item.imageUrl) {
    return `
      <div class="project-media project-media--placeholder" aria-hidden="true">
        <span class="project-visual-index">${String(index + 1).padStart(2, "0")}</span>
        ${
          item.iconUrl
            ? `<img class="project-visual-icon" src="${escapeAttribute(item.iconUrl)}" alt="" width="128" height="128" loading="eager" />`
            : ""
        }
        <strong>${escapeHtml(item.type)}</strong>
      </div>
    `;
  }

  return `
    <figure class="project-media">
      <img
        src="${escapeAttribute(item.imageUrl)}"
        alt="${escapeAttribute(item.imageAlt || item.title)}"
        width="${item.imageWidth || 1536}"
        height="${item.imageHeight || 1024}"
        loading="eager"
      />
    </figure>
  `;
}

function renderInstallCommands(item) {
  const commands = item.installCommands?.length
    ? item.installCommands
    : item.installCommand
      ? [{ label: "CLI 安装", command: item.installCommand }]
      : [];

  if (!commands.length) return "";

  return `
    <div class="install-commands" aria-label="安装 CLI">
      ${commands
        .map(
          (item) => `
            <div class="install-command">
              <span>${escapeHtml(item.label)}</span>
              <code>${escapeHtml(item.command)}</code>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function skillCard(item) {
  const tags = [item.category].filter(Boolean);
  return `
    <article class="skill-card">
      <div class="card-meta">${renderTags(tags)}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      ${renderLinks(item)}
    </article>
  `;
}

function renderTags(tags) {
  return tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("");
}

function renderLinks(item) {
  const links = [
    item.demoUrl && { href: item.demoUrl, label: item.demoLabel || "Demo" },
    item.sourceUrl && { href: item.sourceUrl, label: "GitHub 仓库" }
  ].filter(Boolean);

  if (!links.length) {
    return "";
  }

  return `
    <div class="card-links">
      ${links
        .map(
          (link) =>
            `<a class="text-link" href="${escapeAttribute(link.href)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`
        )
        .join("")}
    </div>
  `;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value = "") {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
