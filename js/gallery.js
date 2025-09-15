document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.querySelector(".gallery-img");
  const viewMoreBtn = document.getElementById("viewMoreBtn");
  const filterBtn = document.querySelector(".gallery-filter-btn");
  const filterMenu = document.querySelector(".gallery-filter-menu");

  let images = [];
  let expanded = false;
  let currentFilter = "all";
  let currentIndex = 0;
  const batchSize = 12;

  /* ===================== Load Gallery ===================== */
  async function loadGallery() {
    const response = await fetch("gallery.json");
    images = await response.json();
    renderGallery();
    checkURLParam();
  }

  /* ===================== Render Gallery ===================== */
  function renderGallery() {
    galleryContainer.innerHTML = "";

    const filteredImages = currentFilter === "all"
      ? images
      : images.filter(img => img.set === currentFilter);

    const slice = expanded ? filteredImages : filteredImages.slice(0, batchSize);

    slice.forEach(imgData => {
      const img = document.createElement("img");
      img.src = imgData.src;
      img.alt = imgData.alt;
      img.dataset.set = imgData.set;
      img.dataset.slug = imgData.slug;
      img.loading = "lazy";

      const globalIndex = images.findIndex(i => i.slug === imgData.slug);
      img.addEventListener("click", () => openLightbox(globalIndex));

      galleryContainer.appendChild(img);
    });

    // View More / Less button
    if (filteredImages.length > batchSize) {
      viewMoreBtn.style.display = "inline-block";
      viewMoreBtn.textContent = expanded ? "View Less" : "View More";
    } else {
      viewMoreBtn.style.display = "none";
    }
  }

  /* ===================== View More / Less ===================== */
  viewMoreBtn.addEventListener("click", () => {
    expanded = !expanded;
    renderGallery();
  });

  /* ===================== Dropdown Toggle ===================== */
  filterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    filterMenu.classList.toggle("show");
  });

  // Close menu when clicking outside
  document.addEventListener("click", () => {
    filterMenu.classList.remove("show");
  });

  // Event delegation for filter buttons
  filterMenu.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    currentFilter = btn.dataset.filter;
    expanded = false;
    renderGallery();
    filterMenu.classList.remove("show");
  });

  /* ===================== Lightbox ===================== */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");

  function updateLightbox() {
    const imgData = images[currentIndex];
    lightboxImg.src = imgData.src;
    lightboxImg.alt = imgData.alt;

    const url = new URL(window.location);
    url.searchParams.set("img", imgData.slug);
    window.history.replaceState({}, "", url);
  }

  function openLightbox(index) {
    currentIndex = index;
    lightbox.style.display = "flex";
    updateLightbox();
  }

  function closeLightbox() {
    lightbox.style.display = "none";
    const url = new URL(window.location);
    url.searchParams.delete("img");
    window.history.replaceState({}, "", url);
  }

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  };

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", showPrev);
  nextBtn.addEventListener("click", showNext);

  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", e => {
    if (lightbox.style.display === "flex") {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") closeLightbox();
    }
  });

  /* ===================== Open from URL ===================== */
  function checkURLParam() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("img");
    if (slug) {
      const index = images.findIndex(img => img.slug === slug);
      if (index !== -1) {
        expanded = true;
        currentFilter = images[index].set;
        renderGallery();
        openLightbox(index);
      }
    }
  }

  /* ===================== Initialize ===================== */
  loadGallery();
});
