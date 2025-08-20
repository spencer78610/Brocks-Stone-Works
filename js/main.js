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
