console.log("app.js loaded");

const navButtons = document.querySelectorAll(".nav-button");
const pageSections = document.querySelectorAll(".page-section");

navButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const selectedPage = button.dataset.page;

        navButtons.forEach(function(navButton) {
            navButton.classList.toggle(
                "active",
                navButton === button
            );
        });
        
        pageSections.forEach(function(section) {
            section.hidden = section.id !== selectedPage;
        });
    });
});

const picksForm = document.querySelector("#picks-form");
const formMessage = document.querySelector("#form-message");

picksForm.addEventListener("submit", function(event) {
  event.preventDefault();

  formMessage.textContent =
    "Sample picks passed validation. Saving will be connected later.";
});