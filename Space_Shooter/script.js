const container = document.getElementById("container");
const bullets = [];
const plane = document.getElementById("plane");
const startButton = document.getElementById("start-button");
const startPanel = document.getElementById("start-panel");
const startInstructions = document.getElementById("start-instructions");
let planeYaxis = 100;
let bulletYaxis = 0;
const planeMover = 50;
let score = 0; // Initialize the score

startButton.addEventListener("click", () => {
    startPanel.style.display = "none";
    startInstructions.style.display = "none";
    startGame();
});

function startGame() {
    generateRandomElements();

    // Event listeners for keydown events
    document.addEventListener("keydown", (event) => {
        if (event.key === "w") {
            moveUp();
        } else if (event.key === "s") {
            moveDown();
        }
    });

    // Event listeners for button clicks
    const upButton = document.getElementById("upbutton");
    const downButton = document.getElementById("downbutton");

    upButton.addEventListener("click", moveUp);
    downButton.addEventListener("click", moveDown);

    function moveUp() {
        planeYaxis = Math.max(100, planeYaxis - planeMover);
        bulletYaxis = Math.max(0, bulletYaxis - planeMover);
        plane.style.top = planeYaxis + "px";
        container.style.top = bulletYaxis + "px";
    }

    function moveDown() {
        planeYaxis = Math.min(570, planeYaxis + planeMover);
        bulletYaxis = Math.min(470, bulletYaxis + planeMover);
        plane.style.top = planeYaxis + "px";
        container.style.top = bulletYaxis + "px";
    }

    function createBullet() {
        const bullet = document.createElement("div");
        bullet.className = "bullet";
        container.appendChild(bullet);
        bullets.push(bullet);
        let position = 40;
        let speed = 10;

        const bulletMove = () => {
            position += speed;
            bullet.style.left = position + "px";

            if (position > container.clientWidth) {
                bullets.splice(bullets.indexOf(bullet), 1);
                container.removeChild(bullet);
            } else {
                checkCollisions(bullet);
                requestAnimationFrame(bulletMove);
            }
        };

        bulletMove();
    }

    setInterval(createBullet, 800);

    // Update the score when an element is removed
    function updateScore() {
        score += 10;
        document.getElementById("score").textContent = "Score: " + score;
    }

    function checkCollisions(bullet) {
        const bulletRect = bullet.getBoundingClientRect();
        const elements = document.querySelectorAll(".moving-element");

        elements.forEach((element) => {
            const elementRect = element.getBoundingClientRect();

            if (
                bulletRect.right > elementRect.left &&
                bulletRect.left < elementRect.right &&
                bulletRect.bottom > elementRect.top &&
                bulletRect.top < elementRect.bottom
            ) {
                vessel.removeChild(element);
                updateScore(); // Increase the score
            }
        });
    }
}

const gameOverElement = document.getElementById("game-over");
const restartButton = document.getElementById("restart-button");
const initialPlanePosition = 100;
const initialBulletPosition = 0;
let isGameOver = false;

function showGameOver() {
gameOverElement.style.display = "block";
const gameOverMessage = document.createElement("h2");
gameOverMessage.textContent = "Your Score: " + score;
gameOverElement.appendChild(gameOverMessage);
isGameOver = true;
}


function restartGame() {
while (gameOverElement.firstChild) {
gameOverElement.removeChild(gameOverElement.firstChild);
}

gameOverElement.style.display = "none";
planeYaxis = initialPlanePosition;
bulletYaxis = initialBulletPosition;
plane.style.top = planeYaxis + "px";
container.style.top = bulletYaxis + "px";
isGameOver = false;
score = 0; // Reset the score
document.getElementById("score").textContent = "Score: " + score; // Reset the score display
generateRandomElements();
}


// Add an event listener for the restart button
restartButton.addEventListener("click", restartGame);

const vessel = document.getElementById("vessel");

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function createMovingElement() {
    const element = document.createElement("div");
    element.className = "moving-element";
    vessel.appendChild(element);

    const startRight = vessel.clientWidth;
    const startY = getRandom(0, vessel.clientHeight - 100);
    element.style.top = startY + "px";
    element.style.left = startRight + "px";
    const speed = getRandom(7, 8);

    function moveElement() {
        const currentPosition = parseFloat(element.style.left);
        element.style.left = currentPosition - speed + "px";
        if (currentPosition < 5) {
            vessel.removeChild(element);
            if (!isGameOver) {
                showGameOver();
            }
        } else {
            requestAnimationFrame(moveElement);
        }
    }

    moveElement();
}

function generateRandomElements() {
    if (isGameOver) {
        return;
    }
    createMovingElement();
    setTimeout(generateRandomElements, getRandom(500, 1200)); // This code helps in generating rocks faster or slower!!
}