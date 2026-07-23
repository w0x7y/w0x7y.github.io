// Project data
// Add as many entries as you like - only the first 2 show in the
// Projects section, the popup shows all of them.
const projects = [
  {
      tag: 'Coming soon',
      title: 'Project One',
      description: "A short description of this project will go here, what it does and why it's interesting.",
      stack: ['Tech', 'Stack'],
      liveUrl: '#',
      codeUrl: '#'
  },
  {
      tag: 'Coming soon',
      title: 'Project Two',
      description: "A short description of this project will go here, what it does and why it's interesting.",
      stack: ['Tech', 'Stack'],
      liveUrl: '#',
      codeUrl: '#'
  },
  {
      tag: 'Coming soon',
      title: 'Project Three',
      description: "A short description of this project will go here, what it does and why it's interesting.",
      stack: ['Tech', 'Stack'],
      liveUrl: '#',
      codeUrl: '#'
  },
  {
      tag: 'Coming soon',
      title: 'Project Four',
      description: "A short description of this project will go here, what it does and why it's interesting.",
      stack: ['Tech', 'Stack'],
      liveUrl: '#',
      codeUrl: '#'
  },
  {
      tag: 'Coming soon',
      title: 'Project Four',
      description: "A short description of this project will go here, what it does and why it's interesting.",
      stack: ['Tech', 'Stack'],
      liveUrl: '#',
      codeUrl: '#'
  }
];

function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';

    const stackItems = project.stack
        .map((item) => `<li>${item}</li>`)
        .join('');

    card.innerHTML = `
        <div class="project-thumb" aria-hidden="true">
            <span class="project-thumb-icon">◆</span>
        </div>
        <div class="project-body">
            <p class="project-tag">${project.tag}</p>
            <h3>${project.title}</h3>
            <p class="project-desc">${project.description}</p>
            <ul class="project-stack">${stackItems}</ul>
            <div class="project-links">
                <a href="${project.liveUrl}" aria-label="View live project">Live</a>
                <a href="${project.codeUrl}" aria-label="View source code">Code</a>
            </div>
        </div>
    `;

    return card;
}

function renderProjects(list, container) {
    if (!container) return;
    container.innerHTML = '';
    list.forEach((project) => {
        container.appendChild(createProjectCard(project));
    });
}

const projectsGrid = document.getElementById('projectsGrid');
const modalProjectsGrid = document.getElementById('modalProjectsGrid');

renderProjects(projects.slice(0, 2), projectsGrid);
renderProjects(projects, modalProjectsGrid);

// Projects "View more" popup
const viewMoreBtn = document.getElementById('viewMoreBtn');
const projectsModalOverlay = document.getElementById('projectsModalOverlay');
const projectsModalClose = document.getElementById('projectsModalClose');

function openProjectsModal() {
    projectsModalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeProjectsModal() {
    projectsModalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
}

if (viewMoreBtn && projectsModalOverlay && projectsModalClose) {
    viewMoreBtn.addEventListener('click', openProjectsModal);
    projectsModalClose.addEventListener('click', closeProjectsModal);

    projectsModalOverlay.addEventListener('click', (event) => {
        if (event.target === projectsModalOverlay) {
            closeProjectsModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && projectsModalOverlay.classList.contains('is-open')) {
            closeProjectsModal();
        }
    });
}
