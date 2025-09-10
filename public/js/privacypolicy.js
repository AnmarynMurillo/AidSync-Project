// Privacy Policy enhancements: smooth anchors, active TOC highlight, back-to-top, and dynamic year
(function(){
  const yearEl = document.getElementById('pp-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth-scroll for in-page anchors
  document.querySelectorAll('.pp-toc a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = id && document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', id);
      }
    });
  });

  // Active link highlight using IntersectionObserver
  const tocLinks = Array.from(document.querySelectorAll('.pp-toc a[href^="#"]'));
  const linkById = new Map(tocLinks.map(a => [a.getAttribute('href'), a]));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = linkById.get(id);
      if (!link) return;
      if (entry.isIntersecting) {
        tocLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-40% 0% -55% 0%', threshold: 0.01 });

  document.querySelectorAll('.pp-section[id]').forEach(sec => observer.observe(sec));

  // Back to top
  const backBtn = document.getElementById('pp-back-to-top');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
