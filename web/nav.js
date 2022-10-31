const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
mobileNavToggle.addEventListener("click", () => {
  const nav = document.querySelector(".side-menu");
  nav.toggleAttribute("data-open");

  // check if data-open is set, and swap the icon accordingly
  if (mobileNavToggle.getAttribute("data-open") === null) {
    mobileNavToggle.innerHTML = "close";
  } else {
    mobileNavToggle.innerHTML = "menu";
  }
  mobileNavToggle.toggleAttribute("data-open");
});
