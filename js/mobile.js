function activateCenterCard() {
    const cards = document.querySelectorAll('.sponsor-card');
    let closestCard = null;
    let minDistance = Infinity;
    const centerY = window.innerHeight / 2;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distance = Math.abs(centerY - cardCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestCard = card;
      }
    });

    // Remove 'active' from all cards
    cards.forEach(card => card.classList.remove('active'));

    // Add 'active' to the closest one
    if (closestCard) closestCard.classList.add('active');
  }

  // Aktifkan saat scroll & saat load
  window.addEventListener('scroll', activateCenterCard);
  window.addEventListener('load', activateCenterCard);
  window.addEventListener('resize', activateCenterCard);
