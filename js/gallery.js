document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.querySelector(".gallery-img");
  const viewMoreBtn = document.getElementById("viewMoreBtn");
  const menuButtons = document.querySelectorAll(".gallery-filter-menu button");

  let images = [];             // all images from JSON
  let expanded = false;        // track View More / Less
  let currentFilter = "all";   // track current category
  let currentIndex = 0;        // for lightbox
  const batchSize = 12;        // first N images to show

  /* ===================== Load Gallery from JSON ===================== */
  async function loadGallery() {
    const response = await fetch("gallery.json");
    images = await response.json();
    renderGallery();
    checkURLParam(); // open image from URL if present
  }

  /* ===================== Render Gallery ===================== */
  function renderGallery() {
    galleryContainer.innerHTML = "";

    // Filter images first
    const filteredImages = currentFilter === "all"
      ? images
      : images.filter(img => img.set === currentFilter);

    // Determine slice to render based on expanded state
    const slice = expanded ? filteredImages : filteredImages.slice(0, batchSize);

    slice.forEach((imgData, index) => {
      const img = document.createElement("img");
      img.src = imgData.src;
      img.alt = imgData.alt;
      img.dataset.set = imgData.set;
      img.dataset.slug = imgData.slug;
      img.loading = "lazy";

      // Use global index for lightbox
      const globalIndex = images.findIndex(i => i.slug === imgData.slug);
      img.addEventListener("click", () => openLightbox(globalIndex));

      galleryContainer.appendChild(img);
    });

    // Update View More / Less button text
    if (filteredImages.length > batchSize) {
      viewMoreBtn.style.display = "inline-block";
      viewMoreBtn.textContent = expanded ? "View Less" : "View More";
    } else {
      viewMoreBtn.style.display = "none";
    }
  }

  /* ===================== View More / View Less ===================== */
  viewMoreBtn.addEventListener("click", () => {
    expanded = !expanded;
    renderGallery();
  });

  /* ===================== Filter Buttons ===================== */
  menuButtons.forEach(button => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      expanded = false; // reset to first batch on new filter
      renderGallery();
    });
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

    // Update URL slug
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

  /* ===================== Open from URL param on load ===================== */
  function checkURLParam() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("img");
    if (slug) {
      const index = images.findIndex(img => img.slug === slug);
      if (index !== -1) {
        // expand gallery if filtered, to make image visible
        expanded = true;
        // set filter to match image category
        currentFilter = images[index].set;
        renderGallery();
        openLightbox(index);
      }
    }
  }

  /* ===================== Initialize ===================== */
  loadGallery();
});
