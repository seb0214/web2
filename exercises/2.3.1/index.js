const souhait = document.querySelector("#souhait");
const formulaire = document.querySelector("form");
const valeurSouhait = document.querySelector("#valeurSouhait");

formulaire.addEventListener("submit", (e) => {
    e.preventDefault();
    formulaire.style.display = 'none';
    valeurSouhait.innerHTML = `${souhait.value}`;
});