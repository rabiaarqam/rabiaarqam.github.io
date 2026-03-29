(function () {
  const modal = document.getElementById("proposalModal");
  const openBtn = document.getElementById("openProposal");
  const closeBtn = document.getElementById("closeProposal");
  const backdrop = document.getElementById("proposalBackdrop");
  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");
  const proposalButtons = document.getElementById("proposalButtons");
  const noHint = document.getElementById("noHint");
  const celebration = document.getElementById("celebration");
  const closeCelebration = document.getElementById("closeCelebration");

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    resetNoButton();
    noHint.hidden = true;
    openBtn.setAttribute("aria-expanded", "true");
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    openBtn.setAttribute("aria-expanded", "false");
  }

  function resetNoButton() {
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
    noHint.hidden = false;
  }

  function spawnFloatingHearts() {
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

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
    if (e.key === "Escape" && celebration && !celebration.hidden) {
      celebration.hidden = true;
    }
  });

  btnYes.addEventListener("click", () => {
    closeModal();
    celebration.hidden = false;
    spawnFloatingHearts();
  });

  closeCelebration.addEventListener("click", () => {
    celebration.hidden = true;
  });

  btnNo.addEventListener("mouseenter", moveNoButton);
  btnNo.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveNoButton();
  }, { passive: false });

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
