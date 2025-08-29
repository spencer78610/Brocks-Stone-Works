document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".gallery-img img");

  /* ========== Dropdown Menu ========== */
  const menuButtons = document.querySelectorAll(".gallery-filter-menu button");

  menuButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      images.forEach(img => {
        img.classList.toggle("hidden", filter !== "all" && img.dataset.set !== filter);
      });
    });
  });

  /* ========== Lightbox Controls ========== */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");

  let currentIndex = 0;

  const updateLightbox = () => {
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
  };

  function openLightbox(index) {
    currentIndex = index;
    lightbox.style.display = "flex";
    updateLightbox();
  }

  function closeLightbox() {
    lightbox.style.display = "none"; // fixed (was lightbox.style = "none")
  }

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  };

  images.forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
  });

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", showPrev);
  nextBtn.addEventListener("click", showNext);

  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", e => {
    if (lightbox.style.display === "flex") { // fixed (was using "=")
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") closeLightbox();
    }
  });

  /* ========== View More / View Less ========== */
  const viewMoreBtn = document.getElementById("viewMoreBtn");
  if (viewMoreBtn) {
    const initialVisible = 12;
    images.forEach((img, index) => {
      if (index >= initialVisible) img.classList.add("hidden-initial");
    });

    let expanded = false;
    viewMoreBtn.addEventListener("click", () => {
      expanded = !expanded;
      images.forEach((img, index) => {
        if (index >= initialVisible) {
          img.classList.toggle("hidden-initial", !expanded);
        }
      });
      viewMoreBtn.textContent = expanded ? "View Less" : "View More";
    });
  }
});
