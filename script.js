const pages = [...document.querySelectorAll('.main-content > article')];
const navLinks = [...document.querySelectorAll('.navbar-link')];
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.work-card')];
function filterProjects(category) {
  let count = 0;
  cards.forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; if (!card.hidden) count++; });
  filters.forEach(button => { const active = button.dataset.filter === category; button.classList.toggle('selected', active); button.setAttribute('aria-pressed', String(active)); });
  document.querySelector('.empty-state').hidden = count !== 0;
  document.querySelector('.results-count').textContent = `${count} project${count === 1 ? '' : 's'}`;
}
function showPage() {
  const hash = location.hash.slice(1) || 'about';
  const aliases = { 'master-projects': 'master', 'game-jam': 'jam', 'personal-projects': 'personal' };
  const id = aliases[hash] ? 'portfolio' : pages.some(p => p.id === hash) ? hash : 'about';
  pages.forEach(page => { const active = page.id === id; page.classList.toggle('active', active); page.hidden = !active; });
  navLinks.forEach(link => { const active = link.hash === `#${id}`; link.classList.toggle('active', active); if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
  if (aliases[hash]) filterProjects(aliases[hash]);
  // Stop videos when their page is left.
  if (id !== 'portfolio') document.querySelectorAll('iframe').forEach(frame => { if (frame.dataset.playbackVisited) { frame.src = frame.src; delete frame.dataset.playbackVisited; } });
  else document.querySelectorAll('iframe').forEach(frame => frame.dataset.playbackVisited = 'true');
}
filters.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.info_more-btn');
toggle.addEventListener('click', () => { const active = sidebar.classList.toggle('active'); toggle.setAttribute('aria-expanded', String(active)); toggle.textContent = active ? 'Hide contacts ▴' : 'Contacts ▾'; });
window.addEventListener('hashchange', () => { showPage(); window.scrollTo({top:0, behavior:'instant'}); });
document.getElementById('year').textContent = new Date().getFullYear();
filterProjects('all'); showPage();

// Personal contributions for each team project.
const projectContributions = {
  "Build Failed": [
    "Built a C++ VFX framework and created and integrated effects using Niagara and Unreal Engine’s Material system.",
    "Implemented network synchronization for visual effects in multiplayer gameplay.",
    "Developed moving platforms, automatic sliding doors, and a PD-controller-based airflow mechanic.",
    "Resolved some network synchronization issues."
  ],
  "Knight to Sky": [
    "Implemented state-machine-based game flow management.",
    "Developed platform generation algorithms and handled platform movement and removal.",
    "Integrated pickups and programmed sound effects.",
    "Implemented the game UI."
  ],
  "TunTunTotem": [
    "Implemented the game flow from start to game over.",
    "Programmed sound effects and managed the game’s physics behavior.",
    "Implemented the game UI."
  ],
  "Paopao": [
  "Created 2D tile-based maps.",
  "Created character and bomb animations.",
  "Implemented background music with FMOD, using smooth fade transitions to adapt the music to the current gameplay situation.",
  "Created a shader-based spotlight effect."
]
};
const contributionDialog = document.getElementById('contributions-dialog');
let contributionTrigger;
document.querySelectorAll('[data-contribution]').forEach(button => {
  button.addEventListener('click', () => {
    contributionTrigger = button;
    const project = button.dataset.contribution;
    document.getElementById('contributions-project').textContent = project;
    const body = document.getElementById('contributions-body');
    const contributions = projectContributions[project] || [];
    body.replaceChildren();
    if (contributions.length) {
      const list = document.createElement('ul');
      list.className = 'contribution-list';
      contributions.forEach(text => {
        const item = document.createElement('li');
        item.textContent = text;
        list.appendChild(item);
      });
      body.appendChild(list);
    } else {
      body.textContent = 'Contribution details will be added soon.';
    }
    contributionDialog.showModal();
    document.body.classList.add('contribution-open');
  });
});
contributionDialog.querySelector('.contribution-close').addEventListener('click', () => contributionDialog.close());
contributionDialog.addEventListener('click', event => {
  const rect = contributionDialog.getBoundingClientRect();
  if (event.target === contributionDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) contributionDialog.close();
});
contributionDialog.addEventListener('close', () => {
  document.body.classList.remove('contribution-open');
  contributionTrigger?.focus();
});
window.addEventListener('hashchange', () => { if (contributionDialog.open) contributionDialog.close(); });
