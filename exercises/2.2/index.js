let counter = 0;
let nbClicks = document.querySelector('.counter');
let messages = document.querySelector('.message');

window.addEventListener('click', () => {
    ++counter;
    nbClicks.textContent = counter;
    if(counter === 5) messages.textContent = "Bravo, bel échauffement !";
    else if(counter === 10) messages.textContent = "Vous êtes passé maître en l'art du clic !";
});