document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('is-open');
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const dialog = document.getElementById('capability-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    const content = dialog.querySelector('.dialog-content');
    let opener;

    function addPopup(card, details, copySelector) {
      const title = details.querySelector('summary h3').textContent;
      const heading = document.createElement('h3');
      heading.className = 'capability-heading';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'capability-trigger';
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-controls', 'capability-dialog');
      button.textContent = title;
      heading.append(button);
      details.hidden = true;
      card.append(heading);

      button.addEventListener('click', () => {
        opener = button;
        const titleElement = document.createElement('h2');
        titleElement.id = 'capability-dialog-title';
        titleElement.textContent = title;
        const copy = details.querySelector(copySelector).cloneNode(true);
        const sourceImage = card.querySelector('img');
        if (sourceImage) {
          const image = sourceImage.cloneNode(true);
          image.loading = 'eager';
          content.replaceChildren(image, titleElement, copy);
        } else {
          content.replaceChildren(titleElement, copy);
        }
        dialog.showModal();
        document.body.classList.add('dialog-open');
      });
    }

    document.querySelectorAll('.capability-card').forEach((card) => {
      addPopup(card, card.querySelector('.capability-details'), '.capability-copy');
    });

    document.querySelectorAll('details.research-card').forEach((details) => {
      const card = document.createElement('article');
      card.className = 'info-card research-card research-popup';
      details.replaceWith(card);
      card.append(details);
      addPopup(card, details, '.research-card-content');
    });

    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom)) {
        dialog.close();
      }
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      opener?.focus({ preventScroll: true });
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
