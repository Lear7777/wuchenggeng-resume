(() => {
  "use strict";

  const data = window.resumeContent;
  if (!data) return;

  let lastTrigger = null;
  let previousOverflow = "";

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const getByPath = (root, path) => path.split(".").reduce((value, key) => value?.[key], root);

  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = value || "";
  };

  const setProfile = () => {
    document.querySelectorAll("[data-profile]").forEach((node) => {
      const value = data.profile[node.dataset.profile];
      if (value) node.textContent = value;
    });
    document.querySelectorAll("[data-profile-link='email']").forEach((node) => {
      node.href = `mailto:${data.profile.email}`;
      if (!node.textContent) node.textContent = data.profile.email;
    });
  };

  const renderEducation = () => {
    data.education.forEach((item) => {
      setText(`[data-education='${item.id}.kicker']`, item.kicker);
      setText(`[data-education='${item.id}.period']`, item.period);
      setText(`[data-education='${item.id}.degree']`, item.degree);
      setText(`[data-education='${item.id}.title']`, item.title);
      setText(`[data-education='${item.id}.summary']`, item.summary);
      const schoolRoot = document.querySelector(`[data-education-schools='${item.id}']`);
      if (schoolRoot) {
        schoolRoot.innerHTML = item.schools.map((school, index) => `
          <article class="school-card reveal">
            <div class="school-card__image"><img src="${escapeHtml(school.image)}" alt="${escapeHtml(school.alt)}" loading="lazy" /></div>
            <span class="school-card__number">0${index + 1}</span>
            <span class="school-card__label">${escapeHtml(school.label)}</span>
            <h3>${escapeHtml(school.name)}</h3>
            <p>${escapeHtml(school.english)}</p>
          </article>`).join("");
      }
      const factRoot = document.querySelector(`[data-education-facts='${item.id}']`);
      if (factRoot) factRoot.innerHTML = item.facts.map((fact) => `<span>${escapeHtml(fact)}</span>`).join("");
    });
  };

  const renderSkills = () => {
    ["core", "support"].forEach((group) => {
      const root = document.querySelector(`[data-skill-grid='${group}']`);
      if (!root) return;
      root.innerHTML = data.skills.filter((skill) => skill.group === group).map((skill) => `
        <button class="skill-card skill-card--${escapeHtml(skill.group)} reveal" type="button" data-skill-id="${escapeHtml(skill.id)}" aria-haspopup="dialog">
          <strong>${escapeHtml(skill.label)}</strong>
        </button>`).join("");
    });
  };

  const renderInternships = () => {
    const root = document.querySelector("[data-internship-list]");
    if (!root) return;
    root.innerHTML = data.internships.map((item, index) => `
      <article class="internship-record reveal">
        <time class="internship-record__date">${escapeHtml(item.date)}</time>
        <div class="internship-record__main">
          <span class="eyebrow">RECORD / 0${index + 1}</span>
          <h3>${escapeHtml(item.org)}</h3>
          <p class="internship-record__role">${escapeHtml(item.role)}</p>
          <p class="internship-record__title">${escapeHtml(item.title)}</p>
          <ul>${item.facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>
        </div>
      </article>`).join("");
  };

  const renderProjects = () => {
    const root = document.querySelector("[data-project-list]");
    if (!root) return;
    root.innerHTML = data.projects.map((project, index) => `
      <article class="project-record reveal">
        <div class="project-record__index">0${index + 1}</div>
        <div class="project-record__main"><span class="eyebrow">${escapeHtml(project.label)}</span><h3>${escapeHtml(project.name)}</h3><p>${escapeHtml(project.summary)}</p></div>
        <div class="project-record__meta"><strong>${escapeHtml(project.role)}</strong><div>${project.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div></div>
      </article>`).join("");
  };

  const openModal = (skill, trigger) => {
    const modal = document.querySelector("[data-modal]");
    const body = document.querySelector("[data-modal-body]");
    const panel = document.querySelector(".modal__panel");
    if (!modal || !body || !panel) return;
    lastTrigger = trigger;
    body.innerHTML = `
      <div class="modal__top"><span class="eyebrow">CAPABILITY FILE / ${escapeHtml(skill.number)}</span><span class="scene-code">${escapeHtml(skill.micro)}</span></div>
      <h2 id="modal-title">${escapeHtml(skill.label)}</h2>
      <p class="modal__description">${escapeHtml(skill.description)}</p>
      <div class="modal__sections">
        <section><span>TOOLS / 工具</span><div class="modal__tags">${skill.tools.map((item) => `<b>${escapeHtml(item)}</b>`).join("")}</div></section>
        <section><span>PROJECTS / 项目</span><ul>${skill.projects.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
        <section><span>ACTIONS / 具体工作</span><ul>${skill.actions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
        <section><span>OUTPUTS / 产出</span><ul>${skill.outputs.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
      </div>`;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => panel.focus());
  };

  const closeModal = () => {
    const modal = document.querySelector("[data-modal]");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = previousOverflow;
    lastTrigger?.focus();
  };

  const setupModal = () => {
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-skill-id]");
      if (trigger) {
        const skill = data.skills.find((item) => item.id === trigger.dataset.skillId);
        if (skill) openModal(skill, trigger);
      }
      if (event.target.closest("[data-modal-close]")) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });
  };

  const setupReveal = () => {
    const revealItems = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -5%" });
    revealItems.forEach((item) => observer.observe(item));
  };

  const setupNav = () => {
    const sections = [...document.querySelectorAll("[data-section]")];
    const navLinks = [...document.querySelectorAll("[data-nav]")];
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.dataset.nav === entry.target.dataset.section;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "step");
          else link.removeAttribute("aria-current");
        });
      });
    }, { threshold: .4 });
    sections.forEach((section) => observer.observe(section));
  };

  const init = () => {
    setProfile();
    renderEducation();
    renderInternships();
    renderSkills();
    renderProjects();
    setupModal();
    setupReveal();
    setupNav();
    setText("[data-footer='line']", data.footer.line);
    setText("[data-footer='subline']", data.footer.subline);
    setText("[data-footer='copyright']", data.footer.copyright);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
