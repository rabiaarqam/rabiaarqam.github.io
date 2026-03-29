(function () {
  function initCarousel(root) {
    if (!root || root.dataset.inited === "1") return;
    const track = root.querySelector(".carousel__track");
    const slides = root.querySelectorAll(".carousel__slide");
    const prev = root.querySelector(".carousel__arrow--prev");
    const next = root.querySelector(".carousel__arrow--next");
    const dotsContainer = root.querySelector(".carousel__dots");
    const loop = root.hasAttribute("data-carousel-loop");
    const n = slides.length;
    if (!track || n === 0 || !dotsContainer) return;

    let index = 0;

    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "carousel__dot" + (i === 0 ? " is-active" : "");
      b.setAttribute("aria-label", `Slide ${i + 1} of ${n}`);
      b.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(b);
    });

    const dotButtons = () => dotsContainer.querySelectorAll(".carousel__dot");

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dotButtons().forEach((d, i) => d.classList.toggle("is-active", i === index));
      if (!loop && prev && next) {
        prev.disabled = index === 0;
        next.disabled = index === n - 1;
      }
    }

    function goTo(i) {
      if (loop) {
        index = ((i % n) + n) % n;
      } else {
        index = Math.max(0, Math.min(n - 1, i));
      }
      update();
    }

    root._carouselGoTo = goTo;

    if (prev) prev.addEventListener("click", () => goTo(loop ? index - 1 : index - 1));
    if (next) next.addEventListener("click", () => goTo(loop ? index + 1 : index + 1));

    root.dataset.inited = "1";
    update();
  }

  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const panel = root.closest(".memory-panel");
    if (panel && panel.hasAttribute("hidden")) return;
    initCarousel(root);
  });

  document.querySelectorAll(".memory-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.getAttribute("aria-controls");
      document.querySelectorAll(".memory-tab").forEach((t) => {
        const on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      document.querySelectorAll(".memory-panel").forEach((p) => {
        const show = p.id === id;
        p.hidden = !show;
        p.classList.toggle("is-active", show);
      });
      const panel = document.getElementById(id);
      const car = panel && panel.querySelector("[data-carousel]");
      if (car) {
        initCarousel(car);
        if (car._carouselGoTo) car._carouselGoTo(0);
      }
    });
  });

  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");
  const proposalButtons = document.getElementById("proposalButtons");
  const noHint = document.getElementById("noHint");
  const celebration = document.getElementById("celebration");
  const closeCelebration = document.getElementById("closeCelebration");

  const NO_FUNNY_MESSAGES = [
    "Nice try 😏 On this screen you only get one real option: Yes.",
    "Cute tap. That button is basically decoration. Yes is the answer.",
    "Ha! No is on holiday. Yes is working overtime right here.",
    "The universe checked your choice and said: invalid. Try Yes.",
    "Almost… but between us there is no Plan B. Only Yes.",
    "Funny. Even this button knows it loses to Yes every time.",
    "That was adorable. Still: one ring, one answer, and it is not No.",
  ];

  function showRandomNoHint() {
    if (!noHint) return;
    noHint.textContent = NO_FUNNY_MESSAGES[Math.floor(Math.random() * NO_FUNNY_MESSAGES.length)];
    noHint.hidden = false;
  }

  function resetNoButton() {
    if (!btnNo) return;
    btnNo.style.left = "15%";
    btnNo.style.top = "120px";
    btnNo.style.transform = "rotate(0deg)";
  }

  function moveNoButton() {
    if (!proposalButtons || !btnNo) return;
    const pad = 8;
    const container = proposalButtons.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();
    const maxLeft = container.width - btnRect.width - pad;
    const maxTop = container.height - btnRect.height - pad;
    const left = pad + Math.random() * Math.max(0, maxLeft - pad);
    const top = pad + Math.random() * Math.max(0, maxTop - pad);
    btnNo.style.left = `${left}px`;
    btnNo.style.top = `${top}px`;
    btnNo.style.transform = `rotate(${Math.random() * 8 - 4}deg)`;
    showRandomNoHint();
  }

  function spawnFloatingHearts() {
    if (!celebration) return;
    const count = 24;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "float-heart";
      el.textContent = ["💕", "✨", "💗", "🤍"][i % 4];
      el.setAttribute("aria-hidden", "true");
      el.style.left = `${Math.random() * 100}%`;
      el.style.animationDuration = `${2.5 + Math.random() * 2}s`;
      el.style.animationDelay = `${Math.random() * 0.5}s`;
      el.style.fontSize = `${0.9 + Math.random() * 0.8}rem`;
      celebration.appendChild(el);
    }
    setTimeout(() => {
      celebration.querySelectorAll(".float-heart").forEach((n) => n.remove());
    }, 5000);
  }

  if (btnYes) {
    btnYes.addEventListener("click", () => {
      resetNoButton();
      if (noHint) noHint.hidden = true;
      celebration.hidden = false;
      spawnFloatingHearts();
    });
  }

  if (closeCelebration) {
    closeCelebration.addEventListener("click", () => {
      celebration.hidden = true;
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && celebration && !celebration.hidden) {
      celebration.hidden = true;
    }
  });

  if (btnNo) {
    btnNo.addEventListener("mouseenter", moveNoButton);
    btnNo.addEventListener(
      "pointerdown",
      (e) => {
        e.preventDefault();
        moveNoButton();
      },
      { passive: false }
    );
  }

  const style = document.createElement("style");
  style.textContent = `
    .float-heart {
      position: fixed;
      bottom: -2rem;
      pointer-events: none;
      z-index: 201;
      animation: floatUp linear forwards;
      opacity: 0.9;
    }
    @keyframes floatUp {
      from { transform: translateY(0) rotate(0deg); opacity: 0.9; }
      to { transform: translateY(-100vh) rotate(20deg); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();
