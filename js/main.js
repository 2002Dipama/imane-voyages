(function () {
  'use strict';

  // --- Header scroll effect ---
  var header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --- Mobile menu ---
  var menuToggle = document.getElementById('menu-toggle');
  var mainNav = document.getElementById('main-nav');
  var overlay = document.getElementById('mobile-overlay');

  function openMenu() {
    mainNav.classList.add('open');
    overlay.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mainNav.classList.remove('open');
    overlay.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    var closeLinks = mainNav.querySelectorAll('[data-close-menu]');
    closeLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // --- Hero slideshow ---
  var slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 5000);
  }

  // --- Animated counters ---
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function (c) {
      counterObserver.observe(c);
    });
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = Math.floor(eased * target);
      el.textContent = val.toLocaleString('fr-FR');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('fr-FR');
      }
    }

    requestAnimationFrame(step);
  }

  // --- Scroll animations ---
  var scrollEls = document.querySelectorAll('[data-scroll]');
  if (scrollEls.length > 0) {
    var scrollObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute('data-delay');
          if (delay) {
            setTimeout(function () {
              entry.target.classList.add('visible');
            }, parseInt(delay, 10));
          } else {
            entry.target.classList.add('visible');
          }
          scrollObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    scrollEls.forEach(function (el) {
      scrollObserver.observe(el);
    });

    document.body.classList.add('js-ready');
  }

  // --- Scroll to top ---
  var scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Testimonials slider ---
  var track = document.getElementById('testimonials-track');
  var prevBtn = document.getElementById('testimonial-prev');
  var nextBtn = document.getElementById('testimonial-next');

  if (track && prevBtn && nextBtn) {
    var scrollAmount = 404;

    nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var top = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // --- WhatsApp contact form ---
  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var prenom = document.getElementById('prenom').value.trim();
      var nom = document.getElementById('nom').value.trim();
      var email = document.getElementById('email').value.trim();
      var tel = document.getElementById('telephone').value.trim();
      var serviceEl = document.getElementById('service');
      var service = serviceEl.options[serviceEl.selectedIndex].text;
      var message = document.getElementById('message').value.trim();

      var text = 'Bonjour Imane Voyages,\n\n';
      text += '*Nom :* ' + prenom + ' ' + nom + '\n';
      if (email) text += '*Email :* ' + email + '\n';
      if (tel) text += '*Téléphone :* ' + tel + '\n';
      if (serviceEl.value) text += '*Service :* ' + service + '\n';
      if (message) text += '\n*Message :*\n' + message;

      var url = 'https://wa.me/22670432533?text=' + encodeURIComponent(text);
      window.open(url, '_blank');
    });
  }

  // --- Typewriter animation ---
  var typewriterEls = document.querySelectorAll('[data-typewriter]');
  if (typewriterEls.length > 0) {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function typewrite(el) {
      var text = el.getAttribute('data-typewriter');
      var speed = parseInt(el.getAttribute('data-typewriter-speed') || '50', 10);
      el.textContent = '';
      var cursor = document.createElement('span');
      cursor.className = 'typewriter-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      el.appendChild(cursor);

      var i = 0;
      function type() {
        if (i < text.length) {
          el.insertBefore(document.createTextNode(text.charAt(i)), cursor);
          i++;
          setTimeout(type, speed);
        } else {
          cursor.classList.add('done');
        }
      }
      type();
    }

    var twObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (prefersReduced) {
            entry.target.textContent = entry.target.getAttribute('data-typewriter');
          } else {
            var delay = parseInt(entry.target.getAttribute('data-typewriter-delay') || '300', 10);
            setTimeout(function () { typewrite(entry.target); }, delay);
          }
          twObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    typewriterEls.forEach(function (el) {
      el.setAttribute('aria-label', el.getAttribute('data-typewriter'));
      if (!prefersReduced) el.textContent = '';
      twObserver.observe(el);
    });
  }

})();
