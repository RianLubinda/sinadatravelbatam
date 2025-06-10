 // Fungsi untuk deteksi apakah elemen berada di tengah layar
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('hovered');
      } else {
        entry.target.classList.remove('hovered');
      }
    });
  }, {
    threshold: 1.0 // aktif saat setengah elemen terlihat
  });

  // Apply ke semua sponsor item
  document.querySelectorAll('.sponsor-item').forEach(item => {
    observer.observe(item);
  });
