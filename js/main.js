//  ========== dropdown menu ==========

document.addEventListener("DOMContentLoaded", () => {
  const menuButtons = document.querySelectorAll(".gallery-filter-menu button");
  const images = document.querySelectorAll(".gallery-img img");

  // Filter logic
  menuButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      images.forEach(img => {
        if (filter === "all" || img.dataset.set === filter) {
          img.classList.remove("hidden");
        } else {
          img.classList.add("hidden");
        }
      });
    });
  });
});

//  ========== lightbox controls ==========

document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".gallery-img img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");

  let currentIndex = 0;

  // Open Lightbox
  function openLightbox(index) {
    currentIndex = index;
    lightbox.style.display = "flex";
    lightboxImg.src = images[currentIndex].src;
    lightbox.alt = images[currentIndex].alt;
  }

  // close lightbox
  function closeLightbox() {
    lightbox.style = "none";
  }

  // Show previous image
  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
  }

  // Show next image
  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
  }

  // add click event to all images
  images.forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
  });

  // Event listeners
  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", showPrev);
  nextBtn.addEventListener("click", showNext);

  // close when clicking outside
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display = "flex") {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") closeLightbox();
    }
  });
});