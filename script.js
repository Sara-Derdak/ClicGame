const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

let score = 0;
let timeRemaining = 20;
let gameInterval;
let timerInterval; // Ajout d'un intervalle séparé pour le timer
let objects = [];
let isGameOver = false;  // Flag pour éviter l'appel multiple de gameOver

const maxObjects = 5;

// Fonction pour générer un objet avec taille et couleur aléatoire
function generateObject() {
    const size = Math.random() * 30 + 20;
    const x = Math.random() * (canvas.width - size);
    const y = Math.random() * (canvas.height - size);
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Couleur aléatoire

    return {
        x,
        y,
        size,
        color,
        clicked: false
    };
}

// Fonction pour dessiner les objets
function drawObjects() {
    objects.forEach(object => {
        if (!object.clicked) {
            ctx.beginPath();
            ctx.arc(object.x, object.y, object.size, 0, Math.PI * 2);
            ctx.fillStyle = object.color;
            ctx.fill();
            ctx.closePath();
        }
    });
}

// Fonction pour vérifier si l'utilisateur clique sur un objet
function checkClick(x, y) {
    objects.forEach(object => {
        const distance = Math.sqrt(Math.pow(x - object.x, 2) + Math.pow(y - object.y, 2));
        if (distance < object.size && !object.clicked) {
            object.clicked = true;
            score++;
            scoreElement.textContent = `Score: ${score}`;
            replaceObject(object); // Remplacer l'objet cliqué par un nouveau
            // Ajout d'une animation de clic (changer la couleur de l'objet)
            animateClick(object);
        }
    });
}

// Animation de l'objet cliqué (changement de couleur)
function animateClick(object) {
    const originalColor = object.color;
    object.color = 'yellow';
    setTimeout(() => {
        object.color = originalColor;
    }, 200);
}

// Fonction pour remplacer un objet cliqué par un autre
function replaceObject(object) {
    const index = objects.indexOf(object);
    if (index > -1) {
        objects.splice(index, 1); // Supprimer l'objet cliqué
    }
    objects.push(generateObject()); // Ajouter un nouvel objet
}

// Fonction pour ajouter des objets (garantir qu'il y en a toujours 5)
function addObjects() {
    while (objects.length < maxObjects) {
        objects.push(generateObject());
    }
}

// Fonction pour afficher le timer
function updateTimer() {
    if (timeRemaining > 0 && !isGameOver) {  // Vérification du flag isGameOver
        timeRemaining--;
        timerElement.textContent = `Temps restant: ${timeRemaining}s`;
    } else if (timeRemaining <= 0 && !isGameOver) { // Si le temps est écoulé et le jeu n'est pas encore terminé
        isGameOver = true;  // Empêcher l'appel multiple de gameOver
        clearInterval(timerInterval); // Arrêter l'intervalle du timer
        gameOver();
    }
}

// Fonction de fin de jeu
function gameOver() {
    alert(`Temps écoulé! Votre score final est : ${score}`);
    askToPlayAgain();  // Demander à l'utilisateur s'il veut rejouer
}

// Fonction pour poser la question de recommencer
function askToPlayAgain() {
    const playAgain = confirm("Voulez-vous jouer à nouveau ?");
    if (playAgain) {
        resetGame();  // Réinitialiser le jeu
    } else {
        // Vous pouvez ajouter du code ici pour arrêter le jeu ou fermer l'application.
        alert("Merci d'avoir joué !");
    }
}

// Fonction pour réinitialiser le jeu
function resetGame() {
    // Réinitialisation des variables
    score = 0;
    timeRemaining = 20;  // Réinitialisation du timer
    objects = [];        // Vider le tableau d'objets
    isGameOver = false;  // Réinitialiser le flag de fin de jeu
    scoreElement.textContent = `Score: ${score}`;
    timerElement.textContent = `Temps restant: ${timeRemaining}s`;

    // Si un intervalle de jeu est déjà actif, on l'arrête
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    // Si un intervalle du timer est déjà actif, on l'arrête
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // Ajout des objets au jeu
    addObjects();  // Ajout des objets après réinitialisation

    // Démarre un nouvel intervalle pour mettre à jour le timer
    timerInterval = setInterval(updateTimer, 1000); // Mise à jour du timer toutes les secondes

    // Démarre la boucle principale immédiatement après la réinitialisation
    gameIntervalLoop();
}

// Fonction principale du jeu
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawObjects();
    addObjects();
}

// Fonction pour la boucle principale avec le frame rate souhaité (30 fps)
function gameIntervalLoop() {
    gameInterval = setInterval(gameLoop, 1000 / 30); // 30 fps
}

// Gérer les clics de l'utilisateur
canvas.addEventListener('click', (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    checkClick(x, y);
});

// Démarrer le jeu au chargement de la page
resetGame();  // Initialisation du jeu au début

// Réinitialiser le jeu quand l'utilisateur clique sur le bouton
resetButton.addEventListener('click', resetGame);
