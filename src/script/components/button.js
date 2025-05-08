const nextButton = document.querySelector("#nextButton");
const confirmButton = document.querySelector("#confirmButton");

console.log(nextButton);
console.log(confirmButton);

const initialPageForm = document.querySelector('.initialPageForm');
const secondPageForm = document.querySelector(".secondPageForm");

const buttonActions = () => {
    return {
      next: () => {
        if (nextButton) {nextButton.classList.add("hidden");}
        if (initialPageForm) {initialPageForm.classList.add("hidden");}
        if (secondPageForm) {secondPageForm.classList.remove("hidden");}
        if (confirmButton) {confirmButton.classList.remove("hidden");}
        console.log("Função 'next' chamada.");
      },
      confirm: () => {
        if (nextButton) {nextButton.classList.remove("hidden");}
        if (confirmButton) {confirmButton.classList.add("hidden");}
        if (initialPageForm) {initialPageForm.classList.remove("hidden");}
        if (secondPageForm) {secondPageForm.classList.add("hidden");}

        console.log("Função 'confirm' chamada.");
      }
    };
  };
  
  const actions = buttonActions();
  
  nextButton.addEventListener("click", actions.next);
  confirmButton.addEventListener('click', actions.confirm);
  