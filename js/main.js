document.addEventListener("DOMContentLoaded", () => {
  /* ===================== Hamburger Menu ===================== */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      console.log("hamburger working");
      navLinks.classList.toggle("open");
      hamburger.classList.toggle("active");
    });
  }
});
