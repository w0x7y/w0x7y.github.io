// Project data
// Add as many entries as you like - only the first 2 show in the
// Projects section, the popup shows all of them.
// imageUrl is optional: leave it out (or set to '') to fall back to the
// default purple placeholder thumbnail.
const projects = [
  {
    tag: "Coming soon",
    title: "Project One",
    description:
      "A short description of this project will go here, what it does and why it's interesting.",
    stack: ["Tech", "Stack"],
    imageUrl: "",
    repoUrl: "#",
    createdDate: "TBD",
  },
  {
    tag: "Coming soon",
    title: "Project Two",
    description:
      "A short description of this project will go here, what it does and why it's interesting.",
    stack: ["Tech", "Stack"],
    imageUrl: "",
    repoUrl: "#",
    createdDate: "TBD",
  },
  {
    tag: "Coming soon",
    title: "Project Three",
    description:
      "A short description of this project will go here, what it does and why it's interesting.",
    stack: ["Tech", "Stack"],
    imageUrl: "",
    repoUrl: "#",
    createdDate: "TBD",
  },
  {
    tag: "Coming soon",
    title: "Project Four",
    description:
      "A short description of this project will go here, what it does and why it's interesting.",
    stack: ["Tech", "Stack"],
    imageUrl: "",
    repoUrl: "#",
    createdDate: "TBD",
  },
  {
    tag: "Coming soon",
    title: "Project Five",
    description:
      "A short description of this project will go here, what it does and why it's interesting.",
    stack: ["Tech", "Stack"],
    imageUrl: "",
    repoUrl: "#",
    createdDate: "TBD",
  },
  {
    tag: "Coming soon",
    title: "Project Six",
    description:
      "A short description of this project will go here, what it does and why it's interesting.",
    stack: ["Tech", "Stack"],
    imageUrl: "",
    repoUrl: "#",
    createdDate: "TBD",
  },
  {
    tag: "Coming soon",
    title: "Project Seven",
    description:
      "A short description of this project will go here, what it does and why it's interesting.",
    stack: ["Tech", "Stack"],
    imageUrl: "",
    repoUrl: "#",
    createdDate: "TBD",
  },
  {
    tag: "Coming soon",
    title: "Project Eight",
    description:
      "A short description of this project will go here, what it does and why it's interesting.",
    stack: ["Tech", "Stack"],
    imageUrl: "",
    repoUrl: "#",
    createdDate: "TBD",
  },
];

const htmlDocument = document.querySelector("html");

function themeSwitch() {
  if (htmlDocument.hasAttribute("data-theme")) {
    htmlDocument.removeAttribute("data-theme");
  } else {
    htmlDocument.setAttribute("data-theme", "dark");
  }
}

const themeToggleBtn = document.getElementById("themeToggleBtn");

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", themeSwitch);
}

function createProjectThumb(project) {
  return project.imageUrl
    ? `<img class="project-image" src="${project.imageUrl}" alt="${project.title} preview">`
    : `<span class="project-thumb-icon">◆</span>`;
}

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";

  const stackItems = project.stack.map((item) => `<li>${item}</li>`).join("");

  card.innerHTML = `
        <div class="project-thumb" aria-hidden="true">
            ${createProjectThumb(project)}
        </div>
        <div class="project-body">
            <p class="project-tag">${project.tag}</p>
            <h3>${project.title}</h3>
            <p class="project-desc">${project.description}</p>
            <ul class="project-stack">${stackItems}</ul>
            <div class="project-links">
                <a href="${project.repoUrl}" aria-label="View source repo">Repo</a>
                <span class="project-date">${project.createdDate}</span>
            </div>
        </div>
    `;

  return card;
}

function renderProjects(list, container) {
  if (!container) return;
  container.innerHTML = "";
  list.forEach((project) => {
    container.appendChild(createProjectCard(project));
  });
}

const projectsGrid = document.getElementById("projectsGrid");

renderProjects(projects.slice(0, 2), projectsGrid);

// Projects modal: list on the left, extended details on the right
const modalProjectsList = document.getElementById("modalProjectsList");
const modalProjectDetail = document.getElementById("modalProjectDetail");

function createListItem(project, index) {
  const item = document.createElement("button");
  item.type = "button";
  item.className = "modal-list-item";
  item.dataset.index = index;
  item.innerHTML = `
        <span class="modal-list-tag">${project.tag}</span>
        <span class="modal-list-title">${project.title}</span>
    `;
  return item;
}

