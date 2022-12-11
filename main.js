document.addEventListener("DOMContentLoaded", () => {
  // DOM connections:
  const parentDiv = document.getElementById("parent");
  const result = document.getElementById("resultDisplay");
  const scores = document.getElementById("scores");
  createChildDivs();
  const allSquares = document.querySelectorAll("#parent div");
  const increaseSpeed = document.getElementById("increaseSpeed");
  const decreaseSpeed = document.getElementById("decreaseSpeed");
  const speed = document.getElementById("speed");
  const startBtn = document.getElementById("startBtn");

  let curPosition = 217;
  const rowDivWidth = 15;
  let invaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39,
  ];
  let invadersRemoved = [];
  let direction = 1;
  let goingRight = true;
  let scoring = 0;
  let moveInvaders;
  let gameStart = false;
  let finished = false;
  let invadersSpeed = 5;

  console.log(invadersRemoved);

  // || C O N T R O L L E R:
  createShooter();
  createInvaders();

  startBtn.addEventListener("click", () => {
    if (!gameStart && !finished) {
      document.addEventListener("keydown", moveShooter);
      document.addEventListener("keydown", shots);
      moveInvaders = setInterval(invadersMove, invadersSpeed * 100);
      gameStart = true;
    } else if (gameStart && !finished) {
      alert("The Game has already started!");
    } else if (!gameStart && finished) {
      location.reload();
    }
  });

  increaseSpeed.addEventListener("click", () => {
    if (invadersSpeed < 10 && !gameStart) {
      invadersSpeed += 1;
      speed.textContent = invadersSpeed;
      if (invadersSpeed === 10) {
        speed.textContent = "max";
      }
    } else {
      alert("Please, set the speed before starting the Game!");
    }
  });

  decreaseSpeed.addEventListener("click", () => {
    if (invadersSpeed > 1 && !gameStart) {
      invadersSpeed -= 1;
      speed.textContent = invadersSpeed;
      if (invadersSpeed === 1) {
        speed.textContent = "min";
      }
    } else {
      alert("Please, set the speed before starting the Game!");
    }
  });

  // || M O D E L:
  function createChildDivs() {
    for (let i = 0; i < 225; i++) {
      const square = document.createElement("div");
      square.classList.add("squares");
      parentDiv.appendChild(square);
    }
  }

  function createInvaders() {
    for (let i = 0; i < invaders.length; i++) {
      if (!invadersRemoved.includes(i)) {
        allSquares[invaders[i]].classList.add("invader");
      }
    }
  }

  function removeInvaders() {
    for (let i = 0; i < invaders.length; i++) {
      allSquares[invaders[i]].classList.remove("invader");
    }
  }

  function createShooter() {
    allSquares[217].classList.add("shooter");
  }

  // || V I E W:
  function moveShooter(e) {
    allSquares[curPosition].classList.remove("shooter");
    switch (e.key) {
      case "ArrowLeft":
        if (curPosition % rowDivWidth !== 0) {
          curPosition -= 1;
        }
        break;
      case "ArrowRight":
        if (curPosition % rowDivWidth < rowDivWidth - 1) {
          curPosition += 1;
        }
        break;
      case "ArrowUp":
        if (curPosition - rowDivWidth >= 180) {
          curPosition -= rowDivWidth;
        }
        break;
      case "ArrowDown":
        if (curPosition + rowDivWidth < rowDivWidth * rowDivWidth) {
          curPosition += rowDivWidth;
        }
        break;
    }
    allSquares[curPosition].classList.add("shooter");
  }

  function shots(e) {
    let curShotPosition = curPosition;
    let moveShotsUp;

    function moveShots() {
      allSquares[curShotPosition].classList.remove("shots");
      curShotPosition -= rowDivWidth;
      allSquares[curShotPosition].classList.add("shots");

      if (allSquares[curShotPosition].classList.contains("invader")) {
        allSquares[curShotPosition].classList.remove("shots");
        allSquares[curShotPosition].classList.remove("invader");
        clearInterval(moveShotsUp);

        invadersRemoved.push(invaders.indexOf(curShotPosition));
        scoring += 1;
        scores.innerHTML = scoring;
      }
    }

    switch (e.key) {
      case "s":
        moveShotsUp = setInterval(moveShots, 100);
        break;
    }
  }

  //Invader Move Function:
  function invadersMove() {
    let leftEdge = invaders[0] % rowDivWidth === 0;
    let rightEdge =
      invaders[invaders.length - 1] % rowDivWidth === rowDivWidth - 1;

    removeInvaders();

    if (rightEdge && goingRight === true) {
      for (let a = 0; a < invaders.length; a++) {
        invaders[a] += rowDivWidth + 1;
        direction = -1;
        goingRight = false;
      }
    } else if (leftEdge && !goingRight) {
      for (let a = 0; a < invaders.length; a++) {
        invaders[a] += rowDivWidth - 1;
        direction = 1;
        goingRight = true;
      }
    }

    for (let a = 0; a < invaders.length; a++) {
      invaders[a] += direction;
    }

    createInvaders();
    winORlose();
  }

  function winORlose() {
    if (allSquares[curPosition].classList.contains("invader", "shooter")) {
      allSquares[curPosition].classList.remove("invader");
      allSquares[curPosition].classList.remove("shooter");
      allSquares[curPosition].classList.add("loss");
      document.removeEventListener("keydown", moveShooter);
      document.removeEventListener("keydown", shots);
      clearInterval(moveInvaders);
      result.textContent = "Game Over";
      result.style.color = "red";
      startBtn.textContent = "reload";
      gameStart = false;
      finished = true;
    } else if (invaders.length === invadersRemoved.length) {
      clearInterval(moveInvaders);
      document.removeEventListener("keydown", moveShooter);
      document.removeEventListener("keydown", shots);
      result.textContent = "Wohoo, You killed all Invaders";
      result.style.color = "green";
      startBtn.textContent = "reload";
      gameStart = false;
      finished = true;
    } else {
      for (let i = 0; i < invaders.length; i++) {
        if (invaders[i] >= allSquares.length - rowDivWidth) {
          clearInterval(moveInvaders);
          document.removeEventListener("keydown", moveShooter);
          document.removeEventListener("keydown", shots);
          result.textContent = "Game Over";
          result.style.color = "red";
          startBtn.textContent = "reload";
          gameStart = false;
          finished = true;
        }
      }
    }
  }





});
