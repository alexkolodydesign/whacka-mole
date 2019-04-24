// Obligatory self-invoking anonymous function
(function() {
  // Constants
  const BOARD = document.getElementById("play_area");
  const MOLE_ROWS = BOARD.children;
  const BOARD_INTERVAL = 750;
  const RANDOMNESS = 12;
  const SCORE_AREA = document.getElementById("score_area");
  const START = document.getElementById("start");
  const RESET = document.getElementById("reset");
  const STOP = document.getElementById("stop");
  const TIME = 15000;
  const TIME_AREA = document.getElementById("time_area");

  // ready the game for play!
  setInterval(displayBoard, BOARD_INTERVAL);

  // Gameboard stuff
  let score = 0;
  let misses = 0;
  let timeLeft = TIME;
  let gameInProgress = false;
  let gameFinished = false;

  // LISTENERS
  // Mole hole listeners
  for (let i = 0; i < MOLE_ROWS.length; i += 1) {
    const row = MOLE_ROWS[i];
    for (let k = 0; k < row.children.length; k += 1) {
      row.children[k].addEventListener("click", hammerTime);
    }
  }
  // Start button listener
  START.addEventListener("click", function() {
    // Update board status every 750ms
    START.setAttribute("disabled", true);
    gameInProgress = true;
    STOP.removeAttribute("disabled");
    RESET.removeAttribute("disabled");
  });
  // Reset button listener
  RESET.addEventListener("click", function() {
    clearBoard();
  });
  // Stop button listener
  STOP.addEventListener("click", function() {
    gameInProgress = false;
    START.removeAttribute("disabled");
    STOP.setAttribute("disabled", true);
  });

  // Go through gameboard and determine moles and score
  function displayBoard() {
    if (gameFinished) {
      alert("TIMES UP! Score: " + score + "Misses: " + misses);
      clearBoard();
    }
    // If game is not in progress do not display anything new!
    if (!gameInProgress) return;
    // Show current score
    SCORE_AREA.innerHTML =
      "<p>Score: " + score + "</p><p>Misses: " + misses + "</p>";
    // Show timer
    showTimer();
    // Show moles if any
    // TODO: refactor from O(n^2) to something better, depending on play_area size
    for (let i = 0; i < MOLE_ROWS.length; i += 1) {
      const row = MOLE_ROWS[i];
      for (let k = 0; k < row.children.length; k += 1) {
        randomlyShowMole(row.children[k]);
      }
    }
  }

  function showTimer() {
    // Show in seconds
    const displayTimeLeft = Math.floor(timeLeft / 1000);
    TIME_AREA.innerHTML = "Time left: " + displayTimeLeft + "seconds";
    timeLeft = timeLeft - BOARD_INTERVAL;
    if (timeLeft <= 0) {
      gameInProgress = false;
      gameFinished = true;
    }
  }

  function clearBoard() {
    score = 0;
    misses = 0;
    timeLeft = TIME;
    gameInProgress = false;
    gameFinished = false;
    START.removeAttribute("disabled");
    STOP.setAttribute("disabled", true);
    RESET.setAttribute("disabled", true);
    for (let i = 0; i < MOLE_ROWS.length; i += 1) {
      const row = MOLE_ROWS[i];
      for (let k = 0; k < row.children.length; k += 1) {
        row.children[k].classList.remove("mole");
        row.children[k].classList.remove("butchered");
      }
    }
    // Show current score
    SCORE_AREA.innerHTML =
      "<p>Score: " + score + "</p><p>Misses: " + misses + "</p>";
    // Show timer
    showTimer();
  }

  // Return random time to show mole from 1 through RANDOMNESS
  function setRandomTime() {
    return Math.floor(Math.random() * RANDOMNESS);
  }

  // Randomly display mole while respecting lock status
  function randomlyShowMole(moleHole) {
    if (!moleHole.dataset.showMole) {
      moleHole.dataset.showMole = setRandomTime();
    }
    if (Number(moleHole.dataset.showMole) === 0) {
      moleHole.classList.add("mole");
      moleHole.dataset.showMole = setRandomTime();
    } else {
      moleHole.classList.remove("mole");
      if (moleHole.classList.contains("butchered")) {
        moleHole.classList.remove("butchered");
      }
      moleHole.dataset.showMole = Number(moleHole.dataset.showMole) - 1;
    }
  }

  // On click decide if user gets a point or not
  function hammerTime() {
    if (!gameInProgress && !gameFinished && this.classList.contains("mole")) {
      alert("NO CHEATING");
      return;
    }
    if (
      this.classList.contains("mole") &&
      !this.classList.contains("butchered")
    ) {
      score += 1;
      this.classList.add("butchered");
    } else {
      misses += 1;
    }
  }
})();

// OTHER TODOS:
// Refactor to a singleton class
