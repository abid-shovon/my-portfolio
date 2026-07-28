document.addEventListener('DOMContentLoaded', () => {

  // --- MOBILE MENU TOGGLE ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when links are clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  // --- HERO TYPING ANIMATION ---
  const typingText = document.getElementById('typing-text');
  const professions = [
    'Network Engineer',
    'MikroTik & Cisco Administrator',
    'Fortinet Firewall Management',
    'Red Hat System Administrator'
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentWord = professions[wordIndex];
    if (isDeleting) {
      charIndex--;
      typingSpeed = 50; // Deleting is faster
    } else {
      charIndex++;
      typingSpeed = 100;
    }

    typingText.textContent = currentWord.substring(0, charIndex);

    // Typing complete
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1500; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % professions.length;
      typingSpeed = 500; // Pause before next word
    }

    setTimeout(typeEffect, typingSpeed);
  }
  
  if (typingText) {
    typeEffect();
  }

  // --- SKILLS TAB SYSTEM & ANIMATION ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function animateSkillBars(panel) {
    const progressBars = panel.querySelectorAll('.skill-bar-progress');
    progressBars.forEach(bar => {
      const width = bar.getAttribute('data-width');
      bar.style.width = width;
    });
  }

  function resetSkillBars(panel) {
    const progressBars = panel.querySelectorAll('.skill-bar-progress');
    progressBars.forEach(bar => {
      bar.style.width = '0';
    });
  }

  // Initialize first panel animations
  const initialPanel = document.querySelector('.tab-panel.active');
  if (initialPanel) {
    // Delay slightly to wait for layout/render
    setTimeout(() => animateSkillBars(initialPanel), 300);
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      
      // Toggle button states
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Toggle panel states
      tabPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
          animateSkillBars(panel);
        } else {
          panel.classList.remove('active');
          resetSkillBars(panel);
        }
      });
    });
  });

  // --- INTERSECTION OBSERVER FOR SECTIONS & NAV STATE ---
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links li');

  const navObserverOptions = {
    root: null,
    threshold: 0.3, // Highlight if 30% of section is visible
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          const link = item.querySelector('a');
          if (link && link.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => {
    navObserver.observe(section);
  });

  // Header Scroll Shadow
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.5)';
      header.style.borderBottom = '1px solid rgba(0, 242, 254, 0.1)';
    } else {
      header.style.boxShadow = 'none';
      header.style.borderBottom = '1px solid var(--border-color)';
    }
  });

  // --- INTERACTIVE NETWORK BACKGROUND CANVAS ---
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = (canvas.width = window.innerWidth);
      height = (canvas.height = window.innerHeight);
    });

    const particles = [];
    const particleCount = Math.min(65, Math.floor((width * height) / 18000)); // Dynamic node count
    const connectionDistance = 140;

    const mouse = {
      x: null,
      y: null,
      radius: 180
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1.5;
        this.color = Math.random() > 0.35 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(5, 248, 150, 0.4)';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse attraction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw network links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            // Stronger opacity for closer distances
            const opacity = (1 - dist / connectionDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Connect mouse to nodes
      if (mouse.x !== null && mouse.y !== null) {
        particles.forEach(p => {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius - 30) {
            const opacity = (1 - dist / (mouse.radius - 30)) * 0.15;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(5, 248, 150, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  // --- CONTACT FORM HANDLING ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value;

      // Premium visual confirmation popup (dynamic overlay)
      const popup = document.createElement('div');
      popup.style.position = 'fixed';
      popup.style.bottom = '20px';
      popup.style.right = '20px';
      popup.style.backgroundColor = 'var(--bg-tertiary)';
      popup.style.color = 'var(--accent-emerald)';
      popup.style.border = '1px solid var(--accent-emerald)';
      popup.style.padding = '1rem 2rem';
      popup.style.borderRadius = '8px';
      popup.style.boxShadow = '0 0 15px rgba(5, 248, 150, 0.2)';
      popup.style.fontFamily = 'var(--font-heading)';
      popup.style.zIndex = '1000';
      popup.style.display = 'flex';
      popup.style.alignItems = 'center';
      popup.style.gap = '0.75rem';
      popup.style.opacity = '0';
      popup.style.transform = 'translateY(20px)';
      popup.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

      popup.innerHTML = `<i class="fa-solid fa-circle-check"></i> Message sent successfully, ${name}!`;
      document.body.appendChild(popup);

      // Trigger animation
      setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'translateY(0)';
      }, 50);

      // Reset Form
      contactForm.reset();
      
      // Floating labels reset check
      const inputs = contactForm.querySelectorAll('.form-input');
      inputs.forEach(input => {
        input.blur();
      });

      // Remove popup after delay
      setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transform = 'translateY(20px)';
        setTimeout(() => popup.remove(), 400);
      }, 4000);
    });
  }

});
