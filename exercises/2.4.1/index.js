let counter = 0;
let currentClicks = 0;
let startTime;
let timeoutID;

const button = document.querySelector(".button");
const message = document.querySelector(".message");

button.addEventListener("mouseover", startCounter);
button.addEventListener("click", clickHandler);

function startCounter() {
    startTime = new Date();
    timeoutID = setTimeout(printloss, 5000);
}

function clickHandler() {
    ++currentClicks;

    if(currentClicks == 10) {
        clearTimeout(timeoutID);
        win();
    }
}

function win() {
    const timeSpent = new Date().getTime() - startTime.getTime();
    button.style.display = "none";
    message.innerHTML = `You win ! you clicked 10 times within ${timeSpent}s!`;
}

function printloss() {
    button.style.display = "none";
    message.innerHTML = "Game over, you did not click 10 times within 5s!"
}