function renderProjectDetail(project) {
  if (!modalProjectDetail) return;

  const stackItems = project.stack.map((item) => `<li>${item}</li>`).join("");

  modalProjectDetail.innerHTML = `
        <div class="project-thumb" aria-hidden="true">
            ${createProjectThumb(project)}
        </div>
        <p class="project-tag">${project.tag}</p>
        <h3>${project.title}</h3>
        <p class="modal-detail-desc">${project.longDescription || project.description}</p>
        <ul class="project-stack">${stackItems}</ul>
        <div class="project-links">
            <a href="${project.repoUrl}" aria-label="View source repo">Repo</a>
            <span class="project-date">${project.createdDate}</span>
        </div>
    `;
}

function selectProject(index) {
  if (!modalProjectsList) return;

  modalProjectsList.querySelectorAll(".modal-list-item").forEach((item) => {
    item.classList.toggle("is-active", Number(item.dataset.index) === index);
  });

  renderProjectDetail(projects[index]);
}

function renderProjectsModal(list) {
  if (!modalProjectsList) return;

  modalProjectsList.innerHTML = "";
  list.forEach((project, index) => {
    const item = createListItem(project, index);
    item.addEventListener("click", () => selectProject(index));
    modalProjectsList.appendChild(item);
  });

  if (list.length > 0) {
    selectProject(0);
  }
}

renderProjectsModal(projects);

// Projects "View more" popup
const viewMoreBtn = document.getElementById("viewMoreBtn");
const projectsModalOverlay = document.getElementById("projectsModalOverlay");
const projectsModalClose = document.getElementById("projectsModalClose");

function openProjectsModal() {
  projectsModalOverlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeProjectsModal() {
  projectsModalOverlay.classList.remove("is-open");
  document.body.style.overflow = "";
}

if (viewMoreBtn && projectsModalOverlay && projectsModalClose) {
  viewMoreBtn.addEventListener("click", openProjectsModal);
  projectsModalClose.addEventListener("click", closeProjectsModal);

  projectsModalOverlay.addEventListener("click", (event) => {
    if (event.target === projectsModalOverlay) {
      closeProjectsModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      projectsModalOverlay.classList.contains("is-open")
    ) {
      closeProjectsModal();
    }
  });
}

// Scroll reveal: fade/rise elements in as they enter the viewport
const revealTargets = document.querySelectorAll(".reveal, .reveal-stagger");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealTargets.length && !prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
} else {
  // No IntersectionObserver support, or the user prefers reduced motion:
  // just show everything immediately.
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

// Profile card: subtle cursor-follow tilt for a bit of playful depth
const profileCard = document.querySelector(".profile-card");

if (profileCard && !prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
  const maxTilt = 8;

  const handlePointerMove = (event) => {
    const rect = profileCard.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = (-relY * maxTilt).toFixed(2);
    const rotateY = (relX * maxTilt).toFixed(2);
    profileCard.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const resetTilt = () => {
    profileCard.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg)";
  };

  // Wait for the load-in animation to finish before enabling the
  // transform-based tilt, so the two don't fight each other.
  profileCard.addEventListener("animationend", () => {
    profileCard.classList.add("tilt-ready");
    profileCard.addEventListener("mousemove", handlePointerMove);
    profileCard.addEventListener("mouseleave", resetTilt);
  }, { once: true });
}

// Contact: copy email address to clipboard
const contactCopyBtn = document.getElementById("contactCopyBtn");
const contactEmailText = document.getElementById("contactEmailText");

if (contactCopyBtn && contactEmailText) {
  let copyResetTimer = null;

  contactCopyBtn.addEventListener("click", async () => {
    const email = contactEmailText.textContent.trim();
    const defaultLabel =
      contactCopyBtn.dataset.defaultLabel || "Copy email address";
    const copiedLabel =
      contactCopyBtn.dataset.copiedLabel || "Copied to clipboard!";

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const tempInput = document.createElement("textarea");
        tempInput.value = email;
        tempInput.style.position = "fixed";
        tempInput.style.opacity = "0";
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      contactCopyBtn.textContent = copiedLabel;
      contactCopyBtn.classList.add("is-copied");

      if (copyResetTimer) clearTimeout(copyResetTimer);
      copyResetTimer = setTimeout(() => {
        contactCopyBtn.textContent = defaultLabel;
        contactCopyBtn.classList.remove("is-copied");
      }, 2000);
    } catch (err) {
      console.error("Could not copy email:", err);
    }
  });
}
